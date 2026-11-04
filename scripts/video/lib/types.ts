/**
 * Video sahnesi sözleşmesi. Bir sahne gerçek zamana değil yalnızca `t`
 * (saniye) parametresine bağlı çizer: aynı `t` her çalıştırmada aynı kareyi
 * verir, kareler herhangi bir sırayla ve paralel işçilerde üretilebilir.
 */
export type VariantId = 'desktop' | 'mobile';

export interface SceneContext {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  variant: VariantId;
}

export interface SceneRenderer {
  /** `t` anının karesini tuvale çizer (eşzamanlı). */
  render(t: number): void;
}

export interface SceneDef {
  /** Klip süresi (sn). Döngüde son kare + 1 = ilk kare. */
  duration: number;
  fps: number;
  /** `true`: kusursuz döngü (sahne `t` için periyodik olmalı). */
  loop: boolean;
  /** Kaydırmaya bağlı oynatma: kısa GOP ile kodlanır, döngü şartı yok. */
  scrub?: boolean;
  /** Poster karesinin anı (sn) — videonun en güzel karesi. */
  poster: number;
  /** Varyanta özel poster anı (verilmezse `poster`). */
  posterMobile?: number;
  /** x264 CRF başlangıcı; bütçe aşılırsa koşturucu yükseltir. */
  crf?: number;
  setup(ctx: SceneContext): SceneRenderer | Promise<SceneRenderer>;
}
