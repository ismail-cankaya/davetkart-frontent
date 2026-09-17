import React, { useState } from 'react';
import { cn } from '../../utils/cn';

type NativeInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'placeholder'>;

interface DateTimeInputProps extends NativeInputProps {
  /** Duvar saati (`YYYY-MM-DDTHH:mm`); boş = tarih seçilmedi. */
  value: string;
  /** Alan boşken gösterilen silik yönlendirme metni. */
  placeholder?: string;
  /** Placeholder metninin rengi (koyu/açık form temasına göre). */
  placeholderClassName?: string;
}

/**
 * Placeholder gösterebilen `datetime-local` alanı.
 *
 * 🔴 Tarayıcılar tarih alanlarında `placeholder` özniteliğini YOK SAYAR ve
 * boş alanı "gg.aa.yyyy --:--" maskesiyle çizer; yönlendirici metin için tek
 * yol onu alanın üzerine katmanlamaktır. Maske yalnızca katman görünürken
 * saydamlaştırılır, takvim ikonu ise her zaman görünür kalır.
 *
 * Katman şu durumlarda çekilir:
 * - alanda değer varken,
 * - alan odaktayken (kullanıcı maskeyi görerek yazabilsin),
 * - alan YARIM doluyken (`validity.badInput`): gün girilip saat girilmediyse
 *   tarayıcı değeri boş bildirir; katman geri gelseydi yazılanı gizlerdi.
 */
export function DateTimeInput({
  value,
  placeholder,
  placeholderClassName = 'text-white/30',
  className,
  onFocus,
  onBlur,
  onInput,
  ...rest
}: DateTimeInputProps) {
  const [focused, setFocused] = useState(false);
  const [partial, setPartial] = useState(false);

  const showPlaceholder = Boolean(placeholder) && !value && !focused && !partial;

  return (
    <div className="relative">
      <input
        {...rest}
        type="datetime-local"
        value={value}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          setPartial(e.currentTarget.validity.badInput);
          onBlur?.(e);
        }}
        onInput={(e) => {
          setPartial(e.currentTarget.validity.badInput);
          onInput?.(e);
        }}
        className={cn('min-h-[46px]', className, showPlaceholder && 'text-transparent')}
      />
      {showPlaceholder && (
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-y-0 left-4 right-12 flex items-center text-sm truncate',
            placeholderClassName
          )}
        >
          {placeholder}
        </span>
      )}
    </div>
  );
}
