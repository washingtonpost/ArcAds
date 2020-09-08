import { MobileDetection } from './util/mobile';
import { fetchBids, initializeBiddingServices } from './services/headerbidding';
import { initializeGPT, queueGoogletagCommand, refreshSlot, dfpSettings, setTargeting, determineSlotName } from './services/gpt';
import { queuePrebidCommand, addUnit } from './services/prebid';
import { prepareSizeMaps, setResizeListener } from './services/sizemapping';

function getArrayDepth(array) {
  return Array.isArray(array)
    ? 1 + Math.max(...array.map(child => getArrayDepth(child)))
    : 0;
}

/** @desc Displays an advertisement from Google DFP with optional support for Prebid.js and Amazon TAM/A9. **/
export class ArcAds {
  constructor(options, handleSlotRendered = null) {
    this.dfpId = options.dfp.id || '';
    this.wrapper = options.bidding || {};
    this.positions = [];
    this.collapseEmptyDivs = options.dfp.collapseEmptyDivs;
    this.adsList = [];

    window.isMobile = MobileDetection;

    if (this.dfpId === '') {
      console.warn(
        'ArcAds: DFP id is missing from the arcads initialization script.',
        '\n',
        'Documentation: https://github.com/wapopartners/arc-ads#getting-started'
      );
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
    const { id, slotName, dimensions, adType = false, targeting = {}, display = 'all', bidding = false, iframeBidders = ['openx'], others = {} } = params;
    const flatDimensions = [];
    let processDisplayAd = false;
    const dimensionsDepth = getArrayDepth(dimensions);
    console.log('dimensions =',dimensions, ', depth = ', dimensionsDepth);

    if (dimensions && typeof dimensions !== 'undefined' && dimensionsDepth === 1) {
      flatDimensions.push(...dimensions);
    } else if (dimensions && typeof dimensions !== 'undefined' && dimensions.length > 0 && dimensionsDepth === 2) {
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
          queuePrebidCommand.bind(this, addUnit(code, flatDimensions, bidding.prebid.bids, this.wrapper.prebid, others));
        }

        processDisplayAd = this.displayAd.bind(this, params);
        console.log('processDisplayAd ', this.displayAd.bind);
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
  * @desc Registers a collection of advertisements as single prebid and ad calls
  * @param {array} collection - An array containing a list of objects containing advertisement data.
  **/
  registerAdCollectionSingleCall(collection, bidderTimeout = 700) {
    window.blockArcAdsLoad = true;
    window.blockArcAdsPrebid = true;

    collection.forEach((advert) => {
      this.registerAd(advert);
    });

    window.blockArcAdsLoad = false;
    window.blockArcAdsPrebid = false;

    window.googletag.pubads().refresh(window.adsList);
    window.adsList = [];

    //prebid call
    pbjs.requestBids({
      timeout: bidderTimeout,
      //adUnitCodes: codes,
      bidsBackHandler: (result) => {
        console.log('Bid Back Handler', result);
        pbjs.setTargetingForGPTAsync();

        //ads call
        window.googletag.pubads().refresh();
      }
    });
  }


  /**
  * @desc Sets blockArcAdsLoad to be true - stops Ad Calls from going out,
  * allowing ads to be saved up for a single ad call to be sent out later.
  **/
  static setAdsBlockGate() {
    if (typeof window !== 'undefined') {
      window.blockArcAdsLoad = true;
    }
  }

  /**
  * @desc Sets blockArcAdsLoad to be true - stops Ad Calls from going out,
  * allowing ads to be saved up for a single ad call to be sent out later.
  **/
  static releaseAdsBlockGate() {
    if (typeof window !== 'undefined') {
      window.blockArcAdsLoad = false;
    }
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

    if (window.adsList && ad) {
      adsList.push(ad);
    }

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
    } else if (!window.blockArcAdsPrebid) {
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

  /**
  * @desc Send out ads that have been accumulated for the SRA
  **/
  sendSingleCallAds(bidderTimeout = 700) {
    // if no ads have been accumulated to send out together
    // do nothing, return
    if (this.adsList && this.adsList.length < 1) {
      return;
    }

    //ensure library is present and able to send out SRA ads
    if (window && window.googletag && googletag.pubadsReady) { // eslint-disable-line
      window.googletag.pubads().disableInitialLoad();
      window.googletag.pubads().enableSingleRequest();
      window.googletag.pubads().enableAsyncRendering();

      this.registerAdCollectionSingleCall(this.adsList, bidderTimeout);
    } else {
      setTimeout(() => {
        this.sendSingleCallAds();
      }, 2000);
    }
  }

  /**
   * Append this ad information to the list of ads
   * to be sent out as part of the singleAdCall
   *
   * @param {Object} params the ad parameters
   */
  reserveAd(params) {
    ArcAds.setAdsBlockGate();
    this.adsList.push(params);
  }

  /**
   * Page level targeting - any targeting set
   * using this function will apply to all
   * ads on the page. This is useful for SRA to
   * reduce request length.
   *
   * @param {string} key Targeting parameter key.
   * * @param {string} value Targeting parameter value or array of values.
   */
  setPageLeveTargeting(key, value) { //TODO check for pubads
    googletag.pubads().setTargeting(key, value);
  }
}
