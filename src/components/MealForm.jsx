import { useState } from 'react';
import { Plus, X } from 'lucide-react';

const emptyMeal = { name: '', protein: '0', fat: '0', carbs: '0' };
const fields = [
  { key: 'protein', label: 'P' },
  { key: 'fat', label: 'F' },
  { key: 'carbs', label: 'C' },
];

export default function MealForm({ onAdd, onCancel }) {
  const [meal, setMeal] = useState(emptyMeal);

  function handleSubmit(event) {
    event.preventDefault();
    onAdd({
      id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
      name: meal.name.trim(),
      protein: Number(meal.protein),
      fat: Number(meal.fat),
      carbs: Number(meal.carbs),
      createdAt: new Date().toISOString(),
    });
    setMeal(emptyMeal);
  }

  return (
    <form className="meal-form" onSubmit={handleSubmit}>
      <div className="form-panel-heading">
        <div>
          <p className="eyebrow">NEW ENTRY</p>
          <h3>食事を記録</h3>
        </div>
        <button className="icon-button close-form" type="button" onClick={onCancel} aria-label="入力を閉じる">
          <X size={19} />
        </button>
      </div>
      <label className="field meal-name-field">
        <span>食事名</span>
        <input
          autoFocus
          type="text"
          maxLength="60"
          placeholder="例：鶏胸肉 150g"
          required
          value={meal.name}
          onChange={(event) => setMeal({ ...meal, name: event.target.value })}
        />
      </label>
      <div className="form-grid macro-form-grid">
        {fields.map(({ key, label }) => (
          <label className="field" key={key}>
            <span>{label}</span>
            <span className="input-with-unit">
              <input
                type="number"
                min="0"
                step="0.1"
                inputMode="decimal"
                placeholder="0"
                required
                value={meal[key]}
                onChange={(event) => setMeal({ ...meal, [key]: event.target.value })}
              />
              <span>g</span>
            </span>
          </label>
        ))}
      </div>
      <button className="button button-green meal-submit" type="submit">
        <Plus size={18} /> 食事を追加
      </button>
    </form>
  );
}