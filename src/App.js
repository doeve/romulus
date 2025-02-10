import React, { useState, useEffect } from 'react';
import { Camera, MapPin, CheckCircle } from "@phosphor-icons/react";
import Stage1 from './components/Stage1';
import Stage2 from './components/Stage2';
import Stage3 from './components/Stage3';
import './styles.css';
import './animations.css';

function App() {
  const [currentStage, setCurrentStage] = useState(1);
  const [showRiddle, setShowRiddle] = useState(false);

  useEffect(() => {
    const savedStage = localStorage.getItem('treasureHuntStage');
    if (savedStage) setCurrentStage(parseInt(savedStage));
  }, []);

  const startGame = () => setShowRiddle(true);

  return (
    <div className="app-container">
    {!showRiddle ? (
      <div className="welcome-card">
        <h1 className="header">Romanum Iter</h1>
        <div className="stage-card">
          <p className="welcome-text">
            Uncover hidden layers of ancient Rome through 
            carefully curated archaeological challenges.
          </p>
          <button className="btn-primary" onClick={startGame}>
            <MapPin size={20} weight="light" />
            Begin Exploration
          </button>
        </div>
      </div>
    ) : (
      <>
        <div className="progress-tracker">
          {[1, 2, 3].map((step) => (
            <div 
              key={step} 
              className={`progress-step ${currentStage >= step ? 'active' : ''}`}
            >
              {step}
            </div>
          ))}
        </div>
        
        {currentStage === 1 && <Stage1 setCurrentStage={setCurrentStage} />}
        {currentStage === 2 && <Stage2 setCurrentStage={setCurrentStage} />}
        {currentStage === 3 && <Stage3 setCurrentStage={setCurrentStage} />}
      </>
    )}
  </div>
  );
}

export default App;