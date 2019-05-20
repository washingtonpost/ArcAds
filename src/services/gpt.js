import { appendResource } from '../util/resources';
import { expandQueryString } from '../util/query';

/**
* @desc Initializes the Google Publisher tag scripts.
**/
export function initializeGPT() {
  window.googletag = window.googletag || {};
  window.googletag.cmd = window.googletag.cmd || [];

  appendResource('script', '//www.googletagservices.com/tag/js/gpt.js', true, true);
}

/**
* @desc Refreshes an advertisement via the GPT refresh method. If a prerender function is provided it is executed prior to the refresh.
* @param {object} obj - An object containing all of the function arguments.
* @param {Object} obj.ad - An object containing the GPT ad slot.
* @param {boolean} obj.correlator - An optional boolean that describes if the correlator value should update or not.
* @param {function} obj.prerender - An optional function that will run before the advertisement renders.
* @param {object} obj.info - An object containing information about the advertisement that is about to load.
**/
export function refreshSlot({
  ad,
  correlator = false,
  prerender = null,
  info = {}
}) {
  new Promise((resolve) => {
    if (prerender) {
      try {
        prerender(info).then(() => {
          resolve('Prerender function has completed.');
        });
      } catch (error) {
        console.warn(`ArcAds: Prerender function did not return a promise or there was an error.
          Documentation: https://github.com/wapopartners/arc-ads/wiki/Utilizing-a-Prerender-Hook`);
        resolve('Prerender function did not return a promise or there was an error, ignoring.');
      }
    } else {
      resolve('No Prerender function was provided.');
    }
  }).then(() => {
    runRefreshEvent();
  });

  function runRefreshEvent() {
    if (window.googletag && googletag.pubadsReady) {
      window.googletag.pubads().refresh([ad], { changeCorrelator: correlator });
    } else {
      setTimeout(() => {
        runRefreshEvent();
      }, 200);
    }
  }
}

/**
* @desc Queues a command inside of GPT.
* @param {function} fn - Accepts a function to push into the Prebid command queue.
**/
export function queueGoogletagCommand(fn) {
  window.googletag.cmd.push(fn);
}

/**
* @desc Assigns key/value targeting to a specific advertisement.
* @param {Object} ad - An object containing the GPT ad slot.
* @param {Object} options - An object containing all of the key/value targeting pairs to assign to the advertisement.
**/
export function setTargeting(ad, options) {
  for (const key in options) {
    if (options.hasOwnProperty(key) && options[key]) {
      ad.setTargeting(key, options[key]);
    }
  }
}

/**
* @desc Configures the GPT configuration options.
* @param {function} handleSlotRenderEnded - Callback function that gets fired whenever a GPT ad slot has finished rendering.
**/
export function dfpSettings(handleSlotRenderEnded) {
  window.googletag.pubads().disableInitialLoad();
  window.googletag.pubads().enableSingleRequest();
  window.googletag.pubads().enableAsyncRendering();
  if (this.collapseEmptyDivs) {
    window.googletag.pubads().collapseEmptyDivs();
  }
  window.googletag.enableServices();

  if (handleSlotRenderEnded) {
    window.googletag.pubads().addEventListener('slotRenderEnded', handleSlotRenderEnded);
  }
}

/**
* @desc Determines the full slot name of the ad unit. If a user appends an 'adslot' query parameter to the page URL the slot name will be verridden.
* @param {string} dfpCode - A string containing the publishers DFP id code.
* @param {string} slotName - A string containing the slot name of the advertisement, for example 'homepage'.
* @return - Returns a string combining the DFP id code and the slot name, for example '123/homepage'.
**/
export function determineSlotName(dfpCode, slotName) {
  const slotOverride = expandQueryString('adslot');
  if (slotOverride && (slotOverride !== '' || slotOverride !== null)) {
    return `/${dfpCode}/${slotOverride}`;
  }
  return `/${dfpCode}/${slotName}`;
}
