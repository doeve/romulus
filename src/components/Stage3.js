import React, { useState } from 'react';
import EXIF from 'exif-js';
import { LockKey, Flag } from "@phosphor-icons/react";

const Stage3 = ({ setCurrentStage }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [completed, setCompleted] = useState(false);

  const handleUpload = () => {
    if (!file) {
      setError('Please select an image first');
      return;
    }

    EXIF.getData(file, function() {
      const lat = EXIF.getTag(this, 'GPSLatitude');
      const lng = EXIF.getTag(this, 'GPSLongitude');
      
      if (lat && lng) {
        const decimalLat = lat[0] + lat[1]/60 + lat[2]/3600;
        const decimalLng = lng[0] + lng[1]/60 + lng[2]/3600;
        
        // Coordinates for Ponte Umberto I
        const targetLat = 41.8928320;
        const targetLng = 12.4871679;
        
        const isInRange = 
          Math.abs(decimalLat - targetLat) < 0.001 && 
          Math.abs(decimalLng - targetLng) < 0.001;

        if (isInRange) {
          setCompleted(true);
          localStorage.removeItem('treasureHuntStage'); // Clear progress
        } else {
          setError('Location not recognized. The bridge of lockets awaits...');
        }
      } else {
        setError('No GPS data found. Ensure location is enabled for your camera.');
      }
    });
  };

  if (completed) {
    return (
      <div className="stage-card completion-card">
        <div className="success-animation">
          <LockKey size={64} weight="duotone" className="success-icon" />
        </div>
        <h2 className="section-title">Quest Complete!</h2>
        <p className="instruction-text">
          You've uncovered Rome's hidden numbers where love's promises entwine.
          <br />
          The eternal city's secrets are now forever thine.
        </p>
        <button 
          className="btn-primary"
          onClick={() => window.location.reload()}
          style={{ marginTop: '2rem' }}
        >
          <Flag size={20} weight="light" />
          Begin Anew
        </button>
      </div>
    );
  }

  return (
    <div className="stage-card">
      <h2 className="section-title">Stage III • Numbers of Commitment</h2>
      
      <div className="riddle-section">
        <p className="instruction-text">
          Where lovers' promises eternally bind,
          <br />
          Seek coordinates of the heart's sweet grind.
          <br />
          Forty-one eight nine, twelve forty-eight,
          <br />
          Find the bridge where locks accumulate.
        </p>
      </div>

      <div className="upload-section">
        <p className="instruction-text">
          Capture the bridge of eternal vows:
        </p>
        
        <input 
          type="file" 
          id="upload-file"
          accept="image/*" 
          onChange={(e) => {
            setFile(e.target.files[0]);
            setError('');
          }}
          hidden
        />
        <label htmlFor="upload-file" className="file-input-label">
          <LockKey size={20} weight="light" />
          {file ? file.name : 'Select Image'}
        </label>
        
        {error && <p className="error-text">{error}</p>}

        {file && (
          <button 
            className="btn-primary"
            onClick={handleUpload}
            style={{ marginTop: '1rem' }}
          >
            <LockKey size={20} weight="light" />
            Verify Final Location
          </button>
        )}
      </div>
    </div>
  );
};

export default Stage3;