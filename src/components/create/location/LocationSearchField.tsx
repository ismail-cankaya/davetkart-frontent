import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ExternalLink, Link2, Loader2, MapPin, MapPinned, X } from 'lucide-react';
import { PlaceSuggestion } from '../../../types';
import { usePlaceSearch } from '../../../hooks/usePlaceSearch';
import { cn } from '../../../utils/cn';
import {
  buildDirectionsUrl,
  buildMapSearchUrl,
  formatCoordinates,
  isHttpUrl,
  parseCoordinates,
  readMapLocation
} from '../../../utils/mapLocation';
import { MapPickerModal } from './MapPickerModal';
import { ease } from '../../../utils/motion';

type LocationOption =
  | { kind: 'place'; id: string; place: PlaceSuggestion }
  | { kind: 'link'; id: string; url: string }
  | { kind: 'map'; id: string };

/** Kayıtlı bağlantının alanda gösterilecek karşılığı: koordinat ya da bağlantının kendisi. */
function describeMapUrl(mapUrl: string): string {
  if (!mapUrl) return '';
  const point = readMapLocation(mapUrl);
  return point ? formatCoordinates(point) : mapUrl;
}

interface LocationSearchFieldProps {
  label: string;
  placeholder: string;
  /** Kayıtlı harita bağlantısı (`Invitation.mapUrl`); boş = konum seçilmedi. */
  value: string;
  onChange: (mapUrl: string) => void;
  labelClass: string;
  inputClass: string;
}

/**
 * "Ulaşım Bilgileri" — yazarak aranan, haritadan da seçilebilen konum alanı.
 *
 * Akış:
 * 1. Kullanıcı yer adını yazar; backend'in Google Haritalar vekilinden
 *    öneriler listelenir (uç hazır olana kadar liste boştur, bkz.
 *    `services/places.ts`).
 * 2. Listenin sonunda her zaman "Harita üzerinden konum seç" bulunur; açılan
 *    pencerede harita ve en altta koordinat girişi vardır.
 * 3. Bir öneri ya da koordinat seçilince misafirin "Yol Tarifi Al" düğmesini
 *    besleyen Google Haritalar yol tarifi bağlantısı `mapUrl`'e yazılır.
 *
 * 🔴 Yazılan metin TEK BAŞINA kaydedilmez: bir yer adı konum değildir. State'e
 * yalnızca seçilmiş bir konum yazılır; alan boşken placeholder yalnızca
 * silik bir rehberdir. Metni tamamen silmek seçili konumu kaldırır.
 */
