export interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  createdAt: number;
  /**
   * `error` baloncuğu asistanın *söylediği* bir şey değil, sistemin
   * kullanıcıya bildirdiği bir durumdur. Aynı kılıkta göstermek, kotanın
   * dolduğunu asistanın bir cevabı sanmaya yol açardı.
   */
  variant?: 'error';
}

/**
 * Yazma alanının neden kapalı olduğu.
 *
 * 🔴 İki sebep **aynı HTTP kodunu** (429) taşır ama farklı şeyler söyler:
 * *"günlük hakkın bitti"* geri gelmez, *"çok hızlısın"* birkaç saniyede
 * geçer. Tek bir "kapalı" durumu bu ikisini birbirine karıştırırdı.
 */
export type AssistantBlockReason = 'quota' | 'rate' | 'provider';

export interface AssistantBlock {
  reason: AssistantBlockReason;
  /** Yeniden denenebilecek an (epoch ms); `null` = bugünlük bitti. */
  until: number | null;
  /** Kullanıcıya gösterilen açıklama — `toDisplayError()` üretir. */
  message: string;
}

/** Pencerenin görünüm durumu: kapalı, simge (mini bar), açık veya tam ekran. */
export type AssistantWindowState = 'closed' | 'minimized' | 'open' | 'fullscreen';
