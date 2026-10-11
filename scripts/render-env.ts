/**
 * `verify:render` için en küçük tarayıcı ortamı (Faz 10, FE 10.23).
 *
 * Bazı modüller `window`'u yüklenirken okur (`useUIStore` → `matchMedia`);
 * bazı bileşenler ilk çizimde (`VideoBackdrop` → hareket azaltma tercihi).
 * Node'da ikisi de yok. Bu dosya betiğin İLK import'u olmalı: modüller
 * yüklenmeden önce sahte `window` ve bellekte bir `localStorage` kurar.
 *
 * Efektler sunucu çiziminde koşmaz; bu yüzden olay dinleyicileri boş.
 */
const mediaQuery = () => ({
  matches: false,
  addEventListener() {},
  removeEventListener() {},
  addListener() {},
  removeListener() {},
});

(globalThis as { window?: unknown }).window = {
  matchMedia: mediaQuery,
  innerWidth: 390,
  innerHeight: 844,
  devicePixelRatio: 1,
  addEventListener() {},
  removeEventListener() {},
};

const storage = new Map<string, string>();

(globalThis as { localStorage?: Storage }).localStorage = {
  getItem: (key: string) => storage.get(key) ?? null,
  setItem: (key: string, value: string) => void storage.set(key, String(value)),
  removeItem: (key: string) => void storage.delete(key),
  clear: () => storage.clear(),
  key: (index: number) => [...storage.keys()][index] ?? null,
  get length() {
    return storage.size;
  },
};
