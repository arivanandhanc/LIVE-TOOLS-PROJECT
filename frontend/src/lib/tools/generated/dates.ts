import type { GenSpec } from "./types";

const firstDate = (s: string) => {
  const t = s.trim().match(/\d{4}-\d{1,2}-\d{1,2}/);
  if (!t) throw new Error("Enter a date as YYYY-MM-DD.");
  const d = new Date(t[0] + "T00:00:00");
  if (isNaN(d.getTime())) throw new Error("Invalid date.");
  return d;
};

const D = (slug: string, name: string, description: string, keywords: string[], run: (s: string) => string): GenSpec =>
  ({ slug, name, description, keywords, category: "convert", kind: "transform", live: true, run, placeholder: "YYYY-MM-DD" });
const G = (slug: string, name: string, description: string, keywords: string[], generate: () => string): GenSpec =>
  ({ slug, name, description, keywords, category: "convert", kind: "generate", generate, generateLabel: "Refresh" });

const ZODIAC: [number, string][] = [[20, "Capricorn"], [19, "Aquarius"], [20, "Pisces"], [20, "Aries"], [21, "Taurus"], [21, "Gemini"], [22, "Cancer"], [23, "Leo"], [23, "Virgo"], [23, "Libra"], [22, "Scorpio"], [22, "Sagittarius"]];
const CHINESE = ["Monkey", "Rooster", "Dog", "Pig", "Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat"];

export const dateTools: GenSpec[] = [
  D("days-between-dates", "Days Between Dates", "Count the days between two dates.", ["days", "between", "dates"], (s) => { const m = s.match(/\d{4}-\d{1,2}-\d{1,2}/g); if (!m || m.length < 2) throw new Error("Enter two dates (YYYY-MM-DD), one per line."); const a = new Date(m[0]), b = new Date(m[1]); return `${Math.abs(Math.round((+b - +a) / 86400000))} days`; }),
  D("weekday-finder", "Weekday Finder", "Find the day of the week for a date.", ["weekday", "day", "date"], (s) => { const m = s.match(/\d{4}-\d{1,2}-\d{1,2}/g); if (!m) throw new Error("Enter a date YYYY-MM-DD."); return m.map((d) => `${d}: ${new Date(d + "T00:00:00").toLocaleDateString("en-US", { weekday: "long" })}`).join("\n"); }),
  D("days-until-date", "Days Until Date", "Count down the days until a date.", ["countdown", "days until"], (s) => { const d = firstDate(s); const today = new Date(); today.setHours(0, 0, 0, 0); const diff = Math.round((+d - +today) / 86400000); return diff >= 0 ? `${diff} days until that date` : `${-diff} days ago`; }),
  D("age-in-days", "Age in Days", "How many days old are you?", ["age", "days", "birthday"], (s) => { const d = firstDate(s); const diff = Math.floor((Date.now() - +d) / 86400000); if (diff < 0) throw new Error("Enter a past date."); return `${diff.toLocaleString()} days\n${Math.floor(diff / 7).toLocaleString()} weeks\n${(diff / 365.25).toFixed(1)} years`; }),
  D("leap-year-checker", "Leap Year Checker", "Check if a year is a leap year.", ["leap", "year"], (s) => { const y = (s.match(/\d{1,4}/g) || []).map(Number); if (!y.length) throw new Error("Enter a year."); return y.map((n) => `${n}: ${(n % 4 === 0 && n % 100 !== 0) || n % 400 === 0 ? "Leap year" : "Not a leap year"}`).join("\n"); }),
  D("week-number", "Week Number", "Find the ISO week number of a date.", ["week", "number", "iso"], (s) => { const d = firstDate(s); const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())); const dayNum = (date.getUTCDay() + 6) % 7; date.setUTCDate(date.getUTCDate() - dayNum + 3); const ft = new Date(Date.UTC(date.getUTCFullYear(), 0, 4)); const week = 1 + Math.round(((+date - +ft) / 86400000 - 3 + ((ft.getUTCDay() + 6) % 7)) / 7); return `Week ${week}`; }),
  D("day-of-year", "Day of the Year", "Which day of the year is a date?", ["day", "year", "ordinal"], (s) => { const d = firstDate(s); const start = new Date(d.getFullYear(), 0, 0); return `Day ${Math.floor((+d - +start) / 86400000)} of ${d.getFullYear()}`; }),
  D("quarter-finder", "Quarter Finder", "Find the fiscal quarter of a date.", ["quarter", "fiscal", "q1"], (s) => { const d = firstDate(s); return `Q${Math.floor(d.getMonth() / 3) + 1} ${d.getFullYear()}`; }),
  D("days-in-month", "Days in Month", "How many days are in a month?", ["days", "month"], (s) => { const m = s.match(/(\d{4})-(\d{1,2})/); if (!m) throw new Error("Enter year-month, e.g. 2026-02."); return `${new Date(+m[1], +m[2], 0).getDate()} days`; }),
  D("zodiac-sign", "Zodiac Sign Finder", "Find the zodiac sign for a birth date.", ["zodiac", "horoscope", "star sign"], (s) => { const d = firstDate(s); const mo = d.getMonth(); const idx = d.getDate() <= ZODIAC[mo][0] ? mo : (mo + 1) % 12; return ZODIAC[idx][1]; }),
  D("chinese-zodiac", "Chinese Zodiac", "Find the Chinese zodiac animal for a year.", ["chinese", "zodiac", "animal"], (s) => { const y = (s.match(/\d{4}/) || [])[0]; if (!y) throw new Error("Enter a 4-digit year."); return CHINESE[+y % 12]; }),
  D("time-ago", "Time Ago", "Convert a date into 'time ago' text.", ["time ago", "relative", "date"], (s) => { const d = firstDate(s); const sec = Math.floor((Date.now() - +d) / 1000); const units: [number, string][] = [[31557600, "year"], [2629800, "month"], [604800, "week"], [86400, "day"], [3600, "hour"], [60, "minute"]]; for (const [u, n] of units) { const v = Math.floor(Math.abs(sec) / u); if (v >= 1) return `${v} ${n}${v > 1 ? "s" : ""} ${sec >= 0 ? "ago" : "from now"}`; } return "just now"; }),
  G("current-timestamp", "Current Unix Timestamp", "Get the current Unix timestamp now.", ["unix", "timestamp", "now"], () => { const now = Date.now(); return `Seconds: ${Math.floor(now / 1000)}\nMilliseconds: ${now}\nISO: ${new Date(now).toISOString()}`; }),
  G("current-datetime", "Current Date & Time", "Show the current date and time.", ["now", "date", "time", "clock"], () => { const d = new Date(); return `Local: ${d.toLocaleString()}\nUTC: ${d.toUTCString()}\nISO: ${d.toISOString()}`; }),
];
