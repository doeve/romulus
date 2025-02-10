import React, { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';

const Stage2 = ({ setCurrentStage }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [error, setError] = useState('');

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

    // Target coordinates for Trajan's Column
    const targetLat = 41.895866;
    const targetLng = 12.483423;
    
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
      localStorage.setItem('treasureHuntStage', 3);
      setCurrentStage(3);
    } else {
      setError('You need to be closer to the location. Follow the glowing marker!');
    }
  };

  return (
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white/95 rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-serif text-center mb-6 text-oxide">
          Stage II • Trajan's Witness
        </h2>
        
        <div className="mb-8 text-center">
          <p className="text-lg mb-4">
            Find the silent sentinel near Trajan's glory,<br />
            Where a tree once stood, now exists a story.<br />
            Capture the remnants of nature's lost crown,<br />
            Then seek the key that's hidden around.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-center text-lg">
            Follow the glowing marker to find the location.
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
    </div>
  );
};

export default Stage2;