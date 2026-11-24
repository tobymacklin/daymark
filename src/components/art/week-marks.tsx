import { addDays, weekdayIndex, weekdayName, type LocalDate } from "@/lib/dates";

type WeekMarksProps = {
  today: LocalDate;
  completed: ReadonlySet<string>;
};

/** Monday-start week containing `today`. */
export function WeekMarks({ today, completed }: WeekMarksProps) {
  const index = weekdayIndex(today);
  const mondayOffset = index === 0 ? -6 : 1 - index;
  const monday = addDays(today, mondayOffset);
  const days = Array.from({ length: 7 }, (_, i) => addDays(monday, i));

  return (
    <ol className="grid grid-cols-7 gap-2">
      {days.map((date) => {
        const kept = completed.has(date);
        const isToday = date === today;
        return (
          <li key={date} className="text-center">
            <span className="block text-[10px] uppercase tracking-[0.14em] text-forest-ink/45">
              {weekdayName(date).slice(0, 1)}
            </span>
            <span
              className={`mx-auto mt-2 flex h-8 w-8 items-center justify-center border text-xs tabular ${
                kept
                  ? "border-action-green bg-action-green text-warm-cream"
                  : isToday
                    ? "border-forest-ink text-forest-ink"
                    : "border-forest-ink/15 text-forest-ink/35"
              }`}
            >
              {date.slice(8)}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
