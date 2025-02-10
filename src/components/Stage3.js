import React, { useState, useEffect } from 'react';
import { Camera, Trophy } from 'lucide-react';

const Stage3 = ({ setCurrentStage }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [error, setError] = useState('');
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
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
  }, []);

  const verifyLocation = async () => {
    if (!currentLocation) return;

    // Target coordinates for Ponte Umberto I
    const targetLat = 41.892832;
    const targetLng = 12.487168;
    
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
      setCompleted(true);
      localStorage.removeItem('treasureHuntStage');
    } else {
      setError('You need to be closer to the location. Follow the glowing marker!');
    }
  };

  if (completed) {
    return (
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white/95 rounded-lg p-8 max-w-md w-full text-center">
          <div className="success-animation mb-8">
            <Trophy size={64} className="text-gold mx-auto" />
          </div>
          <h2 className="text-2xl font-serif mb-6 text-oxide">
            Quest Complete!
          </h2>
          <p className="text-lg mb-8">
            You've uncovered Rome's hidden numbers where love's promises entwine.
            <br />
            The eternal city's secrets are now forever thine.
          </p>
          <button 
            className="w-full flex items-center justify-center gap-2 bg-gold hover:bg-oxide text-white py-3 px-6 rounded-lg transition-colors"
            onClick={() => window.location.reload()}
          >
            <Trophy size={20} />
            Begin New Quest
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white/95 rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-serif text-center mb-6 text-oxide">
          Stage III • Numbers of Commitment
        </h2>
        
        <div className="mb-8 text-center">
          <p className="text-lg mb-4">
            Where lovers' promises eternally bind,<br />
            Seek coordinates of the heart's sweet grind.<br />
            Forty-one eight nine, twelve forty-eight,<br />
            Find the bridge where locks accumulate.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-center text-lg">
            Follow the glowing marker to find the final location.
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
            Verify Final Location
          </button>
        </div>
      </div>
    </div>
  );
};

export default Stage3;