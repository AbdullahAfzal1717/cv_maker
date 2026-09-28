export const parseMonthYear = (value: string): Date | null => {
  if (!value) return null;
  const [year, month] = value.split("-");
  if (!year || !month) return null;
  const parsed = new Date(parseInt(year), parseInt(month) - 1, 1);
  return isNaN(parsed.getTime()) ? null : parsed;
};

export const toMonthYearString = (date: Date | null): string => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};
