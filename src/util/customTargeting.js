/**
* @desc If a different key is required to serve position targeting for older creatives, rename it here.
* @param {object} targeting - Targeting object passed in from the ad object.
* @param {number} positionValue - The nth number of adType included.
* @return - Returns the targeting object with the old position value stripped out, and the new one with the desired key in its place.
**/
export function renamePositionKey(targeting, positionValue) {
  const newTargetingObject = targeting;
  const keyName = targeting.position.as;
  delete newTargetingObject.position;
  newTargetingObject[keyName] = positionValue;
  Object.assign(targeting, newTargetingObject);
  return targeting;
}
