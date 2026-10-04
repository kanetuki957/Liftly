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
  if (Array.isArray(record.entries)) return { ...record, exercise: record.exercise ?? record.exerciseName ?? '', recordedAt: record.recordedAt ?? record.date, sideMode: Boolean(record.sideMode), assisted: Boolean(record.assisted), memo: record.memo ?? '', entries: record.entries.map((entry) => ({ weight: entry.weight == null ? undefined : Number(entry.weight), assistanceWeight: entry.assistanceWeight == null ? undefined : Number(entry.assistanceWeight), reps: Number(entry.reps), sets: Number(entry.sets) || 1, side: entry.side ?? null })) };
  if (Array.isArray(record.sets)) return { ...record, exercise: record.exercise ?? record.exerciseName ?? '', recordedAt: record.recordedAt ?? record.date, sideMode: false, assisted: false, memo: record.memo ?? '', entries: record.sets.map((set) => ({ weight: Number(set.weight), reps: Number(set.reps), sets: 1, side: null })) };
  const setCount = Math.max(1, Number(record.sets) || 1);
  return { ...record, sideMode: false, assisted: false, memo: record.memo ?? '', entries: [{ weight: Number(record.weight), reps: Number(record.reps), sets: setCount, side: null }] };
}
export function entryLoad(entry) { return entry.weight ?? entry.assistanceWeight ?? 0; }
export function entriesVolume(entries) { return entries.reduce((total, entry) => total + entryLoad(entry) * entry.reps * entry.sets, 0); }
export function sideVolumes(record) {
  if (!record.sideMode) return null;
  const right = entriesVolume(record.entries.filter((entry) => entry.side === 'right' || entry.side === 'both'));
  const left = entriesVolume(record.entries.filter((entry) => entry.side === 'left' || entry.side === 'both'));
  return { right, left, total: right + left };
}
export function totalVolume(record) { const sides = sideVolumes(record); return sides ? sides.total : entriesVolume(record.entries); }
export function maxWeight(record) { return Math.max(0, ...record.entries.map((entry) => entry.weight ?? 0)); }
export function totalReps(record) { return record.entries.reduce((total, entry) => total + entry.reps * entry.sets, 0); }
export function totalSets(record) { return record.entries.reduce((total, entry) => total + entry.sets, 0); }
export function formatEntry(entry) { const amount = entry.assistanceWeight != null ? `補助 ${formatNumber(entry.assistanceWeight)}kg` : `${formatNumber(entry.weight)}kg`; return `${amount} × ${formatNumber(entry.reps)}回 × ${formatNumber(entry.sets)}set`; }
export function formatNumber(value) { return Number.isInteger(value) ? String(value) : Number(value).toFixed(1); }
export function formatDateTime(value) { return new Intl.DateTimeFormat('ja-JP', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(value)); }
export function getPreviousRecord(records, record) {
  return records.filter((item) => item.exercise === record.exercise && item.recordedAt < record.recordedAt).sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt))[0];
}
