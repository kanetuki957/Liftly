import { useState } from 'react';
import { Check, ChevronDown, Target } from 'lucide-react';
import { formatGrams } from '../data.js';

const fields = [
  { key: 'protein', label: 'タンパク質', short: 'P' },
  { key: 'fat', label: '脂質', short: 'F' },
  { key: 'carbs', label: '炭水化物', short: 'C' },
];

export default function GoalEditor({ goals, onSave }) {
  const [values, setValues] = useState(goals);
  const [isOpen, setIsOpen] = useState(false);

  function handleOpen() {
    setValues(goals);
    setIsOpen((open) => !open);
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSave(Object.fromEntries(fields.map(({ key }) => [key, Number(values[key])])));
    setIsOpen(false);
  }

  return (
    <section className={`goal-editor ${isOpen ? 'is-open' : ''}`}>
      <button
        className="goal-toggle"
        type="button"
        onClick={handleOpen}
        aria-expanded={isOpen}
        aria-controls="goal-form"
      >
        <span className="goal-toggle-label"><Target size={17} /> 目標を編集</span>
        <span className="goal-toggle-current">
          P {formatGrams(goals.protein)} · F {formatGrams(goals.fat)} · C {formatGrams(goals.carbs)}g
        </span>
        <ChevronDown className="goal-chevron" size={17} />
      </button>
      {isOpen && (
        <form className="goal-form" id="goal-form" onSubmit={handleSubmit}>
          <div className="form-grid goal-form-grid">
            {fields.map(({ key, label, short }) => (
              <label className="field" key={key}>
                <span>{short} <span className="field-description">{label}</span></span>
                <span className="input-with-unit">
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    inputMode="decimal"
                    required
                    value={values[key]}
                    onChange={(event) => setValues({ ...values, [key]: event.target.value })}
                  />
                  <span>g</span>
                </span>
              </label>
            ))}
          </div>
          <button className="button button-dark goal-save" type="submit">
            <Check size={17} /> 目標を保存
          </button>
        </form>
      )}
    </section>
  );
}