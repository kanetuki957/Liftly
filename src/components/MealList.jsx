import { ClipboardList, Trash2 } from 'lucide-react';
import { formatGrams } from '../data.js';

export default function MealList({ meals, onDelete }) {
  return (
    <section className="meals-section" aria-labelledby="meals-title">
      <div className="section-heading meals-heading">
        <div>
          <p className="eyebrow">TODAY'S MEALS</p>
          <h2 id="meals-title">今日食べたもの</h2>
        </div>
        <span className="meal-count">{meals.length} 件</span>
      </div>

      {meals.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon"><ClipboardList size={22} /></span>
          <p>食事を記録して、今日のPFCを見てみましょう。</p>
        </div>
      ) : (
        <ul className="meal-list">
          {meals.map((meal) => (
            <li className="meal-item" key={meal.id}>
              <div className="meal-item-main">
                <h3>{meal.name}</h3>
                <p className="meal-macros">
                  <span><b>P</b> {formatGrams(meal.protein)}</span>
                  <span><b>F</b> {formatGrams(meal.fat)}</span>
                  <span><b>C</b> {formatGrams(meal.carbs)}</span>
                  <small>g</small>
                </p>
              </div>
              <button
                className="icon-button delete-meal"
                type="button"
                onClick={() => onDelete(meal.id)}
                aria-label={`${meal.name}を削除`}
                title="食事を削除"
              >
                <Trash2 size={17} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}