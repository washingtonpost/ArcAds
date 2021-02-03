import anylogger from 'anylogger';
import 'anylogger-console';
/**
* @desc Determines whether or not to log based on a url param. Takes description as a parameter and returns log.
* @param {string} description - The description that should go in the log.
**/
export function sendLog(parentFunc, description, slotName) {
  if ((new URLSearchParams(window.location.search)).get('debug') === 'true') {
    const log = anylogger('arcads.js');
    log({
      service: 'ArcAds',
      timestamp: `${new Date()}`,
      'logging from': parentFunc,
      description,
      slotName
    });
  }
  return;
}
