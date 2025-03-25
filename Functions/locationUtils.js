const geolib = require('geolib');

/**
 * Calculate distance between two coordinates in meters
 * @param {Object} point1 - {latitude, longitude}
 * @param {Object} point2 - {latitude, longitude}
 * @returns {Number} Distance in meters
 */
const calculateDistance = (point1, point2) => {
  return geolib.getDistance(
    { latitude: point1.latitude, longitude: point1.longitude },
    { latitude: point2.latitude, longitude: point2.longitude }
  );
};

/**
 * Check if two points are within given distance
 * @param {Object} point1 - {latitude, longitude}
 * @param {Object} point2 - {latitude, longitude}
 * @param {Number} maxDistance - Maximum distance in meters
 * @returns {Boolean} True if within distance, false otherwise
 */
const isWithinDistance = (point1, point2, maxDistance) => {
  const distance = calculateDistance(point1, point2);
  return distance <= maxDistance;
};

/**
 * Get current location of client
 * @returns {Promise<Object>} - {latitude, longitude}
 */
const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject('Geolocation is not supported by your browser');
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          reject(`Error getting location: ${error.message}`);
        }
      );
    }
  });
};

module.exports = {
  calculateDistance,
  isWithinDistance,
  getCurrentLocation
};
