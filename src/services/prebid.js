import { refreshSlot } from './gpt';

/**
 * @desc Queues a command inside of Prebid.js
 * @param {function} fn - Accepts a function to push into the Prebid command queue.
 **/
export function queuePrebidCommand(fn) {
  pbjs.que.push(fn);
}

/**
 * @desc Calls the Prebid request method for fetching bids, once fetched the advertisement is refreshed unless a callback is defined.
 * @param {object} ad - An object containing the GPT ad slot.
 * @param {string} code - A string containing the advertisement id or slotname corresponding to the div the advertisement will load into.
 * @param {number} timeout - An integer communicating how long in ms the Prebid.js service should wait before it closes the auction for a lot.
 * @param {object} info - An object containing information about the advertisement that is about to load.
 * @param {function} prerender - An optional function that will run before the advertisement renders.
 * @param {function} cb - An optional callback function that should fire whenever the bidding has concluded.
 **/
export function fetchPrebidBids(ad, code, timeout, info, prerender, cb = null) {
  pbjs.requestBids({
    timeout,
    adUnitCodes: [code],
    bidsBackHandler: () => {
      pbjs.setTargetingForGPTAsync([code]);
      if (cb) {
        cb();
      } else {
        refreshSlot({ ad, info, prerender });
      }
    }
  });
}

/**
 * @desc Registers an advertisement with Prebid.js so it's prepared to fetch bids for it.
 * @param {string} code - Contains the div id or slotname used for the advertisement
 * @param {array} sizes - An array of applicable ad sizes that are available for bidding.
 * @param {object} bids - Contains all of the applicable bid data, such as which vendors to use and their placement ids.
 * @param {object} wrapper - An object containing all enabled services on the Arc Ads.
 * @param {object} mediaTypes - An object containing custom mediaType definitions, if for instance you have separate sizes in GPT and prebid.
 **/
export function addUnit(code, sizes, bids, wrapper = {}, mediaTypes = null) {
  // Formats the add unit for prebid..
  const slot = { code, bids };
  slot.mediaTypes = mediaTypes || { banner: { sizes } };
  const { sizeConfig, config } = wrapper;

  pbjs.addAdUnits(slot);

  if (config) {
    pbjs.setConfig(config);
    return;
  }

  if (sizeConfig) {
    pbjs.setConfig({ sizeConfig });
  }
}
