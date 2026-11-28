/** Yerinde düzenleyicinin masaüstü konumu: metnin altına, sığmazsa üstüne; mobilde alttan panel (konum yok). */
export function popoverPosition(
  anchor: { top: number; bottom: number; left: number },
  isMobile: boolean,
  width = 340,
  height = 320
): { left: number; top: number; width: number } | undefined {
  if (isMobile) return undefined;
  const gap = 10;
  const w = Math.min(width, window.innerWidth - 24);
  const left = Math.max(12, Math.min(anchor.left, window.innerWidth - w - 12));
  const below = anchor.bottom + gap;
  return below + height < window.innerHeight ? { left, top: below, width: w } : { left, top: Math.max(12, anchor.top - gap - height), width: w };
}
