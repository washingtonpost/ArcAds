import { fetchPrebidBids, queuePrebidCommand } from './prebid';
import { fetchAmazonBids, queueAmazonCommand } from './amazon';
import { refreshSlot } from './gpt';
import { sendLog } from '../util/log';

/**
* @desc Initializes all header bidding services and appends the applicable scripts to the page.
* @param {object} obj - An object containing all of the function arguments.
* @param {object} obj.prebid - An object containing configuration data for Prebid.js.
* @param {object} obj.amazon - An object containing configuration data for Amazon A9 and TAM.
**/
export function initializeBiddingServices({
  prebid = false,
  amazon = false
}) {
  if (window.arcBiddingReady) {
    sendLog('initializeBiddingServices()', 'Header bidding has been previously initialized', null);
    return;
  }

  window.arcBiddingReady = false;

  const enablePrebid = new Promise((resolve) => {
    if (prebid && prebid.enabled) {
      if (typeof pbjs === 'undefined') {
        const pbjs = pbjs || {};
        pbjs.que = pbjs.que || [];
      }
      resolve('Prebid has been initialized');
    } else {
      sendLog('initializeBiddingServices()', 'Prebid is not enabled on this wrapper.', null);
      resolve('Prebid is not enabled on the wrapper...');
    }
  });

  const enableAmazon = new Promise((resolve) => {
    if (amazon && amazon.enabled && window.apstag) {
      if (amazon.id && amazon.id !== '') {
        queueAmazonCommand(() => {
          // Initializes the Amazon APS tag script.
          window.apstag.init({
            pubID: amazon.id,
            adServer: 'googletag'
          });

          resolve('Amazon scripts have been added onto the page!');
        });
      } else {
        console.warn(`ArcAds: Missing Amazon account id. 
          Documentation: https://github.com/washingtonpost/arcads#amazon-tama9`);
        sendLog('initializeBiddingServices()', 'Amazon is not enabled on this wrapper.', null);
        resolve('Amazon is not enabled on the wrapper...');
      }
    } else {
      resolve('Amazon is not enabled on the wrapper...');
    }
  });

  // Waits for all header bidding services to be initialized before telling the service it's ready to retrieve bids.
  Promise.all([enablePrebid, enableAmazon])
    .then(() => {
      window.arcBiddingReady = true;
    })
    .catch((error)=>{
      sendLog('header bidding', 'init error', error);
    });
}

/**
* @desc Fetches a bid for an advertisement based on which services are enabled on unit and the wrapper.
* @param {object} obj - An object containing all of the function arguments.
* @param {Object} obj.ad - An object containing the GPT ad slot.
* @param {string} obj.id - A string containing the advertisement id corresponding to the div the advertisement will load into.
* @param {string} obj.slotName - A string containing the slot name of the advertisement, for instance '1234/adn.com/homepage'.
* @param {Array} obj.dimensions - An array containing all of the applicable sizes the advertisement can use.
* @param {Object} obj.wrapper - An object containing all of the wrapper settings.
* @param {Array} obj.bidding - Contains all of the applicable bid data, such as which vendors to use and their placement ids.
* @param {boolean} obj.correlator - An optional boolean that describes if the correlator value should update or not.
* @param {function} obj.prerender - An optional function that will run before the advertisement renders.
**/
export function fetchBids({
  ad,
  id,
  slotName,
  dimensions,
  wrapper,
  bidding,
  correlator = false,
  prerender,
  breakpoints
}) {
  const adInfo = {
    adUnit: ad,
    adSlot: slotName,
    adDimensions: dimensions,
    adId: id,
    bids: bidding,
  };

  const prebidBids = new Promise((resolve) => {
    if (wrapper.prebid && wrapper.prebid.enabled) {
      const timeout = wrapper.prebid.timeout || 700;
      queuePrebidCommand.bind(this, fetchPrebidBids(ad, wrapper.prebid.useSlotForAdUnit ? slotName : id, timeout, adInfo, prerender, () => {
        resolve('Fetched Prebid ads!');
      }));
    } else {
      resolve('Prebid is not enabled on the wrapper...');
    }
  });

  const amazonBids = new Promise((resolve) => {
    if (wrapper.amazon && wrapper.amazon.enabled) {
      fetchAmazonBids(id, slotName, dimensions, breakpoints, () => {
        resolve('Fetched Amazon ads!');
      });
    } else {
      resolve('Amazon is not enabled on the wrapper...');
    }
  });

  if (window.arcBiddingReady) {
    Promise.all([prebidBids, amazonBids])
      .then(() => {
        refreshSlot({
          ad,
          correlator,
          prerender,
          info: adInfo
        });
      })
      .catch((error)=>{
        sendLog('header bidding', 'init error', error);
      });
  } else {
    setTimeout(() => initializeBiddingServices(), 200);
  }
}
