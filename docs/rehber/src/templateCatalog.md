# `src/templateCatalog.ts`

> **Faz:** 19.24 — `FE-10` · **Karar:** K227

`data.ts`'ten ayrılan şablon kataloğu: kapak içe aktarımları, `TEMPLATE_PRESETS`, `getTemplatesForCategory`,
`getPresetForCategory`. `data.ts`'te küçük varsayılanlar kaldı (`EVENT_CATEGORIES`, `INITIAL_INVITATION`,
`SUBSCRIPTION_PLANS` …); mağazalar ve başlık yalnızca onları alır.

**Neden ayrı dosya:** aynı modüldeki katalog, Rollup'ta modül ana pakete girince onunla gelir. Ölçüm
(kaynak haritası): katalog 103.6 kB, `data.ts`'in geri kalanı 5.9 kB. Kapak görselleri JS'de yalnızca
URL dizesi (bulgudaki "kapak içe aktarımları ağır" varsayımı ölçümde tutmadı; ağır olan metin).

🔴 Ana paketten (başlık, mağazalar, `useInvitationStore` → `useSubscriptionStore`) bu dosyayı içe aktarma:
`verify:bundle` ilk yükleme bütçesini aşar. Premium şablon planı için `PLAN_RULES.presetTiers` var.
