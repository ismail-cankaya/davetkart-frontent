/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the microservices API gateway (e.g. https://api.davetkart.com). */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
