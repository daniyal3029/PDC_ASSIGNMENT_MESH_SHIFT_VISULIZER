import { useRef, useEffect, useCallback, useMemo } from 'react';
import {
  getSqrt,
  computeFullShift,
  getRowShiftArrows,
  getColShiftArrows,
  getRowShift,
  getColShift,
} from '../utils/shiftLogic';
import './MeshGrid.css';

const STAGE_INFO = {
  initial:   { label: 'Initial State',            icon: '🔵', cls: '' },
  rowShift:  { label: 'Stage 1 — Row Shift',      icon: '➡️', cls: 'row-shift' },
  afterRow:  { label: 'After Row Shift',           icon: '✅', cls: 'after-row' },
  colShift:  { label: 'Stage 2 — Column Shift',   icon: '⬇️', cls: 'col-shift' },
  final:     { label: 'Final State',               icon: '🎯', cls: 'final' },
};

const ARROW_COLORS = [
  '#6366f1', '#f43f5e', '#10b981', '#f59e0b',
  '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6',
];

export default function MeshGrid({ p, q, stage }) {
  const svgRef = useRef(null);
  const gridRef = useRef(null);
  const wrapperRef = useRef(null);

  const sqrtP = getSqrt(p);
  const states = useMemo(() => computeFullShift(p, q), [p, q]);

  const currentNodes = useMemo(() => {
    switch (stage) {
      case 'rowShift':  return states.initial;
      case 'afterRow':  return states.afterRowShift;
      case 'colShift':  return states.afterRowShift;
      case 'final':     return states.final;
      default:          return states.initial;
    }
  }, [stage, states]);

  const stageInfo = STAGE_INFO[stage] || STAGE_INFO.initial;
  const subText = useMemo(() => {
    switch (stage) {
      case 'initial':   return 'Each node holds its own index as data';
      case 'rowShift':  return `Shifting right by ${getRowShift(q, p)} within each row`;
      case 'afterRow':  return 'Row shift complete — preparing column shift';
      case 'colShift':  return `Shifting down by ${getColShift(q, p)} within each column`;
      case 'final':     return `Circular ${q}-shift complete!`;
      default:          return '';
    }
  }, [stage, p, q]);

  // Draw arrows
  const drawArrows = useCallback(() => {
    const svg = svgRef.current;
    const grid = gridRef.current;
    const wrapper = wrapperRef.current;
    if (!svg || !grid || !wrapper) return;
    if (stage !== 'rowShift' && stage !== 'colShift') {
      svg.innerHTML = '';
      return;
    }

    const wrapperRect = wrapper.getBoundingClientRect();
    svg.setAttribute('width', wrapperRect.width);
    svg.setAttribute('height', wrapperRect.height);

    const arrows = stage === 'rowShift'
      ? getRowShiftArrows(p, q)
      : getColShiftArrows(p, q);

    let svgContent = `<defs>`;
    ARROW_COLORS.forEach((c, i) => {
      svgContent += `<marker id="ah-${i}" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="${c}"/></marker>`;
    });
    svgContent += `</defs>`;

    arrows.forEach((a) => {
      const from = grid.querySelector(`[data-idx="${a.fromIndex}"]`);
      const to = grid.querySelector(`[data-idx="${a.toIndex}"]`);
      if (!from || !to) return;

      const fr = from.getBoundingClientRect();
      const tr = to.getBoundingClientRect();
      const ox = wrapperRect.left;
      const oy = wrapperRect.top;

      const x1 = fr.left + fr.width / 2 - ox;
      const y1 = fr.top + fr.height / 2 - oy;
      const x2 = tr.left + tr.width / 2 - ox;
      const y2 = tr.top + tr.height / 2 - oy;

      const colorIdx =
        (stage === 'rowShift' ? a.row : a.col) % ARROW_COLORS.length;

      const isWrap = stage === 'rowShift'
        ? a.toCol < a.fromCol
        : a.toRow < a.fromRow;

      if (isWrap) {
        const mx = (x1 + x2) / 2;
        const my = (y1 + y2) / 2;
        const cpx = stage === 'rowShift' ? mx : x1 + 40;
        const cpy = stage === 'rowShift' ? y1 - 35 : my;
        svgContent += `<path d="M${x1},${y1} Q${cpx},${cpy} ${x2},${y2}" fill="none" stroke="${ARROW_COLORS[colorIdx]}" stroke-width="2" stroke-dasharray="6,3" marker-end="url(#ah-${colorIdx})" class="arrow-path arrow-wrap"/>`;
      } else {
        svgContent += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${ARROW_COLORS[colorIdx]}" stroke-width="2" marker-end="url(#ah-${colorIdx})" class="arrow-path"/>`;
      }
    });

    svg.innerHTML = svgContent;
  }, [stage, p, q]);

  useEffect(() => {
    const id = requestAnimationFrame(drawArrows);
    return () => cancelAnimationFrame(id);
  }, [drawArrows]);

  // Resize handler
  useEffect(() => {
    const handler = () => requestAnimationFrame(drawArrows);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [drawArrows]);

  const isLarge = sqrtP > 5;

  return (
    <div className="mesh-grid-wrapper" ref={wrapperRef}>
      {/* Stage indicator */}
      <div className={`stage-indicator ${stageInfo.cls}`}>
        <span className="stage-icon">{stageInfo.icon}</span>
        <div className="stage-text">
          <h3>{stageInfo.label}</h3>
          <p>{subText}</p>
        </div>
      </div>

      {/* Grid */}
      <div
        className="mesh-grid"
        ref={gridRef}
        style={{
          gridTemplateColumns: `repeat(${sqrtP}, 1fr)`,
          gridTemplateRows: `repeat(${sqrtP}, 1fr)`,
        }}
      >
        {currentNodes.map((node) => (
          <div
            key={node.index}
            className={`cell${isLarge ? ' cell-sm' : ''}`}
            data-idx={node.index}
          >
            <span className="cell-index">P{node.index}</span>
            <span className={`cell-data${node.data !== node.index ? ' data-changed' : ''}`}>
              {node.data}
            </span>
          </div>
        ))}
      </div>

      {/* SVG arrow overlay */}
      <svg className="arrow-overlay" ref={svgRef} />

      {/* Before/After comparison on final stage */}
      {stage === 'final' && (
        <div className="comparison-section">
          <h3 className="comparison-title">📊 Before / After Comparison</h3>
          <div className="comparison-grids">
            <div className="comparison-grid-wrap">
              <h4>Initial State</h4>
              <div className="mini-grid" style={{ gridTemplateColumns: `repeat(${sqrtP}, 1fr)` }}>
                {states.initial.map((n) => (
                  <div key={n.index} className={`cell cell-mini${isLarge ? ' cell-sm' : ''}`}>
                    <span className="cell-data">{n.data}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="comparison-arrow-icon">→</div>

            <div className="comparison-grid-wrap">
              <h4>After Row Shift</h4>
              <div className="mini-grid" style={{ gridTemplateColumns: `repeat(${sqrtP}, 1fr)` }}>
                {states.afterRowShift.map((n) => (
                  <div key={n.index} className={`cell cell-mini${isLarge ? ' cell-sm' : ''}`}>
                    <span className={`cell-data${n.data !== n.index ? ' data-changed' : ''}`}>{n.data}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="comparison-arrow-icon">→</div>

            <div className="comparison-grid-wrap">
              <h4>Final State (q={q})</h4>
              <div className="mini-grid" style={{ gridTemplateColumns: `repeat(${sqrtP}, 1fr)` }}>
                {states.final.map((n) => (
                  <div key={n.index} className={`cell cell-mini${isLarge ? ' cell-sm' : ''}`}>
                    <span className={`cell-data${n.data !== n.index ? ' data-changed' : ''}`}>{n.data}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
