import React, { useState, useEffect } from 'react';
import { Compass, MapPin, Scroll } from "lucide-react";
import Stage1 from './components/Stage1';
import Stage2 from './components/Stage2';
import Stage3 from './components/Stage3';
import AROverlay from './components/AROverlay';
import './styles.css';
import './animations.css';

const stageLocations = {
  1: { latitude: 41.892766, longitude: 12.484580 }, // Umbilicus Urbis Romae
  2: { latitude: 41.895866, longitude: 12.483423 }, // Trajan's Column
  3: { latitude: 41.892832, longitude: 12.487168 }  // Ponte Umberto I
};

function App() {
  const [currentStage, setCurrentStage] = useState(1);
  const [showRiddle, setShowRiddle] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    const savedStage = localStorage.getItem('treasureHuntStage');
    if (savedStage) setCurrentStage(parseInt(savedStage));
  }, []);

  const startGame = () => {
    setShowRiddle(true);
    setShowOverlay(true);
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-stone-900">
      {/* Ancient texture overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {showOverlay && (
        <AROverlay
          targetLocation={stageLocations[currentStage]}
          visible={showRiddle}
        />
      )}
      
      {!showRiddle ? (
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="bg-stone-800/90 backdrop-blur rounded-lg p-8 max-w-md w-full border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            <div className="relative">
              <Scroll className="w-16 h-16 mx-auto mb-4 text-amber-500" />
              <h1 className="text-4xl font-serif text-center mb-6 text-amber-500 font-bold italic">
                Romanum Iter
              </h1>
            </div>
            <p className="text-lg mb-8 text-center text-amber-100/80 font-serif">
              Through ancient streets and whispered tales,
              <br />
              Uncover Rome's forgotten trails.
              <br />
              Where emperors walked and legends grew,
              <br />
              Sacred secrets await the few.
            </p>
            <button 
              className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-stone-900 py-4 px-6 rounded-lg transition-all transform hover:scale-105 font-semibold text-lg"
              onClick={startGame}
            >
              <Compass className="w-5 h-5" />
              Begin Your Quest
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="absolute top-[90px] left-1/2 -translate-x-1/2 flex gap-4 z-20">
            {[1, 2, 3].map((step) => (
              <div 
                key={step}
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 
                  ${currentStage >= step 
                    ? 'border-amber-500 bg-amber-500 text-stone-900' 
                    : 'border-amber-500/50 bg-stone-800/80 text-amber-500/50'} 
                  backdrop-blur font-serif text-lg font-bold transition-all duration-500`}
              >
                {step}
              </div>
            ))}
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
            {currentStage === 1 && <Stage1 setCurrentStage={setCurrentStage} />}
            {currentStage === 2 && <Stage2 setCurrentStage={setCurrentStage} />}
            {currentStage === 3 && <Stage3 setCurrentStage={setCurrentStage} />}
          </div>
        </>
      )}
    </div>
  );
}

export default App;