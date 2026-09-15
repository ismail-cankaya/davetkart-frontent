import { Invitation } from '../../../types';
import { instantToWallClock, wallClockToInstant } from '../../../utils/eventTime';

/**
 * Takvime ekleme yardımcıları.
 *
 * 🔴 Damgalar **yüzer (floating) yerel saat** olarak yazılır: sonda `Z` yok
 * ve `TZID` yok. RFC 5545'te bu, *"etkinlik nerede açılırsa o saatte"*
 * demektir ve bir duvar saati için doğru olan budur — misafirin takvimi
 * saati kaydırmaz.
 *
 * Damganın **hangi** duvar saati olduğu ise mekânın saat diliminden gelir,
 * misafirin tarayıcısından değil. Bitiş saati de o dilimde hesaplanır:
 * misafirin bölgesinde araya giren bir yaz saati geçişi, mekândaki bitiş
 * saatini kaydırmamalı.
 */

const EVENT_DURATION_HOURS = 4;

/** `YYYY-MM-DDTHH:mm` → `YYYYMMDDTHHMMSS` (takvim damgası). */
function toCalendarStamp(wallClock: string): string {
  return `${wallClock.replace(/[-:]/g, '')}00`;
}

function eventRange(invitation: Invitation): { start: string; end: string } | null {
  const zone = invitation.timezone;
  const startInstant = wallClockToInstant(invitation.date, zone);
  if (startInstant === null) return null;

  const endInstant = startInstant + EVENT_DURATION_HOURS * 60 * 60 * 1000;

  return {
    start: toCalendarStamp(instantToWallClock(startInstant, zone)),
    end: toCalendarStamp(instantToWallClock(endInstant, zone)),
  };
}

function eventTitle(invitation: Invitation): string {
  return invitation.names ? `${invitation.names} — Davet` : 'Davet';
}

/** Prefilled Google Calendar "create event" link. */
export function googleCalendarUrl(invitation: Invitation): string | null {
  const range = eventRange(invitation);
  if (!range) return null;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: eventTitle(invitation),
    dates: `${range.start}/${range.end}`,
    details: invitation.subtitle,
    location: invitation.venue
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Build and download an .ics file — the universal path for Apple Calendar,
 * Outlook and every other RFC 5545 client.
 */
export function downloadIcsFile(invitation: Invitation): void {
  const range = eventRange(invitation);
  if (!range) return;

  const escapeText = (value: string) => value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//DavetKart//Invitation//TR',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:davetkart-${Date.now()}@davetkart.app`,
    // DTSTAMP dosyanın oluşturulma ANIdır ve UTC olmak zorundadır (RFC 5545
    // §3.8.7.2) — etkinlik saatinin aksine yüzer olamaz.
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`,
    `DTSTART:${range.start}`,
    `DTEND:${range.end}`,
    `SUMMARY:${escapeText(eventTitle(invitation))}`,
    `DESCRIPTION:${escapeText(invitation.subtitle)}`,
    `LOCATION:${escapeText(invitation.venue)}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'davet.ics';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
