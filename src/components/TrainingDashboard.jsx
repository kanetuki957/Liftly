import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import TrainingEntry from './TrainingEntry.jsx';
import TrainingHistory from './TrainingHistory.jsx';
import TrainingReview from './TrainingReview.jsx';
import { loadTrainingData, saveTrainingData } from '../trainingData.js';

export default function TrainingDashboard() {
  const [data, setData] = useState(loadTrainingData);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState('');
  useEffect(() => { saveTrainingData(data); }, [data]);
  function addRecord(record) { setData((current) => ({ ...current, records: [...current.records, record] })); setSelectedExercise(record.exercise); setIsAdding(false); }
  function deleteRecord(id) { setData((current) => ({ ...current, records: current.records.filter((record) => record.id !== id) })); }
  return <div className="dashboard"><section className="welcome-row"><div><p className="eyebrow">TRAINING CHECK-IN</p><h1>トレーニングの振り返り</h1></div><span className="day-badge"><span /> LOG</span></section><p className="training-intro">種目ごとの記録と、前回からの数値の変化を確認できます。</p><TrainingReview records={data.records} />{isAdding ? <TrainingEntry onAdd={addRecord} onCancel={() => setIsAdding(false)} /> : <button className="button button-green add-meal-button" type="button" onClick={() => setIsAdding(true)}><Plus size={18} />トレーニングを記録</button>}<div className="section-divider" /><TrainingHistory records={data.records} selectedExercise={selectedExercise} onSelectExercise={setSelectedExercise} onDelete={deleteRecord} /><p className="local-note">トレーニング記録はこの端末に保存されます</p></div>;
}
