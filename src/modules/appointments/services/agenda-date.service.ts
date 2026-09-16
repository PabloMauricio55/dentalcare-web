export const DEMO_TODAY = "2026-09-10";

function parseDate(value: string) {
  return new Date(`${value}T12:00:00`);
}

export function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function shiftDate(value: string, amount: number, unit: "day" | "week" | "month") {
  const date = parseDate(value);
  if (unit === "month") date.setMonth(date.getMonth() + amount);
  else date.setDate(date.getDate() + amount * (unit === "week" ? 7 : 1));
  return toDateKey(date);
}

export function startOfWeek(value: string) {
  const date = parseDate(value);
  const day = date.getDay() || 7;
  date.setDate(date.getDate() - day + 1);
  return date;
}

export function weekDates(value: string) {
  const start = startOfWeek(value);
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return toDateKey(date);
  });
}

export function monthDates(value: string) {
  const current = parseDate(value);
  const first = new Date(current.getFullYear(), current.getMonth(), 1, 12);
  const start = startOfWeek(toDateKey(first));
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return toDateKey(date);
  });
}

export function isSameMonth(left: string, right: string) {
  const a = parseDate(left);
  const b = parseDate(right);
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export function formatLongDate(value: string) {
  return new Intl.DateTimeFormat("es-GT", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(parseDate(value));
}

export function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("es-GT", { weekday: "short", day: "numeric", month: "short" }).format(parseDate(value));
}

export function formatMonth(value: string) {
  return new Intl.DateTimeFormat("es-GT", { month: "long", year: "numeric" }).format(parseDate(value));
}
