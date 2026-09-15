import { api } from './api';

/**
 * AI asistan vekili — sistemin **para harcayan tek ucu**.
 *
 * 🔴 Uç **auth'ludur** ve bu bilinçli bir karardır: bir maliyet kontrolü
 * ancak harcamanın bir kimliğe yazılabildiği yerde kurulabilir. Anonim
 * çağrıda tek anahtar IP'dir ve IP iki yönde birden başarısızdır — CGNAT
 * arkasındaki on binlerce abone için fazla geniş, IP değiştirebilen bir
 * saldırgan için fazla dardır. Çelişkinin bedeli frontend'e yazıldı:
 * widget giriş yapmamış ziyaretçiye sohbet açmaz (bkz. `AssistantWidget`).
 *
 * 🔴 **Zaman aşımı uzatılmaz.** Backend'in en kötü durumu ~12.6 sn'ye göre
 * ayarlandı (K78) ve paylaşılan istemcinin sınırı 15 sn. Marj dar; uzatmak
 * sorunu gizler, çözmez.
 */
interface AssistantReplyEnvelope {
  data?: { reply?: unknown };
}

/** Kullanıcı mesajının üst sınırı — backend `assistant.max_prompt_chars`. */
export const ASSISTANT_MAX_PROMPT_CHARS = 2000;

export const assistantService = {
  /**
   * Tek bir mesaj gönderir ve asistanın yanıtını döndürür.
   *
   * Üç hata durumu ayrıdır ve ikisi **aynı HTTP kodunu** taşır:
   *
   * | Kod | HTTP | Ne demek |
   * |---|---|---|
   * | `ASSISTANT_QUOTA_EXCEEDED` | 429 | Günlük hak bitti |
   * | `RATE_LIMITED` | 429 | Çok sık istek |
   * | `PROVIDER_UNAVAILABLE` | 503 | Sağlayıcı yanıt veremiyor |
   *
   * Ayrım `error.code`'dadır, durum kodunda değil (K74).
   */
  async chat(message: string): Promise<string> {
    // 🔴 Zarf korunur: `{ data: { reply } }`. Auth uçları dışındaki her yanıt
    // zarflıdır (C2) ve bu uç o listede değildir.
    const { data } = await api.post<AssistantReplyEnvelope>('/assistant/chat', { message });
    const reply = data?.data?.reply;

    if (typeof reply !== 'string') {
      throw new Error('Unexpected /assistant/chat response shape');
    }

    return reply;
  },
};
