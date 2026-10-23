# `konsept/harita/palet.ts` — `HARITA_RENK`

> **Tarih:** 2026-10-17 · dal `design/harita` · Kaynak: [HARITA-KONSEPTI §2](../../../../../tasarim/HARITA-KONSEPTI.md)

---

Rehberin §2.1 tablosu, adlarıyla. Hex değerleri ve hesaplanmış kontrastlar rehberdedir; bu dosya
yalnızca SVG çizimlerinin ve satır içi stillerin aynı değerleri kullanmasını sağlar. Tailwind
sınıflarında (tema, kutular) aynı hex'ler sınıf adına yazılıdır, çünkü Tailwind sınıfları derleme anında
kaynaktan okur.

| Ad | Not |
|---|---|
| `rotaAcik` | Yalnızca rota noktası ve iğne başı. Yazıda kullanılmaz (arazide 4.31). |
| `rotaKoyu` | Rehberde yok; yalnızca "Yol tarifi" düğmesinin üzerine gelme hâli. Beyaz yazı 8.35 (ölçüldü, [tema](tema.md)). Rota ailesinin koyu tonu, yeni bir renk değil. |

`blok` paletin içinde ama düğün preset'lerinde kullanılmadı: iki arazi de dört tonla yetiniyor
(şehir: arazi + yol + su + rota; kır: arazi + park + su + rota). `murekkep` ve `gri` çizgi ve yazı
rengidir; şeffaf çizgiler (sokak kenarı, eş yükselti) ton sayılmadı.

## Doğum günü eki (2026-10-23)

`araziSicak: '#F1E6C8'` — hazine ekseninin sıcak arazisi (§2.2). Hesaplanan: mürekkep 10.85, gri 5.63, rota
5.37. Bir preset yine en çok dört ton kullanır (Hazine Avı: sıcak arazi, su, park + rota).
