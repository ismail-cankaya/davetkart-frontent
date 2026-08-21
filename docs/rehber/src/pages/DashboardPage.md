# `src/pages/DashboardPage.tsx` — Faz 3 değişikliği

> **Kod dosyası:** `davetkart-frontent/src/pages/DashboardPage.tsx`
> **Faz:** 3 — frontend uyarlaması, dosya F6/8

---

## 1. 🔴 En kritik satır: kart artık kaydın tamamını taşıyor

**Önce:**

```ts
interface DashboardCard {
  key: string;
  kind: TabId;
  remoteId: string;
  invitation: Invitation;      // ← YALNIZCA tasarim
}
```

**Sonra:**

```ts
  invitation: Invitation;
  record: InvitationRecord;    // ← kimlik + durum + tasarim
```

Ve "düzenlemeye devam et" akışı:

```ts
// Once
loadInvitation(card.invitation);   // ❌ kimlik DUSUYOR

// Sonra
loadRecord(card.record);           // ✅ kimlik tasiniyor
```

### Bu düzeltilmeseydi ne olurdu?

```
1. Kullanici dashboard'dan A davetiyesini duzenlemeye baslar
2. Editor recordId'yi bilmez (null)
3. Ilk autosave POST atar
4. Sonuc: A durmaya devam eder, YANINA A'nin kopyasi olan B olusur
5. Kullanici her duzenlemeye donusunde bir kopya daha uretir
```

Tek davetiye varsayımında bu hata **mümkün değildi** (upsert her zaman aynı kaydı
buluyordu). K37 ile birlikte doğdu — sözleşme değişiklikleri böyle uzak
köşelerde sonuç üretir.

TypeScript bunu yakaladı: `loadRecord` farklı bir tip beklediği için
`loadInvitation(card.invitation)` derlenmedi. F4'te metodun **adını da**
değiştirmemizin sebebi buydu.

---

## 2. Silme düğmesi

```tsx
<button type="button" onClick={() => onDelete(card)} aria-label="Bu davetiyeyi sil">
  <Trash2 size={12} /> Sil
</button>
```

Her iki sekmede de görünüyor (yayında olan da silinebilir), ve görsel olarak
**ikincil**: gri, çerçevesiz, yalnızca üzerine gelince kırmızıya dönüyor.

> Yıkıcı eylemler bulunabilir olmalı ama **davetkâr olmamalıdır**. Birincil
> eylemle (Düzenle) aynı görsel ağırlıkta bir silme düğmesi, yanlış tıklamayı
> davet eder.

### Onay

```ts
const ad = card.invitation.names || 'Bu davetiye';
if (!window.confirm(`${ad} silinecek. Emin misiniz?`)) return;
```

Onay metninde **davetiyenin adı** geçiyor. "Emin misiniz?" tek başına bilgi
taşımaz; kullanıcı hangi kartı sildiğini karıştırabilir.

⚠️ `window.confirm` tarayıcının yerleşik penceresi — projenin premium tasarım
diline uymuyor (`CLAUDE.md` "Modern & Premium Aesthetics"). Şimdilik bilinçli bir
borç: doğru olan davranış, geçici olan görünüm. Tasarım sistemine uygun bir
onay modalı ayrı bir iş.

### Sonuç bildirimi

```ts
try {
  await remove(card.remoteId);
  toast('Davetiye silindi.');
} catch {
  toast('Davetiye silinemedi — bağlantınızı kontrol edin.', 'info');
}
```

F5'teki iyimser güncelleme kartı zaten anında kaldırdı; `catch` durumunda hook
listeyi geri yükledi ve kullanıcı **hem kartın döndüğünü hem sebebini** görüyor.

Sessiz başarısızlık en kötü seçenekti: kart kaybolur, kullanıcı silindi sanır,
sayfa yenilenince geri gelir.

---

## 3. Değişmeyen şey: kart ızgarası

Dashboard'un çoklu davetiye desteği için **hiçbir düzen değişikliği
gerekmedi**. Sekmeler, sayaçlar, boş durum metinleri, animasyonlar — hepsi zaten
dizi üzerinden çalışıyordu:

```tsx
{activeCards.map((card, i) => ( ... ))}
```

Devraldığın kodun bu geçişi öngörmüş olması iyi bir örnek: **veri tek olsa bile
koleksiyon gibi modellemek**, ileride tek satırlık bir değişiklikle çoğullaşmayı
mümkün kılıyor.

---

## 4. Sık yapılan hatalar

| # | Hata | Ne olur |
|---|---|---|
| 1 | Editöre yalnızca `invitation` geçirmek | Her düzenlemede kopya davetiye oluşur |
| 2 | Silmede onay sormamak | Geri alınamaz görünen kayıp |
| 3 | Onay metninde adı geçirmemek | Kullanıcı yanlış kartı siler |
| 4 | Silme düğmesini birincil eylem gibi göstermek | Yanlış tıklama davet edilir |
| 5 | Hatayı sessizce yutmak | Silinmemiş kayıt silinmiş görünür |

---

## 5. Sırada ne var?

**F7 — `components/create/TimelineEditor.tsx`** ve **F8 — `data.ts`.** K44'ün
son iki durağı; ondan sonra `npm run lint` yeşile döner.
