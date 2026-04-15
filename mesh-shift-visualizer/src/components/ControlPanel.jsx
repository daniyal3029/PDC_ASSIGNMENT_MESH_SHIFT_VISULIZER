import { useState, useCallback } from 'react';
import { getSqrt, getRowShift, getColShift } from '../utils/shiftLogic';
import './ControlPanel.css';

const PERFECT_SQUARES = [4, 9, 16, 25, 36, 49, 64];

export default function ControlPanel({ onUpdate, onAnimate, onReset, animating }) {
  const [p, setP] = useState(16);
  const [q, setQ] = useState(5);

  const sqrtP = getSqrt(p);
  const rowShift = getRowShift(q, p);
  const colShift = getColShift(q, p);

  const handlePChange = useCallback((e) => {
    const newP = parseInt(e.target.value);
    setP(newP);
    const newQ = Math.min(q, newP - 1);
    setQ(newQ);
    onUpdate(newP, newQ);
  }, [q, onUpdate]);

  const handleQSlider = useCallback((e) => {
    const newQ = parseInt(e.target.value);
    setQ(newQ);
    onUpdate(p, newQ);
  }, [p, onUpdate]);

  const handleQInput = useCallback((e) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val >= 1 && val <= p - 1) {
      setQ(val);
      onUpdate(p, val);
    }
  }, [p, onUpdate]);

  return (
    <div className="control-panel">
      <div className="panel-header">
        <span className="panel-icon">⚙️</span>
        <h2>Configuration</h2>
      </div>

      {/* P selector */}
      <div className="control-group">
        <label htmlFor="input-p">
          <span className="label-text">Number of Processors (p)</span>
          <span className="label-hint">Perfect square: 4 – 64</span>
        </label>
        <select id="input-p" value={p} onChange={handlePChange}>
          {PERFECT_SQUARES.map((v) => (
            <option key={v} value={v}>
              {v}  ({getSqrt(v)}×{getSqrt(v)})
            </option>
          ))}
        </select>
      </div>

      {/* Q selector */}
      <div className="control-group">
        <label htmlFor="input-q">
          <span className="label-text">Shift Amount (q)</span>
          <span className="label-hint">Range: 1 to {p - 1}</span>
        </label>
        <input
          id="input-q-range"
          type="range"
          min={1}
          max={p - 1}
          value={q}
          onChange={handleQSlider}
        />
        <div className="range-value-row">
          <input
            id="input-q"
            type="number"
            min={1}
            max={p - 1}
            value={q}
            onChange={handleQInput}
          />
          <span className="range-label">/ {p - 1}</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="control-actions">
        <button
          id="btn-animate"
          className="btn btn-primary"
          onClick={() => onAnimate(p, q)}
          disabled={animating}
        >
          {animating ? '⏳ Animating…' : '▶  Run Animation'}
        </button>
        <button
          id="btn-reset"
          className="btn btn-secondary"
          onClick={() => onReset(p, q)}
          disabled={animating}
        >
          ↺  Reset
        </button>
      </div>

      {/* Shift info card */}
      <div className="shift-info-card">
        <div className="info-row">
          <span className="info-label">√p</span>
          <span className="info-value">{sqrtP}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Row Shift (q mod √p)</span>
          <span className="info-value">{rowShift}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Col Shift (⌊q/√p⌋)</span>
          <span className="info-value">{colShift}</span>
        </div>
      </div>
    </div>
  );
}
