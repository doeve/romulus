import React, { useState } from 'react';
import EXIF from 'exif-js';
import { MapPin } from "@phosphor-icons/react";

const Stage2 = ({ setCurrentStage }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

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
        
        // Coordinates for cut tree near Trajan's Column
        const targetLat = 41.895866;
        const targetLng = 12.483423;
        
        const isInRange = 
          Math.abs(decimalLat - targetLat) < 0.001 && 
          Math.abs(decimalLng - targetLng) < 0.001;

        if (isInRange) {
          localStorage.setItem('treasureHuntStage', 3);
          setCurrentStage(3);
        } else {
          setError('Location not recognized. Ensure you\'re at the specified site and GPS is enabled.');
        }
      } else {
        setError('No GPS data found in the image. Please ensure location services are enabled for your camera.');
      }
    });
  };

  return (
    <div className="stage-card">
      <h2 className="section-title">Stage II • Trajan's Witness</h2>
      
      <div className="riddle-section">
        <p className="instruction-text">
          Find the silent sentinel near Trajan's glory,
          <br />
          Where a tree once stood, now exists a story.
          <br />
          Capture the remnants of nature's lost crown,
          <br />
          Then seek the key that's hidden around.
        </p>
      </div>

      <div className="upload-section">
        <p className="instruction-text">
          Take a photo of the location and upload below:
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
          <MapPin size={20} weight="light" />
          {file ? file.name : 'Select Image'}
        </label>
        
        {error && <p className="error-text">{error}</p>}

        {file && (
          <button 
            className="btn-primary"
            onClick={handleUpload}
            style={{ marginTop: '1rem' }}
          >
            <MapPin size={20} weight="light" />
            Verify Location
          </button>
        )}
      </div>
    </div>
  );
};

export default Stage2;