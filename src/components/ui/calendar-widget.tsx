"use client";

import { useEffect, useState } from "react";

const DAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getCalendarGrid(date: Date): Array<number | null> {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<number | null> = Array(firstDay).fill(null);
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(day);
  }
  while (cells.length % 7 !== 0) {
    cells.push(null);
  }
  return cells;
}

export function CalendarWidget({ className }: { className?: string }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const month = MONTH_NAMES[now.getMonth()];
  const cells = getCalendarGrid(now);

  return (
    <div className={className}>
      <div className="text-center text-sm font-semibold text-black/80 dark:text-white/80">
        {month} {now.getFullYear()}
      </div>
      <div className="mt-2 grid w-[172px] grid-cols-7 gap-1 text-center text-[10px]">
        {DAY_NAMES.map((name) => (
          <span key={name} className="flex aspect-square w-full items-center justify-center text-black/50 dark:text-white/50">
            {name}
          </span>
        ))}
        {cells.map((day, index) =>
          day === null ? (
            <span key={`empty-${index}`} />
          ) : (
            <span
              key={day}
              className={
                day === now.getDate()
                  ? "flex aspect-square w-full items-center justify-center rounded-full bg-white text-black dark:bg-black dark:text-white"
                  : "flex aspect-square w-full items-center justify-center rounded-full text-black/70 dark:text-white/70"
              }
            >
              {day}
            </span>
          ),
        )}
      </div>
    </div>
  );
}
