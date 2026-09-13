interface HoneypotFieldProps {
  value: string;
  onChange: (value: string) => void;
  /** Aynı sayfada iki form varsa `id` çakışmasın diye. */
  id?: string;
}

/**
 * Bot tuzağı — insana görünmez, otomatik doldurucuya görünür bir alan.
 *
 * Backend her iki formda da `website` adlı alanı okur
 * (`HasHoneypot::HONEYPOT_FIELD`) ve dolu gelirse **204 döner, kaydetmez**.
 * Tuzak sessizdir: bota "yakalandın" denmez (L2).
 *
 * 🔴 `display: none` ya da `hidden` **kullanılmaz.** Amaç botun alanı
 * görmesi ve doldurmasıdır; gizlenmiş alanları atlayan botlar ekran dışına
 * taşınmış olanı doldurur. Bu yüzden alan DOM'da gerçek bir input olarak
 * durur, yalnızca görüntü alanının dışındadır.
 *
 * 🔴 Bu bileşen **tek kopyadır.** Alanın adı bir gün değişirse iki formu
 * birden hatırlamak gerekmesin diye: unutulan form sessizce savunmasız
 * kalırdı ve backend testi bunu göremezdi (B9).
 *
 * Erişilebilirlik: `aria-hidden` ekran okuyucudan gizler, `tabIndex={-1}`
 * klavye sırasından çıkarır, `autoComplete="off"` parola yöneticilerinin
 * alanı dürüst kullanıcı adına doldurmasını azaltır — üçü birden, alanın
 * gerçek bir kullanıcıya asla ulaşmamasını hedefler.
 */
export function HoneypotField({ value, onChange, id = 'website' }: HoneypotFieldProps) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden">
      <label htmlFor={id}>Web sitesi</label>
      <input
        id={id}
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
