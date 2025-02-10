import React, { useState } from 'react';
import EXIF from 'exif-js';
import { CheckCircle, MapPin } from "@phosphor-icons/react";


const Stage1 = ({ setCurrentStage }) => {
  const [answer, setAnswer] = useState('');
  const [file, setFile] = useState(null);
  const [success, setSuccess] = useState(false);

  const checkRiddle = (e) => {
    e.preventDefault();
    if (answer.toLowerCase() === 'umbilicus urbis romae') {
      setSuccess(true);
    }
  };

  const handleUpload = async () => {
    EXIF.getData(file, async function() {
      const lat = EXIF.getTag(this, 'GPSLatitude');
      const lng = EXIF.getTag(this, 'GPSLongitude');
      
      if (lat && lng) {
        const decimalLat = lat[0] + lat[1]/60 + lat[2]/3600;
        const decimalLng = lng[0] + lng[1]/60 + lng[2]/3600;
        
        // Coordinates for Umbilicus Urbis Romae
        const targetLat = 41.892766; 
        const targetLng = 12.484580;
        
        if (Math.abs(decimalLat - targetLat) < 0.001 && 
            Math.abs(decimalLng - targetLng) < 0.001) {
          localStorage.setItem('treasureHuntStage', 2);
          setCurrentStage(2);
        }
      }
    });
  };

  return (
    <div className="stage-card">
      <h2 className="section-title">Stage I • Navel of Rome</h2>
      
      <div className="riddle-section">
        <p className="riddle-text">
          I mark Rome's beating heart,<br />
          Where all roads meet and journeys start.<br />
          Augustus' measure, world's center true,<br />
          Seek the stone that emperors knew.
        </p>
      </div>
  
      <form onSubmit={checkRiddle}>
        <input
          className="input-field"
          type="text" 
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Enter the Latin name..."
        />
        <button className="btn-primary" type="submit">
          <CheckCircle size={20} weight="light" />
          Verify Answer
        </button>
      </form>
  
      {success && (
        <div className="upload-section">
          <p className="instruction-text">
            Capture the sacred site's current state. Ensure GPS is enabled.
          </p>
          
          <input 
            type="file" 
            id="upload-file"
            accept="image/*" 
            onChange={(e) => setFile(e.target.files[0])}
            hidden
          />

          <label htmlFor="upload-file" className="file-input-label">
            <MapPin size={20} weight="light" className="map-pin"/>
            {file ? file.name : 'Select Image'}
          </label>
          
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
      )}
    </div>
  );
};

export default Stage1;