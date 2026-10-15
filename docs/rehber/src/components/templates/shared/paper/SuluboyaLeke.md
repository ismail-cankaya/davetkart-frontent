# `shared/paper/SuluboyaLeke.tsx` — taşan renk lekesi

> **Tarih:** 2026-10-15 · dal `design/kagit`

---

## 1. Fikir

Biçim tek bir önceden üretilmiş alfa maskesidir (`leke.webp`): deforme çokgen katmanları (Hobbs
yöntemi), kenarda toplanan pigment, tanecik. Renk CSS'ten gelir; döndürme, aynalama (`ayna`) ve
basıklıkla (`oran`) aynı maskeden farklı lekeler çıkar. İki leke üst üste gelince `multiply` üçüncü
bir ton üretir.

İlk sürümün kenarı "yosun" gibi tüylüydü; deformasyon derinliği ve sapması düşürüldü.

## 2. Kurallar

- En çok üç leke; kâğıdın kenarından taşar, metnin altına gelmez.
- Üstüne yazı gelecekse başlık mürekkebiyle ve ölçülerek (en kötü 4.75, konsept §2.5).
- Kalıp çiçek kümesi yerine geçmez; leke bir arka plan izidir.

## 3. Performans

`mix-blend-mode` bir birleştirme katmanı açar; statik olduğu sürece ucuzdur. Lekeler canlandırılmaz.
