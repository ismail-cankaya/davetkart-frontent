# `shared/paper/KagitKok.tsx` — setin kökü

> **Tarih:** 2026-10-15 · dal `design/kagit`

---

`KagitKok` kâğıt preset'inin en dış bileşenidir: `kagitDegiskenleri(set)`'i `style`'a yazar ve
`useKagitFontlari(set.el)`'i çağırır.

## Neden `display: contents`?

Kompozisyon kökü (`InvitationComposition`) `h-full` ile önizleme çerçevesini doldurur. Araya kutulu
bir sarmalayıcı girseydi yükseklik zinciri kopardı. `contents` kutusuz bir düğümdür: düzene karışmaz,
ama CSS değişkenleri DOM ağacında miras kalır — kompozisyon, zarf ve bütün bölümler aynı paleti görür.

## Neden tema sınıfı değil?

Doku adresi derleme anında karma (hash) alır; sabit bir Tailwind sınıfına yazılamaz. Değişkenler
çalışma anında, tek noktadan verilir.

## Sınırlar

- `useMemo` set nesnesinin kimliğine bağlıdır: set modül düzeyinde sabit tanımlanmalı (her
  çizimde yeni nesne kurulursa değişkenler her çizimde yeniden yazılır).
