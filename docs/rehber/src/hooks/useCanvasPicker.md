# `src/hooks/useCanvasPicker.ts`

Faz 27.2 (K321). Tasarım stüdyosunda önizlemede **her metne** tıklayarak düzenleme.

## Neden şablonlara dokunmadan

Faz 25'in tıkla-düzenlesi yalnızca `<InvText>` ile çizilen şablon metinlerinde çalışıyordu. İki grup tıklanmıyordu:

| Grup | Ölçek |
|---|---|
| Kullanıcının kendi içeriği (isimler, başlık, alt başlık, mekân, tarih) | `invitation.names`/`title`/`venue`… 127 dosyada 540 kullanım |
| Dize olarak çizilen şablon metinleri (`t('label.date')` bir prop'a gider) | Faz 26.3'te taşınan yüzlercesi |

Plan (K321) her çizim yerini `InvField` ile sarmayı öneriyordu. 540 yer ve dize konumundaki kullanımlar (`.split()`,
prop) yüzünden bunun yerine **DOM eşlemesi** seçildi: misafir sayfasına hiçbir şey eklenmez, 762 çizimlik anlık
görüntü değişmez, yeni şablon kendiliğinden kapsanır.

## Nasıl çalışır

1. Dizin (`textPicking.buildPickIndex`): metin → karşılık. Önce kullanıcı alanları, sonra bu tasarımda çizilen
   (`seenKeys`) şablon metinleri, kullanıcının değişikliği uygulanmış hâlleriyle.
   - İsimler: tam metin, `&` ile ayrılan kişiler, kişilerin sözcükleri; isim boşsa yer tutucu ("Davetlisiniz").
   - Tarih: tam, saatsiz, takvim günü, yalnızca saat.
   - Yer tutuculu şablon metinleri (`{date}`) dizine girmez (`<InvText>` onları zaten tıklanır çizer).
2. Karşılaştırma: boşluk tek, kenardaki tırnak/noktalama yok, Türkçe küçük harf (CSS `uppercase` ve JS
   `toUpperCase()` yok sayılır).
3. Tuval (`DeviceCanvas`) iframe belgesinde `pointerover` ile vurgular (kesikli çerçeve), `click`'i **yakalama**
   evresinde dinler: tıklanan öğeden en çok 4 ata yukarı eşleşme arar (harf harf bölünmüş başlıklar atada eşleşir).
   Eşleşirse şablonun kendi tıklaması çalışmaz ve düzenleyici açılır; eşleşmezse hiçbir şey yapılmaz.
4. Form alanları ve `data-text-slot` işaretleri atlanır (işaret kendi tıklamasını yönetir).
5. Kullanıcı alanı → `FieldEditorCard` (paket yok); şablon metni → `InlineTextEditor` (Elit notu).

## Ölçüm (Faz 27.2–28.0)

Her üç şablondan biri (307'den 103 tasarım), telefon tuvali, isimler "Ayşe Yılmaz & Ali Demir", başlık ve mekân dolu:
çizilen her isim/başlık/mekân öğesine tıklandı ve doğru düzenleyicinin açıldığı kontrol edildi.

| Alan | Sonuç |
|---|---|
| İsimler | 103/103 |
| Mekân | 103/103 |
| Başlık | 91/91 (12 tasarım başlığı çizmiyor); ilk ölçümde `BrutalHero` ailesinde 3 kaçak vardı: başlık aynı öğede bir ayraçla yan yana. Eşleme artık öğenin kendi metin düğümlerine de bakıyor |

## Sınırlar

- Aynı metin iki yerde geçerse ilk karşılık kazanır (kullanıcı alanı önce). Örn. başlık "Saat" yazılırsa saat etiketine
  tıklamak başlığı açar.
- Klavye ile seçme yok; klavye yolu sol menüdeki Bilgiler ve Metinler panelleri (K306).
- Tarih biçimleri şablona göre değişir; tanınmayan biçimde tarih tıklanmaz (Bilgiler panelinden düzenlenir).
