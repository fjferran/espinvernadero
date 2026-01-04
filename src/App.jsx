import React, { useState } from 'react';
import './styles/main.css';
import { tutorialSteps } from './data/tutorialSteps';
import StepViewer from './components/StepViewer';

function App() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const nextStep = () => {
    if (currentStepIndex < tutorialSteps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const progress = ((currentStepIndex + 1) / tutorialSteps.length) * 100;

  return (
    <div className="app-container">
      <header>
        <h1 className="title-display">🌿 Cultivo Inteligente</h1>
      </header>

      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>

      <StepViewer
        step={tutorialSteps[currentStepIndex]}
        onNext={nextStep}
        onPrev={prevStep}
        isFirst={currentStepIndex === 0}
        isLast={currentStepIndex === tutorialSteps.length - 1}
      />

      <footer style={{ textAlign: 'center', opacity: 0.5, marginTop: '3rem', fontSize: '0.8rem' }}>
        <p>Guía de Código Abierto para Agricultores</p>
      </footer>
    </div>
  );
}

export default App;
