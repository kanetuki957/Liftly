import { useMemo, useState } from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import TrainingRecordDetail from './TrainingRecordDetail.jsx';
import { formatDateTime, formatNumber, maxWeight, totalReps, totalSets, totalVolume } from '../trainingData.js';

function recordSummary(record) {
  return `最高 ${formatNumber(maxWeight(record))}kg · ${totalReps(record)}回 · ${totalSets(record)}set`;
}

function Comparison({ exercise, current, previous, onBack }) {
  const [detailRecord, setDetailRecord] = useState(null);
  const currentVolume = totalVolume(current);
  if (!previous) return <section className="comparison-card review-comparison"><button className="back-button" type="button" onClick={onBack}><ArrowLeft size={16} />種目一覧へ戻る</button><p className="eyebrow">PREVIOUS RECORD COMPARISON</p><h2>{exercise}の前回比較</h2><p className="no-previous-message">比較できる前回記録がまだありません。次回同じ種目を記録すると、ここで変化を確認できます。</p><button className="detail-link-button" type="button" onClick={() => setDetailRecord(current)}>今回の内容を確認</button><TrainingRecordDetail record={detailRecord} onClose={() => setDetailRecord(null)} /></section>;
  if (current.sideMode || previous.sideMode || current.assisted || previous.assisted) return <section className="comparison-card review-comparison"><button className="back-button" type="button" onClick={onBack}><ArrowLeft size={16} />種目一覧へ戻る</button><p className="eyebrow">PREVIOUS RECORD COMPARISON</p><h2>{exercise}の前回比較</h2><p className="no-previous-message">左右別または補助ありの記録です。重量の意味を混同しないよう、自動評価は行わず実際の記録内容を並べて確認できます。</p><div className="comparison-detail-actions"><button className="detail-link-button" type="button" onClick={() => setDetailRecord(current)}>今回の内容</button><button className="detail-link-button" type="button" onClick={() => setDetailRecord(previous)}>前回の内容</button></div><TrainingRecordDetail record={detailRecord} onClose={() => setDetailRecord(null)} /></section>;
  const previousVolume = totalVolume(previous);
  const volumeChange = previousVolume ? ((currentVolume - previousVolume) / previousVolume) * 100 : 0;
  const metrics = [{ label: '最高重量', current: maxWeight(current), previous: maxWeight(previous), unit: 'kg' }, { label: '総回数', current: totalReps(current), previous: totalReps(previous), unit: '回' }, { label: 'セット数', current: totalSets(current), previous: totalSets(previous), unit: 'set' }, { label: '総負荷量', current: currentVolume, previous: previousVolume, unit: 'kg' }];
  return <section className="comparison-card review-comparison"><button className="back-button" type="button" onClick={onBack}><ArrowLeft size={16} />種目一覧へ戻る</button><p className="eyebrow">PREVIOUS RECORD COMPARISON</p><h2>{exercise}の前回比較</h2><div className="comparison-values"><span>今回<br /><strong>{recordSummary(current)}<br />{currentVolume.toLocaleString('ja-JP')}kg</strong></span><span>前回<br /><strong>{recordSummary(previous)}<br />{previousVolume.toLocaleString('ja-JP')}kg</strong></span></div><ul>{metrics.map((metric) => <li key={metric.label}>{metric.label}は {formatNumber(metric.previous)}{metric.unit} → {formatNumber(metric.current)}{metric.unit}{metric.label === '総負荷量' ? `（${volumeChange >= 0 ? '+' : ''}${formatNumber(volumeChange)}%）` : ''}です。</li>)}</ul><div className="comparison-detail-actions"><button className="detail-link-button" type="button" onClick={() => setDetailRecord(current)}>今回の内容</button><button className="detail-link-button" type="button" onClick={() => setDetailRecord(previous)}>前回の内容</button></div><TrainingRecordDetail record={detailRecord} onClose={() => setDetailRecord(null)} /></section>;
}

export default function TrainingReview({ records }) {
  const [selectedExercise, setSelectedExercise] = useState(null);
  const exercises = useMemo(() => Object.values(records.reduce((grouped, record) => {
    const current = grouped[record.exercise];
    if (!current || new Date(record.recordedAt) > new Date(current.recordedAt)) grouped[record.exercise] = record;
    return grouped;
  }, {})).sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt)), [records]);
  const selectedRecords = selectedExercise ? records.filter((record) => record.exercise === selectedExercise).sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt)) : [];
  if (selectedExercise && selectedRecords[0]) return <Comparison exercise={selectedExercise} current={selectedRecords[0]} previous={selectedRecords[1]} onBack={() => setSelectedExercise(null)} />;
  return <section className="exercise-review" aria-labelledby="exercise-review-title"><div className="section-heading meals-heading"><div><p className="eyebrow">EXERCISE REVIEW</p><h2 id="exercise-review-title">種目ごとの前回比較</h2></div><span className="meal-count">{exercises.length} 種目</span></div>{exercises.length === 0 ? <div className="empty-state"><p>トレーニングを記録すると、種目ごとの前回比較を確認できます。</p></div> : <ul className="exercise-review-list">{exercises.map((record) => <li key={record.exercise}><button type="button" onClick={() => setSelectedExercise(record.exercise)}><span><strong>{record.exercise}</strong><small>最終記録 {formatDateTime(record.recordedAt)}</small></span><ChevronRight size={19} /></button></li>)}</ul>}</section>;
}
