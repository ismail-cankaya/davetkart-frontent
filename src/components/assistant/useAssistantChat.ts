import { useCallback, useEffect, useRef, useState } from 'react';
import { AssistantBlock, AssistantMessage } from './types';
import { assistantService } from '../../services/assistant';
import { apiErrorCode } from '../../services/api';
import { retryAfterSeconds, toDisplayError } from '../../utils/toDisplayError';

const WELCOME_MESSAGE: AssistantMessage = {
  id: 'welcome',
  role: 'assistant',
  text: 'Merhaba! 👋 Ben DavetKart Asistanı. Davetiye tasarımı, şablon seçimi ve katılım takibi konularında yardımcı olmak için buradayım. Size nasıl yardımcı olabilirim?',
  createdAt: Date.now()
};

/**
 * Hatayı, yazma alanının kapatılması gereken bir duruma çevirir.
 *
 * 🔴 Üç kodun üçü de farklı bir şey anlatır ve üçü farklı davranış ister:
 *
 * | Kod | Yazma alanı |
 * |---|---|
 * | `ASSISTANT_QUOTA_EXCEEDED` | Bugünlük kapanır — hak yarın yenilenir |
 * | `RATE_LIMITED` | `retryAfter` boyunca kapanır, sonra açılır |
 * | `PROVIDER_UNAVAILABLE` | Kısa süre kapanır; hata kullanıcıda değil |
 *
 * Kota dolduğunda alanı açık bırakmak, kullanıcıyı her seferinde aynı
 * duvara çarpan boş istekler atmaya iterdi.
 */
function toBlock(error: unknown): AssistantBlock | null {
  const code = apiErrorCode(error);
  const seconds = retryAfterSeconds(error);
  const message = toDisplayError(error);

  switch (code) {
    case 'ASSISTANT_QUOTA_EXCEEDED':
      // `until` bilinse bile gün sonunu beklemenin anlamı yok: bu oturumda
      // yazma alanı bir daha açılmaz.
      return { reason: 'quota', until: null, message };

    case 'RATE_LIMITED':
      return { reason: 'rate', until: Date.now() + (seconds ?? 30) * 1000, message };

    case 'PROVIDER_UNAVAILABLE':
      return { reason: 'provider', until: Date.now() + (seconds ?? 30) * 1000, message };

    default:
      // Ağ hatası, 500, beklenmeyen gövde: tekrar denemek serbest.
      return null;
  }
}

/** Sohbet durumu ve mesaj gönderme mantığı — arayüzden tamamen bağımsız. */
export function useAssistantChat() {
  const [messages, setMessages] = useState<AssistantMessage[]>([WELCOME_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);
  const [block, setBlock] = useState<AssistantBlock | null>(null);
  const idCounter = useRef(0);

  // Süreli engel kendiliğinden kalkar; kullanıcının sayfayı yenilemesi
  // gerekmemeli. Kota engelinin (`until: null`) zamanlayıcısı yoktur.
  useEffect(() => {
    if (!block?.until) return;

    const remaining = block.until - Date.now();
    if (remaining <= 0) {
      setBlock(null);
      return;
    }

    const timer = setTimeout(() => setBlock(null), remaining);
    return () => clearTimeout(timer);
  }, [block]);

  const append = useCallback((message: Omit<AssistantMessage, 'id' | 'createdAt'>) => {
    setMessages(prev => [
      ...prev,
      { ...message, id: `msg-${++idCounter.current}`, createdAt: Date.now() }
    ]);
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || block) return;

      append({ role: 'user', text: trimmed });
      setIsTyping(true);

      try {
        const reply = await assistantService.chat(trimmed);
        append({ role: 'assistant', text: reply });
      } catch (error) {
        // Hata sohbetin İÇİNDE gösterilir: kullanıcı mesajını yazdı ve bir
        // karşılık bekliyor. Toast'a düşürmek, sohbeti cevapsız bırakırdı.
        append({ role: 'assistant', text: toDisplayError(error), variant: 'error' });
        setBlock(toBlock(error));
      } finally {
        setIsTyping(false);
      }
    },
    [append, block]
  );

  return { messages, isTyping, block, sendMessage };
}
