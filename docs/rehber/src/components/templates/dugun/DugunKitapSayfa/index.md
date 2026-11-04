# `dugun/DugunKitapSayfa/` — Kitap Sayfaları

> **ID:** `dugun-kitap-sayfa` · **Faz 15** · Ana rehber: [yedi-davetiye.md](../../yedi-davetiye.md) §B.2 ·
> ekran görüntüleri: [`dugun-kitap-sayfa.jpg`](../../yedi-davetiye/dugun-kitap-sayfa.jpg)

| Dosya | Ne |
|---|---|
| `curl.ts` | 2D kıvrım geometrisi: katlama çizgisi, ön yüz kırpması (Sutherland–Hodgman), arka yüz matrisi, gölge bantları |
| `Kitap.tsx` | Yaprak yığını, sürükleme/tekerlek/klavye/dokunma, çift sayfa, köşe ipucu, RTL aynalama (`MirrorContext`) |
| `sayfalar.tsx` | Kâğıt yüzü, bez kapak, yan kâğıdı, bölüm başlığı, dört düz illüstrasyon |
| `index.tsx` | Sayfa sırası (verisi olmayan bölüm yaprak olmaz), şablon kökü, açılış |

RTL (15.4): bütün mekanik `scaleX(-1)` ile aynalanır; `Face`/`Cloth` yazıyı `MirrorContext` ile geri çevirir. Sürükleme yönü, dokunma şeritleri, ok tuşları ve düğmeler de ters döner.
