import { useState } from 'react';
import { Plus, X } from 'lucide-react';

function localDateTimeNow() { const now = new Date(); now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); return now.toISOString().slice(0, 16); }
const initialEntry = () => ({ exercise: '', weight: '', reps: '', sets: '', recordedAt: localDateTimeNow() });

export default function TrainingEntry({ onAdd, onCancel }) {
  const [entry, setEntry] = useState(initialEntry);
  const volume = Number(entry.weight || 0) * Number(entry.reps || 0) * Number(entry.sets || 0);
  function submit(event) { event.preventDefault(); onAdd({ id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`, exercise: entry.exercise.trim(), weight: Number(entry.weight), reps: Number(entry.reps), sets: Number(entry.sets), recordedAt: new Date(entry.recordedAt).toISOString(), createdAt: new Date().toISOString() }); }
  return <form className="meal-form training-form" onSubmit={submit}>
    <div className="form-panel-heading"><div><p className="eyebrow">NEW TRAINING LOG</p><h3>トレーニングを記録</h3></div><button className="icon-button close-form" type="button" onClick={onCancel} aria-label="入力を閉じる"><X size={19} /></button></div>
    <label className="field meal-name-field"><span>種目名</span><input autoFocus required maxLength="60" placeholder="例：ベンチプレス" value={entry.exercise} onChange={(e) => setEntry({ ...entry, exercise: e.target.value })} /></label>
    <div className="form-grid training-form-grid">
      <label className="field"><span>重量</span><span className="input-with-unit"><input required min="0" step="0.5" inputMode="decimal" type="number" value={entry.weight} onChange={(e) => setEntry({ ...entry, weight: e.target.value })} /><span>kg</span></span></label>
      <label className="field"><span>回数</span><span className="input-with-unit"><input required min="1" step="1" inputMode="numeric" type="number" value={entry.reps} onChange={(e) => setEntry({ ...entry, reps: e.target.value })} /><span>回</span></span></label>
      <label className="field"><span>セット数</span><span className="input-with-unit"><input required min="1" step="1" inputMode="numeric" type="number" value={entry.sets} onChange={(e) => setEntry({ ...entry, sets: e.target.value })} /><span>set</span></span></label>
    </div>
    <label className="field training-date-field"><span>記録日時</span><input required type="datetime-local" value={entry.recordedAt} onChange={(e) => setEntry({ ...entry, recordedAt: e.target.value })} /></label>
    <p className="volume-preview">総負荷量 <strong>{volume.toLocaleString('ja-JP')} kg</strong></p><button className="button button-green meal-submit" type="submit"><Plus size={18} />記録を追加</button>
  </form>;
}
