# `shared/heroes/NoirHero.tsx` — uzun tek kelime taşmaz

> **Kullananlar:** 9 kategorinin `*Noir` şablonu
> **Tarih:** 2026-10-11 · dal `design/ortak`

---

Dev başlıktaki her kelime ayrı bir `inline-block` `motion.span`'dir. 13+ harfli tek bir
kelime (uzun kurum adı) 360 px'te kabın dışına taşabiliyordu.

`break-words` (`overflow-wrap: break-word`) burada **işe yaramaz**: inline-block'un
genişliği "içeriğe göre küçült" kuralıyla hesaplanır ve `break-word` en küçük içerik
genişliğini etkilemez — kutu kelime kadar geniş kalır.
`[overflow-wrap:anywhere]` ise en küçük genişliği de değiştirir; kutu satıra sığar,
kelime gerekirse bölünür. Normal isimlerde hiçbir şey değişmez.

## Kullanıcı metninin harfi (2026-10-22 · dal `design/konsept-ortak`, N3)

Başlık üst etiketinden `uppercase` kaldırıldı; büyük harfli bilgi şeridinde mekân öğesi `normal-case`.
Tablo: `../Summary.md` §3.