export function LocationSearchField({
  label,
  placeholder,
  value,
  onChange,
  labelClass,
  inputClass
}: LocationSearchFieldProps) {
  const baseId = useId();
  const inputId = `${baseId}-input`;
  const listboxId = `${baseId}-listbox`;
  const statusId = `${baseId}-status`;
  const inputRef = useRef<HTMLInputElement>(null);

  const [committedLabel, setCommittedLabel] = useState(() => describeMapUrl(value));
  const [query, setQuery] = useState(committedLabel);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [pickerOpen, setPickerOpen] = useState(false);

  // Dışarıdan gelen değişiklik (sıfırlama, kayıt yükleme) alanı yeniden kurar.
  // Kendi seçimimiz ise önce ref'e yazılır ve burada atlanır — böylece seçilen
  // yerin ADI, bağlantıdan türetilen koordinatla ezilmez.
  const lastValueRef = useRef(value);
  useEffect(() => {
    if (value === lastValueRef.current) return;
    lastValueRef.current = value;
    const nextLabel = describeMapUrl(value);
    setCommittedLabel(nextLabel);
    setQuery(nextLabel);
  }, [value]);

  const trimmedQuery = query.trim();
  const isDirty = trimmedQuery !== committedLabel.trim();
  const { suggestions, loading, completedQuery } = usePlaceSearch(open && isDirty ? trimmedQuery : '');

  const options = useMemo<LocationOption[]>(() => {
    const list: LocationOption[] = isDirty
      ? suggestions.map((place) => ({ kind: 'place', id: `place-${place.placeId}`, place }))
      : [];

    // Önceki sürümde bu alana Google Haritalar bağlantısı yapıştırılıyordu;
    // o yol korunur.
    if (isDirty && isHttpUrl(trimmedQuery)) {
      list.push({ kind: 'link', id: 'link', url: trimmedQuery });
    }

    list.push({ kind: 'map', id: 'map' });
    return list;
  }, [isDirty, suggestions, trimmedQuery]);

  const safeIndex = Math.min(activeIndex, options.length - 1);
  const showNoResults =
    isDirty && !loading && completedQuery !== null && completedQuery === trimmedQuery && suggestions.length === 0;

  const commit = (mapUrl: string, nextLabel: string) => {
    lastValueRef.current = mapUrl;
    setCommittedLabel(nextLabel);
    setQuery(nextLabel);
    setOpen(false);
    if (mapUrl !== value) onChange(mapUrl);
  };

  const openPicker = () => {
    setOpen(false);
    setPickerOpen(true);
  };

  const closePicker = () => {
    setPickerOpen(false);
    inputRef.current?.focus();
  };

  const choose = (option: LocationOption) => {
    if (option.kind === 'map') openPicker();
    else if (option.kind === 'place') {
      commit(buildDirectionsUrl(option.place.location, option.place.placeId), option.place.name);
    }
    else commit(option.url, option.url);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowUp': {
        e.preventDefault();
        const step = e.key === 'ArrowDown' ? 1 : -1;
        if (!open) {
          setOpen(true);
          setActiveIndex(step === 1 ? 0 : options.length - 1);
        } else {
          setActiveIndex((safeIndex + step + options.length) % options.length);
        }
        break;
      }
      case 'Enter':
        // 🔴 Alan sihirbaz formunun içinde: Enter varsayılan olarak formu
        // gönderir ("Davetiyeni Oluştur"). Konum alanında Enter bir seçimdir.
        e.preventDefault();
        if (open) choose(options[safeIndex]);
        else setOpen(true);
        break;
      case 'Escape':
        if (open) {
          e.preventDefault();
          setOpen(false);
        }
        break;
      default:
        break;
    }
  };

  const handleBlur = () => {
    setOpen(false);
    // Metni tamamen silmek konumu kaldırmak demektir: boş alan "konum yok"tur.
    if (trimmedQuery === '' && value) commit('', '');
  };

  const savedPoint = readMapLocation(value);
  // Doğrulama bağlantısı yalnızca gerçek bir http(s) adresine verilir.
  const savedLink = savedPoint ? buildMapSearchUrl(savedPoint) : isHttpUrl(value) ? value : null;
  const showPendingHint = !open && !pickerOpen && isDirty && trimmedQuery !== '';
  const showSavedHint = !showPendingHint && value !== '' && !isDirty;

  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className={labelClass}>
        {label}
      </label>

      <div className="relative">
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-activedescendant={open ? `${listboxId}-${options[safeIndex].id}` : undefined}
          aria-describedby={showPendingHint || showSavedHint ? statusId : undefined}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActiveIndex(0);
          }}
          onClick={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
          className={cn(inputClass, 'pr-[4.5rem] truncate')}
        />

        {/* Sağdaki eylemler: odak alanda kalsın diye mousedown engellenir;
            aksi halde tıklama önce blur'u tetikler ve liste kapanırdı. */}
        <div className="absolute inset-y-0 right-2 flex items-center gap-0.5">
          <AnimatePresence initial={false}>
            {(query !== '' || value !== '') && (
              <motion.button
                key="clear"
                type="button"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.2, ease: ease.out }}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  commit('', '');
                  inputRef.current?.focus();
                }}
                aria-label="Konumu temizle"
                className="w-7 h-7 rounded-lg text-white/40 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors duration-300 cursor-pointer"
              >
                <X size={14} />
              </motion.button>
            )}
          </AnimatePresence>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={openPicker}
            aria-label="Harita üzerinden konum seç"
            title="Harita üzerinden konum seç"
            className="w-7 h-7 rounded-lg text-champagne/80 hover:text-champagne hover:bg-white/10 flex items-center justify-center transition-colors duration-300 cursor-pointer"
          >
            <MapPinned size={15} />
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.ul
              id={listboxId}
              role="listbox"
              aria-label="Konum seçenekleri"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.22, ease: ease.out }}
              data-lenis-prevent
              className="absolute left-0 right-0 top-full mt-2 z-30 max-h-72 overflow-y-auto rounded-xl border border-white/15 bg-brand-deep p-1.5 shadow-2xl shadow-black/40"
            >
              {loading && (
                <li role="presentation" className="flex items-center gap-2 px-3 py-2.5 text-xs text-white/50">
                  <Loader2 size={13} className="animate-spin" />
                  Konumlar aranıyor…
                </li>
              )}

              {showNoResults && (
                <li role="presentation" className="px-3 py-2.5 text-xs text-white/50">
                  “{completedQuery}” için konum bulunamadı.
                </li>
              )}

              {options.map((option, index) => {
                const active = index === safeIndex;
                return (
                  <li
                    key={option.id}
                    id={`${listboxId}-${option.id}`}
                    role="option"
                    aria-selected={active}
                    onMouseDown={(e) => e.preventDefault()}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => choose(option)}
                    className={cn(
                      'flex items-start gap-3 rounded-lg px-3 py-2.5 cursor-pointer transition-colors duration-200',
                      active ? 'bg-white/10' : 'hover:bg-white/5',
                      option.kind === 'map' && index > 0 && 'mt-1'
                    )}
                  >
                    {option.kind === 'place' && (
                      <>
                        <MapPin size={15} className="mt-0.5 shrink-0 text-champagne/80" />
                        <span className="min-w-0">
                          <span className="block text-sm text-white truncate">{option.place.name}</span>
                          <span className="block text-[11px] text-white/45 truncate">{option.place.address}</span>
                        </span>
                      </>
                    )}

                    {option.kind === 'link' && (
                      <>
                        <Link2 size={15} className="mt-0.5 shrink-0 text-champagne/80" />
                        <span className="min-w-0">
                          <span className="block text-sm text-white">Bu harita bağlantısını kullan</span>
                          <span className="block text-[11px] text-white/45 truncate">{option.url}</span>
                        </span>
                      </>
                    )}

                    {option.kind === 'map' && (
                      <>
                        <span className="mt-0.5 shrink-0 w-7 h-7 -my-0.5 rounded-lg bg-gold/15 text-champagne flex items-center justify-center">
                          <MapPinned size={14} />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold text-champagne">Harita üzerinden konum seç</span>
                          <span className="block text-[11px] text-white/45">Haritada görüntüleyin, koordinatı girin</span>
                        </span>
                      </>
                    )}
                  </li>
                );
              })}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence initial={false} mode="wait">
        {showPendingHint && (
          <motion.p
            key="pending"
            id={statusId}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25, ease: ease.out }}
            className="text-[11px] leading-relaxed text-amber-200/80"
          >
            Yazdığınız konum henüz seçilmedi. Listeden bir öneri seçin ya da haritadan işaretleyin.
          </motion.p>
        )}

        {showSavedHint && (
          <motion.p
            key="saved"
            id={statusId}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25, ease: ease.out }}
            className="flex items-start gap-1.5 text-[11px] leading-relaxed text-white/45"
          >
            <MapPin size={11} className="mt-[3px] shrink-0 text-champagne/70" />
            <span>
              Misafirleriniz “Yol Tarifi Al” ile bu konuma yönlendirilecek.
              {savedLink && (
                <>
                  {' '}
                  <a
                    href={savedLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-champagne/80 hover:text-champagne"
                  >
                    Haritada gör
                    <ExternalLink size={10} />
                  </a>
                </>
              )}
            </span>
          </motion.p>
        )}
      </AnimatePresence>

      <MapPickerModal
        open={pickerOpen}
        initialPoint={parseCoordinates(query) ?? savedPoint}
        onClose={closePicker}
        onConfirm={(point) => {
          commit(buildDirectionsUrl(point), formatCoordinates(point));
          closePicker();
        }}
      />
    </div>
  );
}
