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
* @param {string} id - A string containing the advertisement id corresponding to the div the advertisement will load into.
* @param {number} timeout - An integer communicating how long in ms the Prebid.js service should wait before it closes the auction for a lot.
* @param {object} info - An object containing information about the advertisement that is about to load.
* @param {function} prerender - An optional function that will run before the advertisement renders.
* @param {function} cb - An optional callback function that should fire whenever the bidding has concluded.
**/
export function fetchPrebidBids(ad, id, timeout, info, prerender, cb = null) {
  pbjs.requestBids({
    timeout,
    adUnitCodes: [id],
    bidsBackHandler: () => {
      pbjs.setTargetingForGPTAsync([id]);
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
* @param {string} code - Contains the div id used for the advertisement
* @param {array} sizes - An array of applicable ad sizes that are available for bidding.
* @param {object} bids - Contains all of the applicable bid data, such as which vendors to use and their placement ids.
* @param {object} wrapper - An object containing all enabled services on the Arc Ads.
**/
export function addUnit(code, sizes, bids, wrapper = {}) {
  // Formats the add unit for prebid..
  const slot = { code, sizes, bids };
  const { sizeConfig } = wrapper;

  pbjs.addAdUnits(slot);

  if (sizeConfig) {
    pbjs.setConfig({ sizeConfig: [sizeConfig] });
  }
}
