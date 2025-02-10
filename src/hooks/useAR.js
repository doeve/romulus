import { useState, useEffect, useCallback } from 'react';
import {
  calculateDistance,
  calculateBearing,
  calculateScreenPosition,
  calculateBlobOpacity,
  requestOrientationPermission,
  requestLocationPermission,
  isDeviceOrientationSupported
} from '../utils/locationUtils';

const useAR = (targetLocation) => {
  const [deviceOrientation, setDeviceOrientation] = useState({ alpha: 0, beta: 0, gamma: 0 });
  const [currentLocation, setCurrentLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [bearing, setBearing] = useState(null);
  const [error, setError] = useState(null);
  const [permissions, setPermissions] = useState({ orientation: false, location: false });
  const [isSupported, setIsSupported] = useState({ orientation: true, location: true });

  // Check device support and request necessary permissions
  useEffect(() => {
    const setupPermissions = async () => {
      // Check device orientation support
      const orientationSupported = isDeviceOrientationSupported();
      setIsSupported(prev => ({ ...prev, orientation: orientationSupported }));

      // Check location support
      const locationSupported = 'geolocation' in navigator;
      setIsSupported(prev => ({ ...prev, location: locationSupported }));

      if (!orientationSupported) {
        setError('Device orientation not supported on this device');
        return;
      }

      if (!locationSupported) {
        setError('Location services not supported on this device');
        return;
      }

      // Request permissions if supported
      const [orientationGranted, locationGranted] = await Promise.all([
        requestOrientationPermission(),
        requestLocationPermission()
      ]);

      setPermissions({
        orientation: orientationGranted,
        location: locationGranted
      });

      if (!orientationGranted) {
        setError('Device orientation permission required for AR features');
      }
      if (!locationGranted) {
        setError('Location permission required for AR features');
      }
    };

    setupPermissions();
  }, []);

  // Handle device orientation updates
  useEffect(() => {
    if (!permissions.orientation || !isSupported.orientation) return;

    const handleOrientation = (event) => {
      setDeviceOrientation({
        alpha: event.alpha || 0,
        beta: event.beta || 0,
        gamma: event.gamma || 0
      });
    };

    window.addEventListener('deviceorientation', handleOrientation, true);
    return () => window.removeEventListener('deviceorientation', handleOrientation, true);
  }, [permissions.orientation, isSupported.orientation]);

  // Handle location updates
  useEffect(() => {
    if (!permissions.location || !isSupported.location || !targetLocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        setCurrentLocation(newLocation);

        // Calculate distance and bearing to target
        const dist = calculateDistance(
          newLocation.latitude,
          newLocation.longitude,
          targetLocation.latitude,
          targetLocation.longitude
        );
        setDistance(dist);

        const bear = calculateBearing(
          newLocation.latitude,
          newLocation.longitude,
          targetLocation.latitude,
          targetLocation.longitude
        );
        setBearing(bear);
      },
      (error) => setError('Error getting location: ' + error.message),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [permissions.location, isSupported.location, targetLocation]);

  // Calculate AR position
  const calculateARPosition = useCallback((canvas) => {
    if (!distance || !bearing || !deviceOrientation || !canvas) return null;

    const position = calculateScreenPosition(
      canvas,
      distance,
      bearing,
      deviceOrientation,
      window.orientation
    );

    return {
      ...position,
      opacity: calculateBlobOpacity(distance)
    };
  }, [distance, bearing, deviceOrientation]);

  return {
    deviceOrientation,
    currentLocation,
    distance,
    bearing,
    error,
    permissions,
    isSupported,
    calculateARPosition
  };
};

export default useAR;