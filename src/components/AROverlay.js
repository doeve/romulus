import React, { useEffect, useRef } from 'react';
import useAR from '../hooks/useAR';

const AROverlay = ({ targetLocation, visible = true }) => {
  const canvasRef = useRef(null);
  const {
    error,
    calculateARPosition,
    permissions,
    isSupported,
    deviceOrientation,
    currentLocation,
    distance,
    bearing
  } = useAR(targetLocation);

  useEffect(() => {
    if (!visible || !permissions.orientation || !permissions.location) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let animationFrame;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const position = calculateARPosition(canvas);
      if (position) {
        const { x, y, opacity, visible: isVisible } = position;

        if (isVisible) {
          if (x < 0 || x > canvas.width || y < 0 || y > canvas.height) {
            const angle = Math.atan2(y - canvas.height/2, x - canvas.width/2);
            const gradient = ctx.createLinearGradient(
              canvas.width/2,
              canvas.height/2,
              canvas.width/2 + Math.cos(angle) * 100,
              canvas.height/2 + Math.sin(angle) * 100
            );
            gradient.addColorStop(0, `rgba(255, 215, 0, ${opacity * 0.5})`);
            gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          } else {
            // Mystical glowing effect
            const gradientSize = 120 + Math.sin(Date.now() / 1000) * 20;
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, gradientSize);
            gradient.addColorStop(0, `rgba(255, 215, 0, ${opacity * 0.8})`);
            gradient.addColorStop(0.5, `rgba(255, 165, 0, ${opacity * 0.4})`);
            gradient.addColorStop(1, 'rgba(255, 140, 0, 0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, gradientSize, 0, Math.PI * 2);
            ctx.fill();

            // Add mystical symbols
            ctx.strokeStyle = `rgba(255, 215, 0, ${opacity * 0.3})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            for (let i = 0; i < 8; i++) {
              const angle = (i / 8) * Math.PI * 2;
              ctx.moveTo(x + Math.cos(angle) * 40, y + Math.sin(angle) * 40);
              ctx.lineTo(x + Math.cos(angle) * 60, y + Math.sin(angle) * 60);
            }
            ctx.stroke();
          }
        }
      }

      animationFrame = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrame);
    };
  }, [visible, permissions, calculateARPosition]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-10 pointer-events-none"
        aria-hidden="true"
      />
      
      {/* Debug information */}
      <div className="fixed top-0 left-0 right-0 p-4 bg-black/40 text-white text-xs font-mono z-20 backdrop-blur-sm">
        <div className="max-w-sm mx-auto space-y-1">
          <p>Orientation Support: {isSupported.orientation ? '✅' : '❌'}</p>
          <p>Location Support: {isSupported.location ? '✅' : '❌'}</p>
          <p>Orientation Permission: {permissions.orientation ? '✅' : '❌'}</p>
          <p>Location Permission: {permissions.location ? '✅' : '❌'}</p>
          {error && <p className="text-red-400">Error: {error}</p>}
          {deviceOrientation && (
            <>
              <p>Alpha: {deviceOrientation.alpha?.toFixed(2)}°</p>
              <p>Beta: {deviceOrientation.beta?.toFixed(2)}°</p>
              <p>Gamma: {deviceOrientation.gamma?.toFixed(2)}°</p>
            </>
          )}
          {currentLocation && (
            <>
              <p>Lat: {currentLocation.latitude?.toFixed(6)}</p>
              <p>Lng: {currentLocation.longitude?.toFixed(6)}</p>
              {distance && <p>Distance: {distance.toFixed(1)}m</p>}
              {bearing && <p>Bearing: {bearing.toFixed(1)}°</p>}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AROverlay;