# `shared/three/` — ortak 3D altyapısı

> **Faz 15** · Ana rehber: [yedi-davetiye.md](../../yedi-davetiye.md) §B.1

Barrel (`index.ts`) three.js **içermez**; ana paketten ya da şablon chunk'ından güvenle alınır.
`SceneCanvas` yalnızca tembel sahne modüllerinden doğrudan yoldan alınır.

| Dosya | Görev |
|---|---|
| `ThreeStage.tsx` | Kapı: istemci + WebGL + çok zayıf olmayan cihaz + boş Canvas yuvası → sahne. Statik yedek hep altta; `onReady` ile söner, `onFail`/hata sınırı ile geri gelir. `children(state)` render-prop: `active`, `still`, `quality`, `tilt`, `onFail`, `onReady`. |
| `SceneCanvas.tsx` | R3F `Canvas`: DPR `[1, 1.75]` / `[1, 1.25]`, `frameloop` `never` (görünmez) · `demand` (hareketi azalt) · `always`, bağlam kaybı → `onFail`. |
| `canvasSlot.ts` | Sayfa başına tek WebGL bağlamı (`useSyncExternalStore`). Ham WebGL kullanan sahneler (Mürekkep) de `ThreeStage` üzerinden aynı yuvayı paylaşır. |
| `support.ts` | `hasWebGL` (bir kez denenir), `isVeryLowEnd` (`saveData`, ≤1 GB, ≤2 çekirdek), `preferredQuality`, `dprFor`. |
| `useStageActive.ts` | IntersectionObserver + `visibilitychange`. Holografik ve Altın Toz da kendi döngülerini bununla durdurur. |
| `useTilt.ts` | İşaretçi + `deviceorientation` → ref (React yeniden çizimi yok). |
| `GyroButton.tsx` | iOS Safari'de jiroskop izni (bir dokunuşla). Yalnızca dokunmatik cihazda ve izin isteyen tarayıcıda, karar verilene dek görünür. |

🔴 **StrictMode:** geliştirmede efektler iki kez kurulur. Ham WebGL sahnesi temizlikte `loseContext`
çağırırsa ikinci kurulum ölü bağlamı alır ve sahne hep yedekte kalır (Mürekkep'te yaşandı).
