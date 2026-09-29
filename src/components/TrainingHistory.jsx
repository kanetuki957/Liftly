import { Dumbbell, Trash2 } from 'lucide-react';
import { formatDateTime, formatNumber, totalVolume } from '../trainingData.js';

export default function TrainingHistory({ records, selectedExercise, onSelectExercise, onDelete }) {
  const exercises = [...new Set(records.map((record) => record.exercise))].sort((a, b) => a.localeCompare(b, 'ja'));
  const visibleRecords = records.filter((record) => !selectedExercise || record.exercise === selectedExercise).sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt));
  return <section className="training-history" aria-labelledby="history-title"><div className="section-heading meals-heading"><div><p className="eyebrow">TRAINING HISTORY</p><h2 id="history-title">過去の記録</h2></div><span className="meal-count">{visibleRecords.length} 件</span></div>
    {exercises.length > 0 && <label className="history-filter">種目を絞り込む<select value={selectedExercise} onChange={(e) => onSelectExercise(e.target.value)}><option value="">すべての種目</option>{exercises.map((exercise) => <option key={exercise} value={exercise}>{exercise}</option>)}</select></label>}
    {visibleRecords.length === 0 ? <div className="empty-state"><span className="empty-icon"><Dumbbell size={21} /></span><p>トレーニングを記録すると、種目ごとにここで振り返れます。</p></div> : <ul className="meal-list training-list">{visibleRecords.map((record) => <li className="meal-item" key={record.id}><div className="meal-item-main"><h3>{record.exercise}</h3><p className="training-details">{formatDateTime(record.recordedAt)}　{formatNumber(record.weight)}kg × {formatNumber(record.reps)}回 × {formatNumber(record.sets)}set</p><p className="training-volume">総負荷量 {totalVolume(record).toLocaleString('ja-JP')}kg</p></div><button className="icon-button delete-meal" type="button" onClick={() => onDelete(record.id)} aria-label={`${record.exercise}の記録を削除`}><Trash2 size={17} /></button></li>)}</ul>}
  </section>;
}
