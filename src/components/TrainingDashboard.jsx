import { useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import TrainingEntry from './TrainingEntry.jsx';
import TrainingHistory from './TrainingHistory.jsx';
import { formatNumber, getPreviousRecord, loadTrainingData, maxWeight, saveTrainingData, totalReps, totalSets, totalVolume } from '../trainingData.js';

function Comparison({ record, previous }) {
  if (!record) return null;
  const volume = totalVolume(record);
  if (!previous) return <section className="comparison-card"><p className="eyebrow">LATEST ENTRY</p><h2>{record.exercise}</h2><p>今回の総負荷量は <strong>{volume.toLocaleString('ja-JP')}kg</strong> です。同じ種目の過去記録を追加すると、ここで変化を確認できます。</p></section>;
  const previousVolume = totalVolume(previous); const volumeChange = previousVolume ? ((volume - previousVolume) / previousVolume) * 100 : 0;
  const metrics = [{ label: '最高重量', current: maxWeight(record), previous: maxWeight(previous), unit: 'kg' }, { label: '総回数', current: totalReps(record), previous: totalReps(previous), unit: '回' }, { label: 'セット数', current: totalSets(record), previous: totalSets(previous), unit: 'set' }, { label: '総負荷量', current: volume, previous: previousVolume, unit: 'kg' }];
  const facts = metrics.map((metric) => `${metric.label}は ${formatNumber(metric.previous)}${metric.unit} → ${formatNumber(metric.current)}${metric.unit}${metric.label === '総負荷量' ? `（${volumeChange >= 0 ? '+' : ''}${formatNumber(volumeChange)}%）` : ''}です。`);
  return <section className="comparison-card"><p className="eyebrow">PREVIOUS RECORD COMPARISON</p><h2>{record.exercise}の前回比較</h2><div className="comparison-values"><span>今回<br /><strong>最高 {formatNumber(maxWeight(record))}kg · {totalReps(record)}回 · {totalSets(record)}set</strong></span><span>前回<br /><strong>最高 {formatNumber(maxWeight(previous))}kg · {totalReps(previous)}回 · {totalSets(previous)}set</strong></span></div><ul>{facts.map((fact) => <li key={fact}>{fact}</li>)}</ul></section>;
}

export default function TrainingDashboard() {
  const [data, setData] = useState(loadTrainingData); const [isAdding, setIsAdding] = useState(false); const [selectedExercise, setSelectedExercise] = useState(''); const [latestId, setLatestId] = useState(null);
  useEffect(() => { saveTrainingData(data); }, [data]);
  const latest = useMemo(() => data.records.find((record) => record.id === latestId) ?? [...data.records].sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt))[0], [data.records, latestId]);
  const previous = latest ? getPreviousRecord(data.records.filter((record) => record.id !== latest.id), latest) : null;
  function addRecord(record) { setData((current) => ({ ...current, records: [...current.records, record] })); setLatestId(record.id); setSelectedExercise(record.exercise); setIsAdding(false); }
  function deleteRecord(id) { setData((current) => ({ ...current, records: current.records.filter((record) => record.id !== id) })); if (latestId === id) setLatestId(null); }
  return <div className="dashboard"><section className="welcome-row"><div><p className="eyebrow">TRAINING CHECK-IN</p><h1>トレーニングの振り返り</h1></div><span className="day-badge"><span /> LOG</span></section><p className="training-intro">記録された重量・回数・総負荷量の変化を確認できます。</p><Comparison record={latest} previous={previous} />{isAdding ? <TrainingEntry onAdd={addRecord} onCancel={() => setIsAdding(false)} /> : <button className="button button-green add-meal-button" type="button" onClick={() => setIsAdding(true)}><Plus size={18} />トレーニングを記録</button>}<div className="section-divider" /><TrainingHistory records={data.records} selectedExercise={selectedExercise} onSelectExercise={setSelectedExercise} onDelete={deleteRecord} /><p className="local-note">トレーニング記録はこの端末に保存されます</p></div>;
}
