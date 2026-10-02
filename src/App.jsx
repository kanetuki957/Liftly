import { useEffect, useMemo, useState } from 'react';
import { Activity, Dumbbell, Plus, Utensils } from 'lucide-react';
import GoalEditor from './components/GoalEditor.jsx';
import MealForm from './components/MealForm.jsx';
import MealList from './components/MealList.jsx';
import PfcSummary from './components/PfcSummary.jsx';
import RememberedMeals from './components/RememberedMeals.jsx';
import TrainingDashboard from './components/TrainingDashboard.jsx';
import { getTodayKey, loadData, saveData, sumMacros } from './data.js';

const todayKey = getTodayKey();
function formatToday() { return new Intl.DateTimeFormat('ja-JP', { month: 'long', day: 'numeric', weekday: 'long' }).format(new Date()); }

export default function App() {
  const [data, setData] = useState(loadData);
  const [isAddingMeal, setIsAddingMeal] = useState(false);
  const [activeTab, setActiveTab] = useState('food');
  const meals = data.days[todayKey] ?? [];
  const totals = useMemo(() => sumMacros(meals), [meals]);
  useEffect(() => { saveData(data); }, [data]);
  function updateGoals(goals) { setData((current) => ({ ...current, goals })); }
  function addMeal(meal, shouldRemember = false) {
    setData((current) => ({
      ...current,
      days: { ...current.days, [todayKey]: [...(current.days[todayKey] ?? []), meal] },
      rememberedMeals: shouldRemember && !current.rememberedMeals.some((item) => item.name === meal.name && item.protein === meal.protein && item.fat === meal.fat && item.carbs === meal.carbs)
        ? [...current.rememberedMeals, { id: globalThis.crypto?.randomUUID?.() ?? `saved-${Date.now()}-${Math.random()}`, name: meal.name, protein: meal.protein, fat: meal.fat, carbs: meal.carbs }]
        : current.rememberedMeals,
    }));
    setIsAddingMeal(false);
  }
  function addRememberedMeal(meal) { addMeal({ ...meal, id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`, createdAt: new Date().toISOString() }); }
  function deleteRememberedMeal(id) { setData((current) => ({ ...current, rememberedMeals: current.rememberedMeals.filter((meal) => meal.id !== id) })); }
  function deleteMeal(mealId) { setData((current) => ({ ...current, days: { ...current.days, [todayKey]: (current.days[todayKey] ?? []).filter((meal) => meal.id !== mealId) } })); }
  return <main className="app-shell"><header className="app-header"><a className="brand" href="#top" aria-label="Liftly ホーム"><span className="brand-mark"><Activity size={19} strokeWidth={2.5} /></span><span>LIFTLY<span className="brand-period">.</span></span></a><span className="header-date">{formatToday()}</span></header>
    <nav className="app-nav" aria-label="メインナビゲーション"><button className={activeTab === 'food' ? 'is-active' : ''} type="button" onClick={() => setActiveTab('food')}><Utensils size={17} />食事管理</button><button className={activeTab === 'training' ? 'is-active' : ''} type="button" onClick={() => setActiveTab('training')}><Dumbbell size={17} />トレーニング</button></nav>
    {activeTab === 'training' ? <TrainingDashboard /> : <div className="dashboard" id="top"><section className="welcome-row"><div><p className="eyebrow">YOUR DAILY CHECK-IN</p><h1>今日のコンディション</h1></div><span className="day-badge"><span /> TODAY</span></section><GoalEditor goals={data.goals} onSave={updateGoals} /><PfcSummary goals={data.goals} totals={totals} /><div className="section-divider" /><RememberedMeals meals={data.rememberedMeals} onAdd={addRememberedMeal} onDelete={deleteRememberedMeal} /><div className="section-divider compact-divider" /><MealList meals={meals} onDelete={deleteMeal} />{isAddingMeal ? <MealForm onAdd={addMeal} onCancel={() => setIsAddingMeal(false)} /> : <button className="button button-green add-meal-button" type="button" onClick={() => setIsAddingMeal(true)}><Plus size={18} />食事を追加</button>}<p className="local-note">食事記録はこの端末に保存されます</p></div>}
  </main>;
}
