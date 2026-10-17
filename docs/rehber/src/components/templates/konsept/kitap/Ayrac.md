# `konsept/kitap/Ayrac.tsx` — ayraç kurdelesi

> **Tarih:** 2026-10-17 · dal `design/kitap`

---

14 px genişliğinde, kurdele renginde (`#8C2F2F`) şerit; ucu kırlangıç kuyruğu (`clip-path`, 9 px
çentik). Kenarlarda 1 px koyu kılçizgi saten kıvrımını düz renkle söyler — parlama yok.

- Boy: kabın %30'u, 140–260 px arası.
- Hareket: `ayracSarkar` — y −100% → 0, 0.4 s, 0.3 s gecikme. Azaltılmış harekette yerinde durur.
- Süstür (`aria-hidden`); konum `className` ile verilir. Kap `overflow: hidden` olmalı.
