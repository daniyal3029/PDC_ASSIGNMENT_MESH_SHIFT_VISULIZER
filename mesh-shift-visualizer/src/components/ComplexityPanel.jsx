import { useMemo } from 'react';
import {
  getSqrt,
  getRowShift,
  getColShift,
  ringSteps,
  meshSteps,
  generateComparisonTable,
} from '../utils/shiftLogic';
import './ComplexityPanel.css';

export default function ComplexityPanel({ p, q }) {
  const sqrtP = getSqrt(p);
  const rowShift = getRowShift(q, p);
  const colShift = getColShift(q, p);
  const ring = ringSteps(q, p);
  const mesh = meshSteps(q, p);
  const maxVal = Math.max(ring, mesh, 1);
  const savings = ring > 0 ? Math.round((1 - mesh / ring) * 100) : 0;

  const tableData = useMemo(
    () => generateComparisonTable([16, 64], [3, 5, 7]),
    []
  );

  return (
    <div className="complexity-panel">
      <div className="panel-header">
        <span className="panel-icon">📈</span>
        <h2>Complexity Analysis</h2>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Row Shift</span>
          <span className="stat-value accent-blue">{rowShift}</span>
          <span className="stat-formula">q mod √p = {q} mod {sqrtP}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Col Shift</span>
          <span className="stat-value accent-purple">{colShift}</span>
          <span className="stat-formula">⌊q / √p⌋ = ⌊{q} / {sqrtP}⌋</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Steps</span>
          <span className="stat-value accent-green">{mesh}</span>
          <span className="stat-formula">{rowShift} + {colShift}</span>
        </div>
      </div>

      {/* Formulas */}
      <div className="cx-section">
        <h3>📐 Formulas</h3>
        <div className="formula-card">
          <div className="formula-row">
            <span className="formula-name">Ring Steps</span>
            <span className="formula-expr">
              min(q, p − q) = min({q}, {p - q}) = <strong>{ring}</strong>
            </span>
          </div>
          <div className="formula-row">
            <span className="formula-name">Mesh Steps</span>
            <span className="formula-expr">
              (q mod √p) + ⌊q/√p⌋ = {rowShift} + {colShift} = <strong>{mesh}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Bar chart */}
      <div className="cx-section">
        <h3>📊 Mesh vs Ring Comparison</h3>
        <div className="bar-chart">
          <div className="bar-row">
            <span className="bar-label">Ring</span>
            <div className="bar-track">
              <div
                className="bar bar-ring"
                style={{ width: `${(ring / maxVal) * 100}%` }}
              >
                <span className="bar-value">{ring} steps</span>
              </div>
            </div>
          </div>
          <div className="bar-row">
            <span className="bar-label">Mesh</span>
            <div className="bar-track">
              <div
                className="bar bar-mesh"
                style={{ width: `${(mesh / maxVal) * 100}%` }}
              >
                <span className="bar-value">{mesh} steps</span>
              </div>
            </div>
          </div>
        </div>

        {mesh < ring ? (
          <div className="efficiency-badge">
            <span className="badge-icon">⚡</span>
            <span>
              Mesh is <strong>{savings}%</strong> more efficient ({ring - mesh} fewer steps)
            </span>
          </div>
        ) : mesh === ring ? (
          <div className="efficiency-badge neutral">
            <span className="badge-icon">⚖️</span>
            <span>Mesh and Ring have <strong>equal</strong> steps</span>
          </div>
        ) : (
          <div className="efficiency-badge warning">
            <span className="badge-icon">⚠️</span>
            <span>Ring is more efficient for this configuration</span>
          </div>
        )}
      </div>

      {/* Why mesh is better */}
      <div className="cx-section">
        <h3>💡 Why Mesh is More Efficient</h3>
        <div className="explanation-card">
          <p>
            A <strong>ring topology</strong> has only one circular path. Data
            must travel sequentially, requiring <code>min(q, p−q)</code> hops.
          </p>
          <p>
            A <strong>2D mesh</strong> decomposes the shift into two independent
            stages (row + column), exploiting parallelism within each ring. The
            total hops become <code>(q mod √p) + ⌊q/√p⌋</code>, which grows as{' '}
            <strong>O(√p)</strong> vs the ring&apos;s <strong>O(p)</strong>.
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="cx-section">
        <h3>📋 Comparison Table</h3>
        <div className="table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>p</th>
                <th>q</th>
                <th>Row</th>
                <th>Col</th>
                <th>Mesh</th>
                <th>Ring</th>
                <th>Savings</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row) => {
                const sav =
                  row.ring > 0
                    ? Math.round((1 - row.mesh / row.ring) * 100)
                    : 0;
                const hl = row.p === p && row.q === q;
                return (
                  <tr key={`${row.p}-${row.q}`} className={hl ? 'highlight-row' : ''}>
                    <td>{row.p}</td>
                    <td>{row.q}</td>
                    <td>{row.rowShift}</td>
                    <td>{row.colShift}</td>
                    <td className="mesh-val">{row.mesh}</td>
                    <td className="ring-val">{row.ring}</td>
                    <td>
                      <span className="savings-badge">{sav}%</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
