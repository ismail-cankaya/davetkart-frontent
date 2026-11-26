# `src/components/create/location/LocationSearchField.tsx` — "Ulaşım Bilgileri" alanı

> **Faz 21.7 (`FE-08`, K271):** konum **önerisi araması kaldırıldı**. `services/places.ts`, `hooks/usePlaceSearch.ts`,
> `PlaceSuggestion` tipi ve `VITE_PLACES_SEARCH_ENABLED` bayrağı silindi. Alan "haritadan seç" ve "harita bağlantısı
> yapıştır" ile çalışır. Dosya adı tarihî nedenle "Search" taşıyor (aşağıda).

## 1. Akış

1. Kullanıcı alana tıklar ya da yazar; altta bir liste açılır.
2. Listenin sonunda her zaman **"Harita üzerinden konum seç"** bulunur; açılan pencerede (`MapPickerModal`) harita ve en
   altta koordinat girişi vardır. Alanda koordinat yazılıysa pencere oradan açılır.
3. Yazılan metin bir `http(s)` adresiyse listede **"Bu harita bağlantısını kullan"** da çıkar (önceki sürümlerde bu alana
   Google Haritalar bağlantısı yapıştırılıyordu; o yol korunur).
4. Bir koordinat ya da bağlantı seçilince misafirin "Yol Tarifi Al" düğmesini besleyen bağlantı `mapUrl`'e yazılır.

🔴 Yazılan metin **tek başına kaydedilmez**: bir yer adı konum değildir. State'e yalnızca seçilmiş bir konum yazılır;
alan boşken placeholder yalnızca silik bir rehberdir. Metni tamamen silmek seçili konumu kaldırır. "Davet Konumu"
(`venue`, düz metin) ayrı bir alandır ve aynen kalır; e2e `createInvitation` onu doldurur.

## 2. Neden öneri araması kaldırıldı? (`FE-08`)

Öneriler `GET /api/public/places/search`'ten gelecekti, ama bu uç backend'de **hiç yazılmadı**. Frontend kodu
`VITE_PLACES_SEARCH_ENABLED=false` bayrağıyla kapalı duruyordu: derleniyor, bakımı yapılıyor, kimse çalıştırmıyordu.
Bayrak açılsaydı alan her duraklamada 404 alırdı. Karar (K271, varsayılan): kaldır, "haritadan seç" tek yol. Uç bir gün
yazılırsa (Places anahtarı sunucuda, önbellek, `throttle`, KVKK metni) ayrı bir fazda, sözleşmesiyle birlikte gelir;
silinen kod git geçmişinde durur (`faz-21-backlog`, 21.7 commit'i).

Bayrak kapalıyken kanca hep boş durum döndürüyordu (öneri yok, "bulunamadı" satırı yok); yani kaldırma bugünkü
ekranı **değiştirmedi**.

## 3. Dosya adı neden değişmedi?

Yeni bir adla (ör. `MapLocationField.tsx`) taşımak, dosyadaki gömülü Türkçe metinleri `verify:i18n` için "yeni dosyada
yeni metin" yapardı; kural yeni metni yalnızca `t()` ile kabul ediyor. Metinleri `t()`'ye taşımak ayrı bir iş.

## 4. Klavye ve erişilebilirlik

`role="combobox"` + `listbox`; ↑/↓ seçeneği değiştirir, Enter seçer (🔴 alan sihirbaz formunun içinde: Enter varsayılan
olarak formu gönderirdi, burada bir seçimdir), Esc listeyi kapatır. Sağdaki temizle ve harita düğmeleri `mousedown`'ı
engeller; yoksa tıklama önce `blur`'u tetikler ve liste kapanırdı.
