export const getDaysInMonth = (year, month) =>
  new Date(year, month + 1, 0).getDate();

getDaysInMonth(2023, 10);
