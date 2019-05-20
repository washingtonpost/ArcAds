import { MobileDetection } from './util/mobile';
import { fetchBids, initializeBiddingServices } from './services/headerbidding';
import { initializeGPT, queueGoogletagCommand, refreshSlot, dfpSettings, setTargeting, determineSlotName } from './services/gpt';
import { queuePrebidCommand, addUnit } from './services/prebid';
import { prepareSizeMaps, setResizeListener } from './services/sizemapping';

/** @desc Displays an advertisement from Google DFP with optional support for Prebid.js and Amazon TAM/A9. **/
export class ArcAds {
  constructor(options, handleSlotRendered = null) {
    this.dfpId = options.dfp.id || '';
    this.wrapper = options.bidding || {};
    this.positions = [];
    this.collapseEmptyDivs = options.dfp.collapseEmptyDivs;

    window.isMobile = MobileDetection;

    if (this.dfpId === '') {
      console.warn(`ArcAds: DFP id is missing from the arcads initialization script. 
        Documentation: https://github.com/wapopartners/arc-ads#getting-started`);
    } else {
      initializeGPT();
      queueGoogletagCommand(dfpSettings.bind(this, handleSlotRendered));
      initializeBiddingServices(this.wrapper);
    }
  }

  /**
  * @desc Registers an advertisement in the service.
  * @param {object} params - An object containing all of the advertisement configuration settings such as slot name, id, and position.
  **/
  registerAd(params) {
    const { id, slotName, dimensions, adType = false, targeting = {}, display = 'all', bidding = false, iframeBidders = ['openx'] } = params;
    const flatDimensions = [];
    let processDisplayAd = false;

    if (dimensions && typeof dimensions !== 'undefined' && typeof dimensions[0] === 'number') {
      flatDimensions.push(...dimensions);
    } else if (dimensions && typeof dimensions !== 'undefined' && dimensions.length > 0 && dimensions[0][0][0] === undefined) {
      flatDimensions.push(...dimensions);
    } else if (dimensions) {
      dimensions.forEach((set) => {
        flatDimensions.push(...set);
      });
    }

    try {
      /* If positional targeting doesn't exist it gets assigned a numeric value
        based on the order and type of the advertisement. This logic is skipped if adType is not defined. */
      if ((!targeting || !targeting.hasOwnProperty('position')) && adType !== false) {
        const position = this.positions[adType] + 1 || 1;
        this.positions[adType] = position;

        const positionParam = Object.assign(targeting, { position });
        Object.assign(params, { targeting: positionParam });
      }

      if ((isMobile.any() && display === 'mobile') || (!isMobile.any() && display === 'desktop') || (display === 'all')) {
        // Registers the advertisement with Prebid.js if enabled on both the unit and wrapper.
        if ((bidding.prebid && bidding.prebid.bids) && (this.wrapper.prebid && this.wrapper.prebid.enabled) && flatDimensions) {
          if (pbjs && iframeBidders.length > 0) {
            pbjs.setConfig({
              userSync: {
                iframeEnabled: true,
                filterSettings: {
                  iframe: {
                    bidders: iframeBidders,
                    filter: 'include'
                  }
                }
              }
            });
          }
          const code = this.wrapper.prebid.useSlotForAdUnit ? determineSlotName(this.dfpId, slotName) : id;
          queuePrebidCommand.bind(this, addUnit(code, flatDimensions, bidding.prebid.bids, this.wrapper.prebid));
        }

        processDisplayAd = this.displayAd.bind(this, params);
        if (processDisplayAd) {
          queueGoogletagCommand(processDisplayAd);
        }
      }
    } catch (err) {
      console.error('ads error', err);
    }
  }

  /**
  * @desc Registers a collection of advertisements.
  * @param {array} collection - An array containing a list of objects containing advertisement data.
  **/
  registerAdCollection(collection) {
    collection.forEach((advert) => {
      this.registerAd(advert);
    });
  }

  /**
  * @desc Displays an advertisement and sets up any neccersary event binding.
  * @param {object} params - An object containing all of the function arguments.
  * @param {string} params.id - A string containing the advertisement id corresponding to the div the advertisement will load into.
  * @param {string} params.slotName - A string containing the slot name of the advertisement, for instance '1234/news/homepage'.
  * @param {array} params.dimensions - An array containing all of the applicable sizes the advertisement can use.
  * @param {object} params.targeting - An object containing all of the advertisements targeting data.
  * @param {array} params.sizemap - An array containing optional size mapping information.
  * @param {object} params.bidding - Contains all of the applicable bid data, such as which vendors to use and their placement ids.
  * @param {function} params.prerender - An optional function that will run before the advertisement renders.
  **/
  displayAd({
    id,
    slotName,
    dimensions,
    targeting,
    sizemap = false,
    bidding = false,
    prerender = null
  }) {
    const fullSlotName = determineSlotName(this.dfpId, slotName);
    const parsedDimensions = dimensions && !dimensions.length ? null : dimensions;
    const ad = !dimensions ? window.googletag.defineOutOfPageSlot(fullSlotName, id)
      : window.googletag.defineSlot(fullSlotName, parsedDimensions, id);


    if (sizemap && sizemap.breakpoints && dimensions) {
      const { mapping, breakpoints, correlators } = prepareSizeMaps(parsedDimensions, sizemap.breakpoints);

      if (ad) {
        ad.defineSizeMapping(mapping);
      } else {
        return false;
      }

      if (sizemap.refresh) {
        setResizeListener({
          ad,
          slotName: fullSlotName,
          breakpoints,
          id,
          mapping,
          correlators,
          bidding,
          wrapper: this.wrapper,
          prerender
        });
      }
    }

    if (ad) {
      ad.addService(window.googletag.pubads());
      setTargeting(ad, targeting);
    }

    const safebreakpoints = (sizemap && sizemap.breakpoints) ? sizemap.breakpoints : [];

    if (dimensions && bidding && ((bidding.amazon && bidding.amazon.enabled) || (bidding.prebid && bidding.prebid.enabled))) {
      fetchBids({
        ad,
        id,
        slotName: fullSlotName,
        dimensions: parsedDimensions,
        wrapper: this.wrapper,
        prerender,
        bidding,
        breakpoints: safebreakpoints
      });
    } else {
      refreshSlot({
        ad,
        prerender,
        info: {
          adUnit: ad,
          adSlot: fullSlotName,
          adDimensions: parsedDimensions,
          adId: id
        }
      });
    }
  }
}
