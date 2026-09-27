/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the microservices API gateway (e.g. https://api.davetkart.com). */
  readonly VITE_API_BASE_URL?: string;
  /**
   * `'true'` → "Ulaşım Bilgileri" alanı yazılan metin için backend'den konum
   * önerisi ister (`GET /public/places/search`). Uç hazır olana kadar kapalı kalır;
   * bu bir özellik anahtarıdır, gizli değer DEĞİLDİR.
   */
  readonly VITE_PLACES_SEARCH_ENABLED?: string;
  /**
   * Havale/EFT hesabı — ödeme sayfasında (`/odeme`) müşteriye gösterilir.
   * Okuyan tek yer `services/bankTransfer.ts`. Üçünden biri eksikse ya da IBAN
   * sağlama toplamından geçmezse Havale/EFT seçeneği kapalı görünür.
   *
   * 🔴 `VITE_` önekli her değer derlemeye gömülür: bu bilgiler depodan uzak
   * tutulur ama tarayıcıdan gizli DEĞİLDİR (zaten her müşteriye gösterilirler).
   */
  readonly VITE_BANK_TRANSFER_BANK_NAME?: string;
  readonly VITE_BANK_TRANSFER_ACCOUNT_HOLDER?: string;
  readonly VITE_BANK_TRANSFER_IBAN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
