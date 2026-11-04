import { useEffect, useState, useSyncExternalStore } from 'react';

/**
 * Sayfa başına tek WebGL bağlamı. Bir şablon galerisinde ya da editörde aynı
 * anda birden fazla 3D şablon çizilse bile yalnızca ilki Canvas açar; ötekiler
 * statik görünümde kalır ve yer boşalınca sırayla alır.
 */
let owner: symbol | null = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const getOwner = () => owner;
const getServerOwner = () => null;

/** `wanted` iken yuvayı ister; alırsa `true` döner. Unmount'ta bırakır. */
export function useCanvasSlot(wanted: boolean): boolean {
  const [token] = useState(() => Symbol('canvas-slot'));
  const current = useSyncExternalStore(subscribe, getOwner, getServerOwner);

  useEffect(() => {
    if (!wanted) return;
    if (owner === null) {
      owner = token;
      emit();
    }
    return () => {
      if (owner === token) {
        owner = null;
        emit();
      }
    };
    // `current` değişince (yuva boşalınca) yeniden denenir.
  }, [wanted, token, current]);

  return wanted && current === token;
}
