import { api } from './api';

export type ContactSubject =
  | 'general'
  | 'support'
  | 'pricing'
  | 'partnership'
  | 'kvkk';

export interface ContactPayload {
  name: string;
  email: string;
  subject: ContactSubject;
  message: string;
  /**
   * 🔴 Bot tuzağı (`HasHoneypot::HONEYPOT_FIELD`). Değer formdan gelir ve
   * burada sabitlenmez — sabitleseydik botun yazdığı değer atılır, tuzak
   * kurulmamış olurdu. Dolu gelirse backend 204 döner ve kaydetmez (L2).
   */
  website: string;
}

/**
 * İletişim formu mesajını backend'e iletir.
 *
 * 🔴 Uç `/public/contact` önekindedir (K12/K76): auth gerektirmeyen yüzeyin
 * tamamı tek önekte durur. Düz `/contact` diye bir uç yok.
 *
 * Mesaj sunucuda `contact_messages` tablosuna yazılır. Bunun ötesinde bir
 * bildirim kanalı **bugün yoktur** — eski docblock "destek ekibine
 * yönlendirilir" diyordu ve kodda karşılığı olmayan bir sözdü (B4).
 *
 * Başarısız istekler çağırana fırlatılır ki arayüz dürüst bir hata
 * gösterebilsin.
 */
export async function sendContactMessage(payload: ContactPayload): Promise<void> {
  await api.post('/public/contact', payload);
}
