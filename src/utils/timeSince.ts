const units = [
    { unit: "year", sec: 3.154e+7 },
    { unit: "month", sec: 2.628e+6 },
    { unit: "day", sec: 86400 },
    { unit: "hour", sec: 3600 },
    { unit: "minute", sec: 60 },
    { unit: "second", sec: 1 }
] as const;

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto", style: "short" });

export function relativeTimeFromElapsed(elapsed: number) {
    for (const { unit, sec } of units) {
        const tis = elapsed / 1000;
        if (Math.abs(tis) >= sec || unit === "second") {
            return rtf.format(Math.round(tis / sec), unit);
        }
    }
    return "";
}

export function relativeTimeFromDate(currentTime: number, date?: string) {
    if (!date) return "";
    const d = new Date(date);
    const elapsed = d.getTime() - currentTime;
    return relativeTimeFromElapsed(elapsed);
}

export default function relativeTimeFromNow(date?: string) {
    if (!date) return "";
    const d = new Date(date);
    const elapsed = d.getTime() - new Date().getTime();
    return relativeTimeFromElapsed(elapsed);
}

