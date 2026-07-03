import AlgorithmVisualizer from '../components/AlgorithmVisualizer';

export default function Playground() {
  return (
    <div className="page">
      <div className="page-header">
        <p className="eyebrow">Interactive Lab</p>
        <h1>Algorithm Visualizer</h1>
        <p>Step through algorithms visually. Edit inputs, watch pointers move, see code highlight in real time.</p>
      </div>
      <AlgorithmVisualizer />
    </div>
  );
}
