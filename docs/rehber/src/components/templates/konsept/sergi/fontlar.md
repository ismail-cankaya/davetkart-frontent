# `konsept/sergi/fontlar.ts` — Instrument Serif + Instrument Sans

> **Tarih:** 2026-10-17 · dal `design/sergi` · Denetim: [SERGI-KONSEPTI §3](../../../../../tasarim/SERGI-KONSEPTI.md)

---

## 1. Seçim

Türkçe glif denetimi konsept rehberinde yapıldı (9 adayın hepsi tam). Seçilenler: **Instrument Serif**
(duvar yazısı, adlar, `font-serif` bölüm başlıkları; dik ve italik) ve **Instrument Sans** (etiket, gövde,
düğme, form). Başka aile yok.

| Dışa aktarım | Ne |
|---|---|
| `BASLIK_YIGINI`, `GOVDE_YIGINI` | Font yığınları; yedekler Cormorant/Georgia ve Inter (zaten yüklü) |
| `useSergiFontlari()` | Tek `<link>`: `Instrument+Serif:ital@0;1` + `Instrument+Sans:wght@400..700`, `display=swap` |
| `useDuvarYazisiHazir(sinirMs = 400)` | Instrument Serif italik yüklendi mi? Sınırda yine `true` |

## 2. Yükleme

- Genel `index.css` `@import`'una eklenmedi: oradaki her aile ana sayfa ve panel dahil her sayfaya iner.
- Etki içinde çalışır; sunucu çiziminde hiçbir şey yapmaz. Aynı `<link>` ikinci kez eklenmez (`id`).
- Instrument Sans değişken fonttur: `400..700` aralığı dosya boyunu değiştirmez, ortak bölümlerin
  `font-bold` sınıfları gerçek 700'le çizilir (sahte kalın yok).

## 3. Neden "hazır mı?" kancası?

Instrument Serif yedeklerinden dardır; font gelince büyük adların satır kırılımı değişir. Kapak adları
bu kancayı bekleyerek belirir. Sınır 400 ms: ölçülen en geç kapak öğesi 895 ms'de oturuyor (≤ 1.0 s kuralı).

## 4. Boyut (2026-10-17, Google Fonts, Chrome UA)

Türkçe `latin` + `latin-ext` alt kümeleri gerekir (`ğ ş ı İ` latin-ext'te). Üç yüz × iki alt küme
≈ 108 KB woff2 (Sans 11.1 + 30.1, Serif dik/italik 11.6–12.4 + 21.0–22.1). Görsel bütçesine (≤ 60 KB)
sayılmaz; Kâğıt kitiyle aynı yöntem.

## 5. Sınırlar

- Google Fonts'a bağlı (projenin mevcut yöntemi). Çevrimdışı önizlemede yedek font görünür.
