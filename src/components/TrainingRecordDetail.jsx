import { X } from 'lucide-react';
import { entryLoad, formatDateTime, formatEntry, formatNumber, maxWeight, sideVolumes, totalReps, totalSets, totalVolume } from '../trainingData.js';

export default function TrainingRecordDetail({ record, onClose }) {
  if (!record) return null;
  const entries = Array.isArray(record.entries) ? record.entries : [];
  const sides = sideVolumes(record);
  return <div className="record-detail-backdrop" role="presentation" onMouseDown={onClose}>
    <section className="record-detail" role="dialog" aria-modal="true" aria-labelledby="record-detail-title" onMouseDown={(event) => event.stopPropagation()}>
      <div className="form-panel-heading"><div><p className="eyebrow">TRAINING DETAIL</p><h2 id="record-detail-title">{record.exercise}</h2><p className="detail-date">{formatDateTime(record.recordedAt)}</p></div><button className="icon-button close-form" type="button" onClick={onClose} aria-label="詳細を閉じる"><X size={20} /></button></div>
      <section className="detail-entries" aria-labelledby="detail-entries-title"><h3 id="detail-entries-title">トレーニング内容</h3>{entries.length > 0 ? <ul>{entries.map((entry, index) => <li key={`${entry.weight}-${entry.assistanceWeight}-${entry.reps}-${entry.sets}-${index}`}><span>{entry.side && entry.side !== 'both' && <b className="entry-side">{entry.side === 'right' ? '右　' : '左　'}</b>}{formatEntry(entry)}</span><small>{(entryLoad(entry) * entry.reps * entry.sets).toLocaleString('ja-JP')}kg</small></li>)}</ul> : <p className="detail-empty">この記録には、行ごとの詳細データが保存されていません。</p>}{record.memo && <p className="training-memo-display"><b>メモ</b>{record.memo}</p>}</section>
      {sides && <div className="side-volume-summary"><span>右の{record.assisted ? '補助負荷量' : '総負荷量'} <strong>{sides.right.toLocaleString('ja-JP')}kg</strong></span><span>左の{record.assisted ? '補助負荷量' : '総負荷量'} <strong>{sides.left.toLocaleString('ja-JP')}kg</strong></span><small>左右合計 {sides.total.toLocaleString('ja-JP')}kg</small></div>}<dl className="detail-totals"><div><dt>総セット数</dt><dd>{totalSets(record)}set</dd></div><div><dt>総回数</dt><dd>{totalReps(record)}回</dd></div><div><dt>{record.assisted ? '補助重量（最大）' : '最高重量'}</dt><dd>{formatNumber(record.assisted ? Math.max(0, ...entries.map((entry) => entry.assistanceWeight ?? 0)) : maxWeight(record))}kg</dd></div><div><dt>{record.sideMode ? '左右合計' : record.assisted ? '補助負荷量' : '総負荷量'}</dt><dd>{totalVolume(record).toLocaleString('ja-JP')}kg</dd></div></dl>
    </section>
  </div>;
}
