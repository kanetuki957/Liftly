import { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';

function localDateTimeNow() { const now = new Date(); now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); return now.toISOString().slice(0, 16); }
const blankEntry = () => ({ id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`, weight: '', reps: '', sets: '' });
const initialEntry = () => ({ exercise: '', entries: [blankEntry()], recordedAt: localDateTimeNow() });

export default function TrainingEntry({ onAdd, onCancel }) {
  const [entry, setEntry] = useState(initialEntry);
  const volume = entry.entries.reduce((sum, item) => sum + Number(item.weight || 0) * Number(item.reps || 0) * Number(item.sets || 0), 0);
  const totalSets = entry.entries.reduce((sum, item) => sum + Number(item.sets || 0), 0);
  function updateEntry(id, key, value) { setEntry({ ...entry, entries: entry.entries.map((item) => item.id === id ? { ...item, [key]: value } : item) }); }
  function submit(event) { event.preventDefault(); onAdd({ id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`, exercise: entry.exercise.trim(), entries: entry.entries.map(({ weight, reps, sets }) => ({ weight: Number(weight), reps: Number(reps), sets: Number(sets) })), recordedAt: new Date(entry.recordedAt).toISOString(), createdAt: new Date().toISOString() }); }
  return <form className="meal-form training-form" onSubmit={submit}>
    <div className="form-panel-heading"><div><p className="eyebrow">NEW TRAINING LOG</p><h3>トレーニングを記録</h3></div><button className="icon-button close-form" type="button" onClick={onCancel} aria-label="入力を閉じる"><X size={19} /></button></div>
    <label className="field meal-name-field"><span>種目名</span><input autoFocus required maxLength="60" placeholder="例：ベンチプレス" value={entry.exercise} onChange={(e) => setEntry({ ...entry, exercise: e.target.value })} /></label>
    <div className="entry-headings"><span aria-hidden="true" /><span>重量</span><span>回数</span><span>セット数</span><span aria-hidden="true" /></div>
    <div className="set-inputs">{entry.entries.map((item, index) => <div className="set-input-row entry-input-row" key={item.id}><span className="set-label">{index + 1}</span><label className="field"><span className="sr-only">重量</span><span className="input-with-unit"><input required min="0" step="0.5" inputMode="decimal" type="number" placeholder="0" value={item.weight} onChange={(e) => updateEntry(item.id, 'weight', e.target.value)} /><span>kg</span></span></label><label className="field"><span className="sr-only">回数</span><span className="input-with-unit"><input required min="1" step="1" inputMode="numeric" type="number" placeholder="0" value={item.reps} onChange={(e) => updateEntry(item.id, 'reps', e.target.value)} /><span>回</span></span></label><label className="field"><span className="sr-only">セット数</span><span className="input-with-unit"><input required min="1" step="1" inputMode="numeric" type="number" placeholder="0" value={item.sets} onChange={(e) => updateEntry(item.id, 'sets', e.target.value)} /><span>set</span></span></label>{entry.entries.length > 1 && <button className="icon-button delete-meal set-delete" type="button" onClick={() => setEntry({ ...entry, entries: entry.entries.filter((row) => row.id !== item.id) })} aria-label={`入力行${index + 1}を削除`}><Trash2 size={16} /></button>}</div>)}</div>
    <button className="add-set-button" type="button" onClick={() => setEntry({ ...entry, entries: [...entry.entries, blankEntry()] })}><Plus size={16} />重量・回数・セットを追加</button>
    <label className="field training-date-field"><span>記録日時</span><input required type="datetime-local" value={entry.recordedAt} onChange={(e) => setEntry({ ...entry, recordedAt: e.target.value })} /></label>
    <p className="volume-preview">総負荷量 <strong>{volume.toLocaleString('ja-JP')} kg</strong><small>（合計 {totalSets}セット）</small></p><button className="button button-green meal-submit" type="submit"><Plus size={18} />記録を追加</button>
  </form>;
}
