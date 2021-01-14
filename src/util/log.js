import anylogger from 'anylogger';
import 'anylogger-console';
/**
* @desc Determines whether or not to log based on a url param. Takes description as a parameter and returns log.
* @param {function} func - The function that should be debounced.
* @param {number} wait - The amount of time a function should wait before it fires again.
* @return - Returns a function every so many milliseconds based on the provided parameters.
**/
export function sendLog(description) {
  if ((new URLSearchParams(window.location.search)).get('debug') === 'true') {
    const log = anylogger('arcads.js');
    log({
      service: 'ArcAds',
      timestamp: `${new Date()}`,
      description
    });
  }
}
