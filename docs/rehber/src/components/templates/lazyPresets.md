# `templates/lazyPresets.ts` — tembel şablon kaydı

> **Faz 15** · Ana rehber: [yedi-davetiye.md](yedi-davetiye.md) §A.2

| Dışa aktarım | Ne |
|---|---|
| `LAZY_KONSEPT_PRESETS` | Kitap · Harita · Sergi'nin 18 preset'i; her konsept barrel'ı ayrı chunk |
| `LAZY_YEDI_PRESETS` | 7 yeni düğün şablonu |
| `LAZY_PRESETS` | İkisinin birleşimi — `TemplateRenderer`'ın `THEME_PRESETS`'i ve `verify:render` bunu okur |

`fromBarrel(load, ad)` adlandırılmış dışa aktarımı `React.lazy`'nin istediği `default`'a çevirir. Tip
`Record<K, ComponentType<TemplateProps>>`: barrel'da olmayan ad derleme hatasıdır.

🔴 Bu modüller kategori barrel'ına (`dugun/index.ts`) **bağlanmaz**. `TemplateRenderer` kategori barrel'ını
statik içe aktarır; bağlansaydı modül ana pakete girer, tembel yükleme boşa giderdi.

**Yeni tembel şablon:** buraya bir satır + `src/data.ts`'e katalog girdisi. `verify:render` ikisinin
birbirini tuttuğunu ve şablonun boş veride kırılmadığını denetler.
