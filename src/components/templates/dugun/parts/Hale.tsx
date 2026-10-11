import React from 'react';
import { Halo } from '../../shared/effects';

type HaloProps = React.ComponentProps<typeof Halo>;

/**
 * Ortak `Halo`'yu dışarıdan kısan sarmalayıcı.
 *
 * 🔴 `Halo`'nun `opacity` değeri öğenin satır içi stilindedir, ama aynı öğe
 * `halo-breathe` animasyonuyla opaklığı 0.4–0.75 arasında canlandırır; CSS
 * animasyonu satır içi stili ezer. Sonuç: hangi opaklık verilirse verilsin
 * hale merkezde ~%64 yoğunlukta parlar ve koyu temada açık renk metnin
 * arkasını aydınlatıp kontrastı düşürür. Opaklık burada dıştaki kapta
 * uygulanır; nefes yine çalışır, tepe değeri `opacity` olur.
 */
export function Hale({ opacity = 0.2, ...props }: HaloProps) {
  return (
    <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ opacity: opacity / 0.75 }}>
      <Halo {...props} opacity={0.75} />
    </div>
  );
}
