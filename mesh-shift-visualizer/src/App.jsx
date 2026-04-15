import { useState, useCallback, useRef } from 'react';
import ControlPanel from './components/ControlPanel';
import MeshGrid from './components/MeshGrid';
import ComplexityPanel from './components/ComplexityPanel';
import './App.css';

function App() {
  const [p, setP] = useState(16);
  const [q, setQ] = useState(5);
  const [stage, setStage] = useState('initial');
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef(null);

  const handleUpdate = useCallback((newP, newQ) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setP(newP);
    setQ(newQ);
    setStage('initial');
    setAnimating(false);
  }, []);

  const handleAnimate = useCallback((pVal, qVal) => {
    setP(pVal);
    setQ(qVal);
    setAnimating(true);
    setStage('initial');

    // Timeline: initial → rowShift → afterRow → colShift → final
    timerRef.current = setTimeout(() => {
      setStage('rowShift');
      timerRef.current = setTimeout(() => {
        setStage('afterRow');
        timerRef.current = setTimeout(() => {
          setStage('colShift');
          timerRef.current = setTimeout(() => {
            setStage('final');
            setAnimating(false);
          }, 2200);
        }, 1200);
      }, 2200);
    }, 800);
  }, []);

  const handleReset = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setStage('initial');
    setAnimating(false);
  }, []);

  return (
    <>
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="header-title">
            <span className="logo-icon">◈</span>
            <div>
              <h1>Mesh Circular Shift Visualizer</h1>
              <p className="subtitle">
                Interactive 2D Mesh Topology Simulator for Parallel Computing
              </p>
            </div>
          </div>
          <div className="header-badges">
            <span className="badge">PDC Assignment 2</span>
            <span className="badge badge-accent">Q4</span>
          </div>
        </div>
      </header>

      {/* Main 3-column layout */}
      <main className="app-main">
        <aside className="sidebar">
          <ControlPanel
            onUpdate={handleUpdate}
            onAnimate={handleAnimate}
            onReset={handleReset}
            animating={animating}
          />
        </aside>

        <section className="grid-section">
          <MeshGrid p={p} q={q} stage={stage} />
        </section>

        <aside className="sidebar sidebar-right">
          <ComplexityPanel p={p} q={q} />
        </aside>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>
          Mesh Circular Shift Visualizer &mdash; Parallel &amp; Distributed
          Computing
        </p>
      </footer>
    </>
  );
}

export default App;
