export const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri"] as const;

export function getTodayIndex(): number {
  const day = new Date().getDay();
  return day >= 6 ? 0 : day;
}

export function getWeekDates(): number[] {
  const today = new Date();
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - today.getDay());

  return DAYS.map((_, index) => {
    const date = new Date(sunday);
    date.setDate(sunday.getDate() + index);
    return date.getDate();
  });
}
