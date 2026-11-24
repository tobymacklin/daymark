import {
  dayOfMonth,
  daysInMonth,
  formatMonth,
  type LocalDate,
  type YearMonth,
  weekdayIndex,
} from "@/lib/dates";

type MonthCalendarProps = {
  month: YearMonth;
  markedDates: LocalDate[];
  today: LocalDate;
};

export function MonthCalendar({ month, markedDates, today }: MonthCalendarProps) {
  const marked = new Set(markedDates);
  const total = daysInMonth(month);
  const lead = weekdayIndex(`${month}-01`);
  const cells: Array<{ key: string; day?: number; date?: LocalDate }> = [];

  for (let i = 0; i < lead; i += 1) cells.push({ key: `pad-${i}` });
  for (let day = 1; day <= total; day += 1) {
    const date = `${month}-${String(day).padStart(2, "0")}` as LocalDate;
    cells.push({ key: date, day, date });
  }

  return (
    <section className="rounded-[var(--radius-card)] bg-warm-cream/70 p-4">
      <h2 className="font-display text-xl">{formatMonth(month)}</h2>
      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[11px] uppercase tracking-wide text-forest-ink/45">
        {["S", "M", "T", "W", "T", "F", "S"].map((label, index) => (
          <span key={`${label}-${index}`}>{label}</span>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-1">
        {cells.map((cell) => {
          if (!cell.date || !cell.day) return <span key={cell.key} />;
          const hasMemory = marked.has(cell.date);
          const isToday = cell.date === today;
          return (
            <span
              key={cell.key}
              className={`flex h-9 items-center justify-center rounded-full text-sm tabular ${
                hasMemory
                  ? "bg-action-green text-warm-cream"
                  : isToday
                    ? "border border-action-green text-forest-ink"
                    : "text-forest-ink/70"
              }`}
              title={hasMemory ? `Moment on day ${dayOfMonth(cell.date)}` : undefined}
            >
              {cell.day}
            </span>
          );
        })}
      </div>
    </section>
  );
}
