const STORAGE_KEY = 'liftly-pfc-data';

export const DEFAULT_GOALS = {
  protein: 130,
  fat: 60,
  carbs: 300,
};

export function getTodayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function loadData() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (
      stored?.version === 1 &&
      stored.goals &&
      stored.days &&
      typeof stored.days === 'object'
    ) {
      return {
        version: 1,
        goals: { ...DEFAULT_GOALS, ...stored.goals },
        days: stored.days,
      };
    }
  } catch {
    // Ignore missing or invalid local data and start with the defaults.
  }

  return { version: 1, goals: DEFAULT_GOALS, days: {} };
}

export function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function sumMacros(meals) {
  return meals.reduce(
    (sum, meal) => ({
      protein: sum.protein + meal.protein,
      fat: sum.fat + meal.fat,
      carbs: sum.carbs + meal.carbs,
    }),
    { protein: 0, fat: 0, carbs: 0 },
  );
}

export function formatGrams(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}