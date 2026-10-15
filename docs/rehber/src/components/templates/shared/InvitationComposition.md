# `shared/InvitationComposition.tsx` — `renderEnvelope` kancası ve tema alt bilgisi

> **Kullananlar:** bütün şablonlar (kompozisyon kökü); `renderEnvelope` → kâğıt ailesi (`KagitZarf`)
> **Tarih:** 2026-10-15 · dal `design/kagit` · Onay: Aşama 2 raporu, öneri §8

---

## 1. `renderEnvelope`

Zarf kapısı her şablonda ortak `Envelope` ile çiziliyordu; şablonun elinde yalnızca
`theme.envelope` renk sınıfları vardı (mühürde baş harf yerine kategori süsü, kapak tek renk,
açılış süresi sabit). Kâğıt ailesinin zarfı (`KagitZarf`: dokulu kâğıt, astar, kırılan mum mühür,
yükselen kart) bu sınıflarla kurulamıyordu.

```ts
renderEnvelope?: (props: EnvelopeRenderProps) => React.ReactNode;

interface EnvelopeRenderProps {
  invitation: Invitation;
  theme: SectionTheme;
  flavor: TemplateFlavor;
  onRevealStart: () => void;  // hero girişini başlatır (intro kapısı)
  onOpened: () => void;       // kapı kalkar, kaydırma açılır
}
```

- Sözleşme ortak `Envelope`'un props'unun aynısı; kompozisyon iki anı bilmeye devam eder
  (intro kapısı ve kaydırma kilidi değişmedi).
- **Yalnızca `invitation.showEnvelope` açıkken** çağrılır. Zarf bir modüldür (Gold); şablon onu
  bayraktan bağımsız gösteremez.
- Verilmezse `<Envelope {...props} />` çizilir: mevcut şablonların hiçbiri etkilenmez.

## 2. Alt bilgi

Adlar ve imza `theme.footer` verilirse onun sınıflarını, verilmezse bugünkü
`opacity-60` / `opacity-40` + `body` sınıflarını alır. Gerekçe ve ölçüm: [palette](palette.md) §3.

## 3. Doğrulama

`npm run check` yeşil; `verify:render` 296 şablonun hepsinde imzanın varlığını/yokluğunu sınıyor
(alanı vermeyen şablonların sınıf dizgesi değişmedi).
