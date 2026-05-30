const BOLIVIA_TIME_ZONE = 'America/La_Paz';

const boliviaDateFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: BOLIVIA_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

function toValidDate(value: string | Date): Date | null {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function getBoliviaDateKey(value: string | Date): string | null {
  const date = toValidDate(value);
  return date ? boliviaDateFormatter.format(date) : null;
}

export function isTodayInBolivia(value: string | Date): boolean {
  const targetKey = getBoliviaDateKey(value);
  const todayKey = getBoliviaDateKey(new Date());
  return targetKey !== null && todayKey !== null && targetKey === todayKey;
}

