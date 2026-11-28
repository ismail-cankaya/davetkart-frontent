# `src/pages/StudioPage.tsx`

Faz 28 (K318–K325). Tasarım Stüdyosu: davetiyenin ayrı, tam ekran editörü. Eski sihirbaz adımı `EditorWorkspace` ve
`DesignerPanel` kalktı (K322: tek editör).

## Rotalar

| Adres | Ne |
|---|---|
| `/studio` | Oturumsuz tasarımcının yerel taslağı. Kayıt açılınca adres `/studio/:id` olur (K192 deseni) |
| `/studio/:id` | Kayıtlı davetiye (`ProtectedRoute`); başka bir belge açıksa sunucudan yüklenir, başkasınınki 404 → panel |
| `/create` | Sihirbaz; "Davetiyeni Oluştur" → üretim ekranı → `/studio` (sihirbaz formu korur, `backToBuild`) |
| `/create/:id` | Eski bağlantılar: `/studio/:id`'ye yönlendirir |

Site çerçevesinin (`AppLayout`) dışında olduğu için `Toaster`, `ConfirmHost` ve `PaywallModal` sayfanın kendisinde.

## Yerleşim (K319)

```
┌ üst çubuk: geri · ad · kayıt durumu · Hazır n/m · taşma · ↶ ↷ · Misafir gözüyle · Vazgeç · Yayınla ┐
│ ikon rayı + sekme paneli │            tuval (DeviceCanvas)            │ bölüm ayarı (≥1440) │
│ Bilgiler Bölümler Metinler│   telefon / tablet / bilgisayar · % · tam ekran                  │
│ Tema Kontrol              │                                             │                     │
└───────────────────────────┴─────────────────────────────────────────────┴─────────────────────┘
```

- **< 1024 px:** sol menü yerine altta sekme çubuğu; sekme alttan panelde açılır. **< 640 px** telefon önizlemesi
  çerçevesiz ve ekran genişliğinde (`DeviceCanvas bare`).
- **Bölüm ayarı:** ≥ 1440 px tuvalin sağında sütun (`SectionSettingsDrawer docked`), daha darda sağdan katman.
- **Tam ekranda düzenle:** üst çubuk, menüler gizlenir; tarayıcının tam ekranı da istenir; Esc çıkar.
- **Misafir gözüyle:** `GuestViewOverlay`, canlı kip, editör köprüsü ve seçici yok; "Baştan oynat" tuvali yeniden kurar.

## Yayınlama

- Taslak davetiye: "Yayınla" → `usePublishFlow` → bugünkü yayın akışı (402 → plan duvarı) → panel.
- Yayındaki davetiye: kaydetme taslağa gider (K323); "Değişiklikleri yayınla" taslağı uygular (402'de plan duvarı,
  taslak kalır), "Vazgeç" onay sorar ve canlı hâle döner. Taslak yokken düğme pasif.
- Oturumsuz: "Yayınla" girişe gönderir; döndüğünde tasarım aynı.

## Test

`e2e/text-editor.spec.ts` (proje `editor`, backend gerekmez): metin düzenle/geri al/yinele/onaylı sıfırla, sınır,
kullanıcı alanı (mekân), ➕ hediye ve yandaki ayar paneli, cihaz genişliği 390/820/1280, kontrol listesi + misafir gözüyle +
tam ekran.
