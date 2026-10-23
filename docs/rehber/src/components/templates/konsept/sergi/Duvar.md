# `konsept/sergi/Duvar.tsx` — sabit duvar

> **Tarih:** 2026-10-17 · dal `design/sergi`

---

`renderBackdrop`'a verilen sahne: kaydırma kabının arkasında sabit duran düz `--sg-duvar` yüzeyi.
Bölümler aynı duvarda asılı gibi akar (SERGI-KONSEPTI §4.2).

## Neden ayrı bir katman (tema `base` zaten duvar rengi)?

`renderBackdrop` verildiğinde kompozisyon kategori desenini (`flavor.BackgroundPattern`, düğünde
puantiyeli tül) hiç çizmez. Flavor kopyası deseni ayrıca kapatır (`useSergiFlavor`); ikisi birlikte
kategori flavor'ı değişse bile duvarın düz kalmasını garanti eder.

## Sınırlar

- Kaydırma durumunu (`heroExit`, `progress`) kullanmaz; duvar hareket etmez. Kompozisyon yine de
  bir kaydırma dinleyicisi kurar (maliyeti ihmal edilebilir).
