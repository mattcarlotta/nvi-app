const units = [
    { unit: 'year', ms: 31536000000 },
    { unit: 'month', ms: 2628000000 },
    { unit: 'day', ms: 86400000 },
    { unit: 'hour', ms: 3600000 },
    { unit: 'minute', ms: 60000 },
    { unit: 'second', ms: 1000 }
] as const;
const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

export function relativeTimeFromElapsed(elapsed: number) {
    for (const { unit, ms } of units) {
        if (Math.abs(elapsed) >= ms || unit === 'second') {
            return rtf.format(Math.round(elapsed / ms), unit);
        }
    }
    return '';
}

export default function relativeTimeFromDates(relative?: string) {
    if (!relative) return '';
    const d = new Date(relative);
    const elapsed = d.getTime() - new Date().getTime();
    return relativeTimeFromElapsed(elapsed);
}
