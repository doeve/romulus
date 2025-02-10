// Earth's radius in meters
const EARTH_RADIUS = 6371e3;

/**
 * Calculate distance between two coordinates in meters
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return EARTH_RADIUS * c;
};

/**
 * Calculate bearing between two points in degrees
 */
export const calculateBearing = (lat1, lon1, lat2, lon2) => {
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const λ1 = lon1 * Math.PI / 180;
  const λ2 = lon2 * Math.PI / 180;

  const y = Math.sin(λ2 - λ1) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) -
          Math.sin(φ1) * Math.cos(φ2) * Math.cos(λ2 - λ1);
  const θ = Math.atan2(y, x);

  return (θ * 180 / Math.PI + 360) % 360;
};

/**
 * Calculate screen position for AR blob based on device orientation and target location
 */
export const calculateScreenPosition = (
  canvas,
  distance,
  bearing,
  deviceOrientation,
  screenOrientation = window.orientation || 0
) => {
  const { width, height } = canvas;
  const centerX = width / 2;
  const centerY = height / 2;

  // Adjust compass heading based on screen orientation
  let compassHeading = deviceOrientation.alpha;
  if (screenOrientation === 90) {
    compassHeading += 90;
  } else if (screenOrientation === -90) {
    compassHeading -= 90;
  }
  compassHeading = compassHeading * Math.PI / 180;

  // Convert device orientation to radians
  const pitch = deviceOrientation.beta * Math.PI / 180;
  const roll = deviceOrientation.gamma * Math.PI / 180;

  // Calculate relative angle between device and target
  const bearingRad = bearing * Math.PI / 180;
  const relativeAngle = bearingRad - compassHeading;

  // Calculate horizontal position based on bearing difference
  const x = centerX + Math.sin(relativeAngle) * (width / 3);

  // Calculate vertical position based on pitch and distance
  // Assume target is roughly at eye level (1.7m height)
  const verticalAngle = Math.atan2(1.7, distance / 1000);
  const y = centerY - (pitch - verticalAngle) * (height / Math.PI);

  // Apply roll compensation
  const rollCompensation = Math.sin(roll) * (height / 8);
  
  return {
    x,
    y: y + rollCompensation,
    visible: distance <= 500 // Only visible within 500 meters
  };
};

/**
 * Calculate opacity for AR blob based on distance
 */
export const calculateBlobOpacity = (distance) => {
  if (distance > 500) return 0;
  // Logarithmic scale for opacity
  return Math.min(1, Math.log10(500 / Math.max(1, distance)));
};

/**
 * Check if device orientation is supported
 */
export const isDeviceOrientationSupported = () => {
  return 'DeviceOrientationEvent' in window;
};

/**
 * Request and validate device orientation permissions
 */
export const requestOrientationPermission = async () => {
  // First check if the API is available
  if (!isDeviceOrientationSupported()) {
    console.warn('Device orientation not supported');
    return false;
  }

  // Check if permission is needed (iOS 13+ requirement)
  if (typeof window.DeviceOrientationEvent?.requestPermission === 'function') {
    try {
      const permission = await window.DeviceOrientationEvent.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting device orientation permission:', error);
      return false;
    }
  }
  
  // If requestPermission isn't available, assume it's allowed
  return true;
};

/**
 * Request and validate geolocation permissions
 */
export const requestLocationPermission = () => {
  return new Promise((resolve) => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => resolve(true),
        () => resolve(false),
        { enableHighAccuracy: true }
      );
    } else {
      resolve(false);
    }
  });
};