const STORAGE_KEY = 'liftly-training-data';

export function loadTrainingData() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (stored?.version === 1 && Array.isArray(stored.records)) return { version: 1, records: stored.records };
  } catch { /* use an empty history */ }
  return { version: 1, records: [] };
}

export function saveTrainingData(data) { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
export function totalVolume(record) { return record.weight * record.reps * record.sets; }
export function formatNumber(value) { return Number.isInteger(value) ? String(value) : Number(value).toFixed(1); }
export function formatDateTime(value) { return new Intl.DateTimeFormat('ja-JP', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(value)); }
export function getPreviousRecord(records, record) {
  return records.filter((item) => item.exercise === record.exercise && item.recordedAt < record.recordedAt).sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt))[0];
}
