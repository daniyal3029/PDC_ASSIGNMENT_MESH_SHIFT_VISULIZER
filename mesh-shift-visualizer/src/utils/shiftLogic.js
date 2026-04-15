/**
 * shiftLogic.js — Pure circular shift algorithm on 2D mesh topology (testable)
 *
 * Circular q-shift: node i sends data to node (i + q) mod p
 * On a 2D mesh (√p × √p):
 *   Stage 1 — Row Shift:    shift within row by (q mod √p) positions
 *   Stage 2 — Column Shift: shift within column by ⌊q / √p⌋ positions
 */

export function isPerfectSquare(n) {
  if (n < 1) return false;
  const root = Math.round(Math.sqrt(n));
  return root * root === n;
}

export function getSqrt(p) {
  return Math.round(Math.sqrt(p));
}

/** Row shift amount: q mod √p */
export function getRowShift(q, p) {
  return q % getSqrt(p);
}

/** Column shift amount: ⌊q / √p⌋ */
export function getColShift(q, p) {
  return Math.floor(q / getSqrt(p));
}

/**
 * Generate initial mesh state.
 * Returns array of p objects: { index, row, col, data }
 * Initially data[i] = i for all nodes.
 */
export function generateInitialState(p) {
  const sqrtP = getSqrt(p);
  const nodes = [];
  for (let i = 0; i < p; i++) {
    nodes.push({
      index: i,
      row: Math.floor(i / sqrtP),
      col: i % sqrtP,
      data: i,
    });
  }
  return nodes;
}

/**
 * Stage 1: Row Shift
 * Each row is a ring; data shifts right by rowShift positions.
 * Node at (r, c) receives data from node at (r, (c - rowShift + sqrtP) % sqrtP)
 */
export function applyRowShift(nodes, p, q) {
  const sqrtP = getSqrt(p);
  const rowShift = getRowShift(q, p);
  const result = nodes.map((n) => ({ ...n }));
  for (let i = 0; i < p; i++) {
    const r = Math.floor(i / sqrtP);
    const c = i % sqrtP;
    const srcCol = ((c - rowShift) % sqrtP + sqrtP) % sqrtP;
    const srcIdx = r * sqrtP + srcCol;
    result[i].data = nodes[srcIdx].data;
  }
  return result;
}

/**
 * Stage 2: Column Shift
 * Each column is a ring; data shifts down by colShift positions.
 * Node at (r, c) receives data from node at ((r - colShift + sqrtP) % sqrtP, c)
 */
export function applyColShift(nodes, p, q) {
  const sqrtP = getSqrt(p);
  const colShift = getColShift(q, p);
  const result = nodes.map((n) => ({ ...n }));
  for (let i = 0; i < p; i++) {
    const r = Math.floor(i / sqrtP);
    const c = i % sqrtP;
    const srcRow = ((r - colShift) % sqrtP + sqrtP) % sqrtP;
    const srcIdx = srcRow * sqrtP + c;
    result[i].data = nodes[srcIdx].data;
  }
  return result;
}

/**
 * Compute full shift: initial → after row shift → after col shift
 */
export function computeFullShift(p, q) {
  const initial = generateInitialState(p);
  const afterRowShift = applyRowShift(initial, p, q);
  const afterColShift = applyColShift(afterRowShift, p, q);
  return { initial, afterRowShift, final: afterColShift };
}

/**
 * Row shift arrows for animation.
 */
export function getRowShiftArrows(p, q) {
  const sqrtP = getSqrt(p);
  const rowShift = getRowShift(q, p);
  if (rowShift === 0) return [];
  const arrows = [];
  for (let i = 0; i < p; i++) {
    const r = Math.floor(i / sqrtP);
    const c = i % sqrtP;
    const destCol = (c + rowShift) % sqrtP;
    const destIdx = r * sqrtP + destCol;
    arrows.push({
      fromIndex: i,
      toIndex: destIdx,
      fromCol: c,
      toCol: destCol,
      row: r,
    });
  }
  return arrows;
}

/**
 * Column shift arrows for animation.
 */
export function getColShiftArrows(p, q) {
  const sqrtP = getSqrt(p);
  const colShift = getColShift(q, p);
  if (colShift === 0) return [];
  const arrows = [];
  for (let i = 0; i < p; i++) {
    const r = Math.floor(i / sqrtP);
    const c = i % sqrtP;
    const destRow = (r + colShift) % sqrtP;
    const destIdx = destRow * sqrtP + c;
    arrows.push({
      fromIndex: i,
      toIndex: destIdx,
      fromRow: r,
      toRow: destRow,
      col: c,
    });
  }
  return arrows;
}

/** Ring topology: min(q, p-q) */
export function ringSteps(q, p) {
  return Math.min(q, p - q);
}

/** Mesh topology: (q mod √p) + ⌊q/√p⌋ */
export function meshSteps(q, p) {
  const sqrtP = getSqrt(p);
  return (q % sqrtP) + Math.floor(q / sqrtP);
}

/** Generate comparison table for given p and q arrays */
export function generateComparisonTable(pValues, qValues) {
  const rows = [];
  for (const p of pValues) {
    for (const q of qValues) {
      if (q >= p) continue;
      rows.push({
        p,
        q,
        ring: ringSteps(q, p),
        mesh: meshSteps(q, p),
        rowShift: getRowShift(q, p),
        colShift: getColShift(q, p),
      });
    }
  }
  return rows;
}
