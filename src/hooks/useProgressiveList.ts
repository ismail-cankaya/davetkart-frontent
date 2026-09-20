import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export interface ProgressiveListOptions {
  /** İlk açılışta çizilecek öğe sayısı. */
  initial?: number;
  /** Her "daha fazla" adımında eklenecek öğe sayısı. */
  step?: number;
  /**
   * Sentinel görünüre girdiğinde bir sonraki parti kendiliğinden yüklensin mi?
   * (e-ticaret ızgaralarındaki sonsuz kaydırma davranışı)
   */
  auto?: boolean;
  /**
   * Bu indeksteki öğe ilk partide MUTLAKA görünür olsun. Seçili tema listenin
   * 27. sırasındaysa kullanıcı ekrana döndüğünde seçimini görebilmelidir —
   * aksi hâlde "seçimim kayboldu" hissi doğar.
   */
  ensureIndex?: number;
  /**
   * Liste sayfanın kendisinde değil, kendi kaydırma kabında duruyorsa (modal
   * gövdesi gibi) o kap. Verilmezse görünür alan (viewport) kullanılır.
   */
  root?: React.RefObject<HTMLElement | null>;
  /**
   * Sentinel'in görünür alana ne kadar kala tetikleneceği.
   *
   * Geniş bir pay (öntanımlı 400px) partiyi kullanıcı ızgaranın sonunu
   * görmeden hazırlar: kesintisiz kaydırma. Ancak ızgara altında bir yükleme
   * göstergesi varsa bu pay göstergeyi ekran dışında oynatır — kullanıcı
   * aşağı vardığında iş çoktan bitmiştir. Göstergeli listeler bu yüzden daha
   * dar bir pay verir.
   */
  rootMargin?: string;
}

export interface ProgressiveList<T> {
  /** Şu an çizilmesi gereken dilim. */
  visible: T[];
  /** Henüz açılmamış öğe var mı? */
  hasMore: boolean;
  /** Geriye kalan öğe sayısı — düğme metninde gösterilir. */
  remaining: number;
  /** Toplam öğe sayısı. */
  total: number;
  /** Bir sonraki partiyi açar. */
  showMore: () => void;
  /**
   * Izgaranın sonuna konan elemana bağlanır; `auto` açıkken bu eleman
   * görünüre girdiğinde sonraki parti yüklenir.
   */
  sentinelRef: React.RefObject<HTMLDivElement | null>;
  /**
   * Son açılan partinin başlangıç indeksi. Giriş animasyonunun gecikmesi buna
   * göre hesaplanır; yoksa 30. kart 2.4 saniye sonra belirir, daha önce
   * çizilmiş kartlar da her partide yeniden oynardı.
   */
  batchStart: number;
}

interface ProgressiveState {
  count: number;
  batchStart: number;
}

/**
 * Uzun listeleri partiler hâlinde açar.
 *
 * Kategori başına 25-35 tema var; hepsini tek seferde basmak hem ilk boyamayı
 * geciktirir hem de kullanıcıyı bir duvarla karşılar. Bunun yerine ilk parti
 * hemen çizilir, gerisi kaydırmayla kendiliğinden ya da düğmeyle gelir.
 *
 * ⚠️ `items` referans olarak kararlı olmalıdır (bkz. `getTemplatesForCategory`
 * önbelleği). Her render'da yeni bir dizi verilirse sayaç sürekli sıfırlanır.
 */
export function useProgressiveList<T>(
  items: readonly T[],
  {
    initial = 8,
    step = 8,
    auto = true,
    ensureIndex = -1,
    root,
    rootMargin = '400px 0px'
  }: ProgressiveListOptions = {}
): ProgressiveList<T> {
  // İlk parti seçili öğeyi de kapsayacak kadar büyütülür, ama parti
  // katlarına yuvarlanır ki ızgara yarım satırla başlamasın.
  const floor = useMemo(() => {
    if (ensureIndex < initial) return initial;
    const extra = Math.ceil((ensureIndex + 1 - initial) / step) * step;
    return initial + extra;
  }, [initial, step, ensureIndex]);

  const [state, setState] = useState<ProgressiveState>(() => ({ count: floor, batchStart: 0 }));

  /**
   * Kategori değişti → sayaç başa döner. Bu, `useEffect` yerine render
   * sırasında yapılır: efektle yazılsaydı kullanıcı bir kare boyunca ÖNCEKİ
   * kategorinin açılmış uzun listesini görürdü. (React'in "türetilmiş durumu
   * render'da düzelt" deseni.)
   */
  const [source, setSource] = useState(items);
  if (source !== items) {
    setSource(items);
    setState({ count: floor, batchStart: 0 });
  }

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const total = items.length;

  /**
   * `floor` bir TABAN'dır, hedef değil.
   *
   * 🔴 Sıfırlama koşuluna dahil edilemez: `ensureIndex` seçim değiştikçe
   * değişir, dolayısıyla `floor` da değişir. Sıfırlasaydı, 32 tema açmış
   * kullanıcı 2. temaya tıkladığı anda ızgara 8 karta çöker — kendi tıklaması
   * yüzünden az önce gördüğü temaları kaybederdi.
   */
  const count = Math.min(Math.max(state.count, floor), total);
  const hasMore = count < total;

  const showMore = useCallback(() => {
    setState((current) => {
      // Taban, tıpkı render'daki gibi burada da uygulanır.
      const from = Math.min(Math.max(current.count, floor), items.length);
      if (from >= items.length) return current;
      return { count: Math.min(from + step, items.length), batchStart: from };
    });
  }, [items, step, floor]);

  // Sonsuz kaydırma. `rootMargin` sayesinde parti, sentinel ekrana girmeden
  // önce yüklenebilir; payı çağıran belirler (bkz. ProgressiveListOptions).
  useEffect(() => {
    if (!auto || !hasMore) return;

    const node = sentinelRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) showMore();
      },
      { root: root?.current ?? null, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [auto, hasMore, showMore, root, rootMargin]);

  const visible = useMemo(() => items.slice(0, count), [items, count]);

  return {
    visible,
    hasMore,
    remaining: Math.max(total - count, 0),
    total,
    showMore,
    sentinelRef,
    batchStart: state.batchStart
  };
}
