
export const getWeekDateRange = (year: number, weekNumber: number) => {
  // Calculate the first day of the year
  const firstDayOfYear = new Date(year, 0, 1);
  
  // Calculate the first Monday of the year (ISO week date system)
  const firstMonday = new Date(firstDayOfYear);
  const dayOfWeek = firstDayOfYear.getDay();
  const daysToMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
  firstMonday.setDate(firstDayOfYear.getDate() + daysToMonday);
  
  // Calculate the start of the target week
  const weekStart = new Date(firstMonday);
  weekStart.setDate(firstMonday.getDate() + (weekNumber - 1) * 7);
  
  // Calculate the end of the target week
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  
  return {
    start: weekStart,
    end: weekEnd,
    startString: weekStart.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' }),
    endString: weekEnd.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })
  };
};

export const getCurrentWeek = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor((now.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + start.getDay() + 1) / 7);
};
