const STORAGE_KEY = 'liftly-training-data';

export function loadTrainingData() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(stored?.records)) {
      return { version: 2, records: stored.records.map(normalizeRecord) };
    }
  } catch { /* use an empty history */ }
  return { version: 2, records: [] };
}

export function saveTrainingData(data) { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
export function normalizeRecord(record) {
  if (Array.isArray(record.entries)) return { ...record, exercise: record.exercise ?? record.exerciseName ?? '', recordedAt: record.recordedAt ?? record.date, entries: record.entries.map((entry) => ({ weight: Number(entry.weight), reps: Number(entry.reps), sets: Number(entry.sets) || 1 })) };
  if (Array.isArray(record.sets)) return { ...record, exercise: record.exercise ?? record.exerciseName ?? '', recordedAt: record.recordedAt ?? record.date, entries: record.sets.map((set) => ({ weight: Number(set.weight), reps: Number(set.reps), sets: 1 })) };
  const setCount = Math.max(1, Number(record.sets) || 1);
  return { ...record, entries: [{ weight: Number(record.weight), reps: Number(record.reps), sets: setCount }] };
}
export function totalVolume(record) { return record.entries.reduce((total, entry) => total + entry.weight * entry.reps * entry.sets, 0); }
export function maxWeight(record) { return Math.max(0, ...record.entries.map((entry) => entry.weight)); }
export function totalReps(record) { return record.entries.reduce((total, entry) => total + entry.reps * entry.sets, 0); }
export function totalSets(record) { return record.entries.reduce((total, entry) => total + entry.sets, 0); }
export function formatNumber(value) { return Number.isInteger(value) ? String(value) : Number(value).toFixed(1); }
export function formatDateTime(value) { return new Intl.DateTimeFormat('ja-JP', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(value)); }
export function getPreviousRecord(records, record) {
  return records.filter((item) => item.exercise === record.exercise && item.recordedAt < record.recordedAt).sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt))[0];
}
