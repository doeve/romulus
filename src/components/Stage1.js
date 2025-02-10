import React, { useState, useEffect } from 'react';
import { CheckCircle, Camera } from 'lucide-react';

const Stage1 = ({ setCurrentStage }) => {
  const [answer, setAnswer] = useState('umbilicus urbis romae');
  const [success, setSuccess] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (success) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => setError('Please enable location services to continue.'),
        { enableHighAccuracy: true }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [success]);

  const checkRiddle = (e) => {
    e.preventDefault();
    if (answer.toLowerCase() === 'umbilicus urbis romae') {
      setSuccess(true);
    }
  };

  const verifyLocation = async () => {
    if (!currentLocation) return;

    // Target coordinates for Umbilicus Urbis Romae
    const targetLat = 41.892766;
    const targetLng = 12.484580;
    
    // Calculate distance
    const R = 6371e3;
    const φ1 = currentLocation.latitude * Math.PI/180;
    const φ2 = targetLat * Math.PI/180;
    const Δφ = (targetLat - currentLocation.latitude) * Math.PI/180;
    const Δλ = (targetLng - currentLocation.longitude) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    if (distance < 10) {
      localStorage.setItem('treasureHuntStage', 2);
      setCurrentStage(2);
    } else {
      setError('You need to be closer to the location. Follow the glowing marker!');
    }
  };

  if (!success) {
    return (
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white/95 rounded-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-serif text-center mb-6 text-oxide">
            Stage I • Navel of Rome
          </h2>
          
          <div className="mb-8 text-center">
            <p className="text-lg mb-4">
              I mark Rome's beating heart,<br />
              Where all roads meet and journeys start.<br />
              Augustus' measure, world's center true,<br />
              Seek the stone that emperors knew.
            </p>
          </div>
      
          <form onSubmit={checkRiddle} className="space-y-4">
            <input
              className="w-full px-4 py-3 rounded-lg border border-gold/30 focus:border-gold focus:ring-2 focus:ring-gold/20 bg-white/90"
              type="text" 
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter the Latin name..."
            />
            <button 
              className="w-full flex items-center justify-center gap-2 bg-gold hover:bg-oxide text-white py-3 px-6 rounded-lg transition-colors"
              type="submit"
            >
              <CheckCircle size={20} />
              Verify Answer
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/95 rounded-lg p-6">
      <div className="space-y-4">
        <p className="text-center text-lg">
          Great! Now follow the glowing marker to find the ancient site.
          The marker will become brighter as you get closer.
        </p>
        
        {error && (
          <p className="text-red-500 text-center text-sm">{error}</p>
        )}

        <button
          className="w-full flex items-center justify-center gap-2 bg-gold hover:bg-oxide text-white py-3 px-6 rounded-lg transition-colors"
          onClick={verifyLocation}
        >
          <Camera size={20} />
          Verify Location
        </button>
      </div>
    </div>
  );
};

export default Stage1;