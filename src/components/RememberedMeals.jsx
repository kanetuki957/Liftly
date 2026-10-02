import { Bookmark, Plus, Trash2 } from 'lucide-react';
import { formatGrams } from '../data.js';

export default function RememberedMeals({ meals, onAdd, onDelete }) {
  return <section className="remembered-section" aria-labelledby="remembered-title">
    <div className="section-heading meals-heading"><div><p className="eyebrow">SAVED FOODS</p><h2 id="remembered-title">記憶した食事</h2></div><span className="meal-count">{meals.length} 件</span></div>
    {meals.length === 0 ? <div className="empty-state"><span className="empty-icon"><Bookmark size={21} /></span><p>食事登録時に「この食事を記憶する」を選ぶと、ここからすぐ追加できます。</p></div> : <ul className="meal-list remembered-list">{meals.map((meal) => <li className="meal-item" key={meal.id}><button className="remembered-add" type="button" onClick={() => onAdd(meal)} aria-label={`${meal.name}を今日の食事に追加`}><span className="meal-item-main"><h3>{meal.name}</h3><p className="meal-macros"><span><b>P</b> {formatGrams(meal.protein)}g</span><span><b>F</b> {formatGrams(meal.fat)}g</span><span><b>C</b> {formatGrams(meal.carbs)}g</span></p></span><Plus size={18} /></button><button className="icon-button delete-meal" type="button" onClick={() => onDelete(meal.id)} aria-label={`${meal.name}を記憶した食事から削除`} title="記憶した食事を削除"><Trash2 size={17} /></button></li>)}</ul>}
  </section>;
}
