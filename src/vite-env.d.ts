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
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
