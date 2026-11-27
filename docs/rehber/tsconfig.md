# `tsconfig.json` — TypeScript ayarları

> Faz 21.8 (`FE-03`) ile `"strict": true`. `npm run lint` (`tsc --noEmit`) bu dosyayı okur; `npm run check`'in ilk adımı.

## `strict: true` ne açar?

| Bayrak | Yakaladığı |
|---|---|
| `strictNullChecks` | `null`/`undefined` olabilecek değerin denetimsiz kullanımı (`canvas.getContext('2d')` null dönebilir) |
| `strictFunctionTypes` | Fonksiyon parametrelerinin yanlış yönde atanması |
| `noImplicitAny` | Türü çıkarılamayan, sessizce `any` olan değişkenler |
| `strictBindCallApply`, `strictPropertyInitialization`, `alwaysStrict`, `useUnknownInCatchVariables` | `bind/call/apply` türleri, sınıf alanı ilk değeri, `"use strict"`, `catch (e)`'nin `unknown` olması |

## 21.8'de kapanan 20 hata (davranış değişmedi)

| Dosya | Hata sayısı (`npx tsc --noEmit --strict`, 27 Kasım) | Düzeltme |
|---|---|---|
| `templates/shared/effects/particleEngine.ts` | 15 | `getContext` sonucu bir kez daraltılıp `const g: CanvasRenderingContext2D` olarak aşağı geçti. İçerideki `draw()`/`renderOnce()` **fonksiyon bildirimi**: hoisting yüzünden TS yukarıdaki `if (!g) return` daraltmasını onlara taşımaz |
| `preview/PreviewSection.tsx` | 2 | React 19'da `useRef<HTMLDivElement>(null)` → `RefObject<HTMLDivElement \| null>`. Düzeltme çağrılan tarafta: `DeviceSimulator` ve `TemplateGrid`'in `simulatorRef` prop'u `RefObject<HTMLDivElement \| null>` |
| `create/EditorWorkspace.tsx` | 1 | aynı (`DeviceSimulator`) |
| `templates/lazyPresets.ts`, `templates/TemplateRenderer.tsx` | 1 + 1 | `lazy(() => …m[name]…)` türü `Record<K, X>[K]` olarak kalıyordu; `lazy<Preset>(…)` ile açık tür |

`as` ve `!` kullanılmadı.

## `noUncheckedIndexedAccess` neden açılmadı?

Deneme (27 Kasım): açınca **124 dosyada 719 hata** (`arr[i]` ve `record[key]` her yerde `T | undefined` olur). Ayrı bir iş
ve karar: dosya dosya, şablonlar en sona. Bayrak geri kapatıldı.

## Diğer ayarlar (değişmedi)

`moduleResolution: bundler` + `allowImportingTsExtensions` + `noEmit`: derlemeyi Vite (esbuild) yapar, `tsc` yalnızca tür
denetler. `resolveJsonModule`: `contracts/error-codes.json` gibi dosyalar tipli içe aktarılır. `paths: @/*`: kök takma adı.
