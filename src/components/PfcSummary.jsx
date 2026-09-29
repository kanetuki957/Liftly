import { formatGrams } from '../data.js';

const nutrients = [
  { key: 'protein', name: 'タンパク質', shortName: 'P', color: 'protein' },
  { key: 'fat', name: '脂質', shortName: 'F', color: 'fat' },
  { key: 'carbs', name: '炭水化物', shortName: 'C', color: 'carbs' },
];

export default function PfcSummary({ goals, totals }) {
  return (
    <section className="summary-section" aria-labelledby="summary-title">
      <div className="section-heading summary-heading">
        <div>
          <p className="eyebrow">DAILY INTAKE</p>
          <h2 id="summary-title">今日のPFC</h2>
        </div>
        <span className="unit-note">単位：g</span>
      </div>

      <div className="nutrient-list">
        {nutrients.map(({ key, name, shortName, color }) => {
          const consumed = totals[key];
          const goal = goals[key];
          const remaining = Math.max(goal - consumed, 0);
          const over = Math.max(consumed - goal, 0);
          const progress = goal > 0 ? Math.min((consumed / goal) * 100, 100) : consumed > 0 ? 100 : 0;

          return (
            <article className={`nutrient-row ${color}`} key={key}>
              <div className="nutrient-topline">
                <div className="nutrient-name-wrap">
                  <span className="nutrient-letter">{shortName}</span>
                  <h3>{name}</h3>
                </div>
                <p className="nutrient-amount">
                  <strong>{formatGrams(consumed)}</strong>
                  <span>/ {formatGrams(goal)}g</span>
                </p>
              </div>
              <div
                className="progress-track"
                role="progressbar"
                aria-label={`${name}の摂取量`}
                aria-valuemin={0}
                aria-valuemax={goal || 1}
                aria-valuenow={consumed}
              >
                <span className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <p className={`nutrient-remaining ${over > 0 ? 'is-over' : ''}`}>
                {over > 0
                  ? `目標を${formatGrams(over)}g超過`
                  : `あと${formatGrams(remaining)}g`}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}