export const getAgeFromBirthDate = (
  birthDate: string,
  now = new Date()
): number => {
  const [year, month, day] = birthDate.split('-').map(Number);
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();

  let age = currentYear - year;

  if (currentMonth < month || (currentMonth === month && currentDay < day)) {
    age -= 1;
  }

  return age;
};

export const isBirthday = (birthDate: string, now = new Date()): boolean => {
  const [, month, day] = birthDate.split('-').map(Number);
  return now.getMonth() + 1 === month && now.getDate() === day;
};
