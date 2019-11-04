(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initializeGPT = initializeGPT;
exports.refreshSlot = refreshSlot;
exports.queueGoogletagCommand = queueGoogletagCommand;
exports.setTargeting = setTargeting;
exports.dfpSettings = dfpSettings;
exports.determineSlotName = determineSlotName;

var _resources = __webpack_require__(5);

var _query = __webpack_require__(6);

/**
* @desc Initializes the Google Publisher tag scripts.
**/
function initializeGPT() {
  window.googletag = window.googletag || {};
  window.googletag.cmd = window.googletag.cmd || [];

  (0, _resources.appendResource)('script', '//www.googletagservices.com/tag/js/gpt.js', true, true);
}

/**
* @desc Refreshes an advertisement via the GPT refresh method. If a prerender function is provided it is executed prior to the refresh.
* @param {object} obj - An object containing all of the function arguments.
* @param {Object} obj.ad - An object containing the GPT ad slot.
* @param {boolean} obj.correlator - An optional boolean that describes if the correlator value should update or not.
* @param {function} obj.prerender - An optional function that will run before the advertisement renders.
* @param {object} obj.info - An object containing information about the advertisement that is about to load.
**/
function refreshSlot(_ref) {
  var ad = _ref.ad,
      _ref$correlator = _ref.correlator,
      correlator = _ref$correlator === undefined ? false : _ref$correlator,
      _ref$prerender = _ref.prerender,
      prerender = _ref$prerender === undefined ? null : _ref$prerender,
      _ref$info = _ref.info,
      info = _ref$info === undefined ? {} : _ref$info;

  new Promise(function (resolve) {
    if (prerender) {
      try {
        prerender(info).then(function () {
          resolve('Prerender function has completed.');
        });
      } catch (error) {
        console.warn('ArcAds: Prerender function did not return a promise or there was an error.\n          Documentation: https://github.com/wapopartners/arc-ads/wiki/Utilizing-a-Prerender-Hook');
        resolve('Prerender function did not return a promise or there was an error, ignoring.');
      }
    } else {
      resolve('No Prerender function was provided.');
    }
  }).then(function () {
    runRefreshEvent();
  });

  function runRefreshEvent() {
    if (window.blockArcAdsLoad) return;
    if (window.googletag && googletag.pubadsReady) {
      window.googletag.pubads().refresh([ad], { changeCorrelator: correlator });
    } else {
      setTimeout(function () {
        runRefreshEvent();
      }, 200);
    }
  }
}

/**
* @desc Queues a command inside of GPT.
* @param {function} fn - Accepts a function to push into the Prebid command queue.
**/
function queueGoogletagCommand(fn) {
  window.googletag.cmd.push(fn);
}

/**
* @desc Assigns key/value targeting to a specific advertisement.
* @param {Object} ad - An object containing the GPT ad slot.
* @param {Object} options - An object containing all of the key/value targeting pairs to assign to the advertisement.
**/
function setTargeting(ad, options) {
  for (var key in options) {
    if (options.hasOwnProperty(key) && options[key]) {
      ad.setTargeting(key, options[key]);
    }
  }
}

/**
* @desc Configures the GPT configuration options.
* @param {function} handleSlotRenderEnded - Callback function that gets fired whenever a GPT ad slot has finished rendering.
**/
function dfpSettings(handleSlotRenderEnded) {
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
function determineSlotName(dfpCode, slotName) {
  var slotOverride = (0, _query.expandQueryString)('adslot');
  if (slotOverride && (slotOverride !== '' || slotOverride !== null)) {
    return '/' + dfpCode + '/' + slotOverride;
  }
  return '/' + dfpCode + '/' + slotName;
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initializeBiddingServices = initializeBiddingServices;
exports.fetchBids = fetchBids;

var _prebid = __webpack_require__(2);

var _amazon = __webpack_require__(7);

var _gpt = __webpack_require__(0);

/**
* @desc Initializes all header bidding services and appends the applicable scripts to the page.
* @param {object} obj - An object containing all of the function arguments.
* @param {object} obj.prebid - An object containing configuration data for Prebid.js.
* @param {object} obj.amazon - An object containing configuration data for Amazon A9 and TAM.
**/
function initializeBiddingServices(_ref) {
  var _ref$prebid = _ref.prebid,
      prebid = _ref$prebid === undefined ? false : _ref$prebid,
      _ref$amazon = _ref.amazon,
      amazon = _ref$amazon === undefined ? false : _ref$amazon;

  if (window.arcBiddingReady) {
    return;
  }

  window.arcBiddingReady = false;

  var enablePrebid = new Promise(function (resolve) {
    if (prebid && prebid.enabled) {
      if (typeof pbjs === 'undefined') {
        var _pbjs = _pbjs || {};
        _pbjs.que = _pbjs.que || [];
      }
      resolve('Prebid has been initialized');
    } else {
      resolve('Prebid is not enabled on the wrapper...');
    }
  });

  var enableAmazon = new Promise(function (resolve) {
    if (amazon && amazon.enabled && window.apstag) {
      if (amazon.id && amazon.id !== '') {
        (0, _amazon.queueAmazonCommand)(function () {
          // Initializes the Amazon APS tag script.
          window.apstag.init({
            pubID: amazon.id,
            adServer: 'googletag'
          });

          resolve('Amazon scripts have been added onto the page!');
        });
      } else {
        console.warn('ArcAds: Missing Amazon account id. \n          Documentation: https://github.com/wapopartners/arc-ads#amazon-tama9');
        resolve('Amazon is not enabled on the wrapper...');
      }
    } else {
      resolve('Amazon is not enabled on the wrapper...');
    }
  });

  // Waits for all header bidding services to be initialized before telling the service it's ready to retrieve bids.
  Promise.all([enablePrebid, enableAmazon]).then(function () {
    window.arcBiddingReady = true;
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
function fetchBids(_ref2) {
  var _this = this;

  var ad = _ref2.ad,
      id = _ref2.id,
      slotName = _ref2.slotName,
      dimensions = _ref2.dimensions,
      wrapper = _ref2.wrapper,
      bidding = _ref2.bidding,
      _ref2$correlator = _ref2.correlator,
      correlator = _ref2$correlator === undefined ? false : _ref2$correlator,
      prerender = _ref2.prerender,
      breakpoints = _ref2.breakpoints;

  var adInfo = {
    adUnit: ad,
    adSlot: slotName,
    adDimensions: dimensions,
    adId: id,
    bids: bidding
  };

  var prebidBids = new Promise(function (resolve) {
    if (wrapper.prebid && wrapper.prebid.enabled) {
      var timeout = wrapper.prebid.timeout || 700;
      _prebid.queuePrebidCommand.bind(_this, (0, _prebid.fetchPrebidBids)(ad, wrapper.prebid.useSlotForAdUnit ? slotName : id, timeout, adInfo, prerender, function () {
        resolve('Fetched Prebid ads!');
      }));
    } else {
      resolve('Prebid is not enabled on the wrapper...');
    }
  });

  var amazonBids = new Promise(function (resolve) {
    if (wrapper.amazon && wrapper.amazon.enabled) {
      (0, _amazon.fetchAmazonBids)(id, slotName, dimensions, breakpoints, function () {
        resolve('Fetched Amazon ads!');
      });
    } else {
      resolve('Amazon is not enabled on the wrapper...');
    }
  });

  if (window.arcBiddingReady) {
    Promise.all([prebidBids, amazonBids]).then(function () {
      (0, _gpt.refreshSlot)({
        ad: ad,
        correlator: correlator,
        prerender: prerender,
        info: adInfo
      });
    });
  } else {
    setTimeout(function () {
      return initializeBiddingServices();
    }, 200);
  }
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.queuePrebidCommand = queuePrebidCommand;
exports.fetchPrebidBids = fetchPrebidBids;
exports.addUnit = addUnit;

var _gpt = __webpack_require__(0);

/**
 * @desc Queues a command inside of Prebid.js
 * @param {function} fn - Accepts a function to push into the Prebid command queue.
 **/
function queuePrebidCommand(fn) {
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
function fetchPrebidBids(ad, code, timeout, info, prerender) {
  var cb = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;

  pbjs.addAdUnits(info);
  pbjs.requestBids({
    timeout: timeout,
    adUnitCodes: [code],
    bidsBackHandler: function bidsBackHandler(result) {
      console.log('Bid Back Handler', result);
      pbjs.setTargetingForGPTAsync([code]);
      if (cb) {
        cb();
      } else {
        (0, _gpt.refreshSlot)({ ad: ad, info: info, prerender: prerender });
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
 **/
function addUnit(code, sizes, bids) {
  var wrapper = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  // Formats the add unit for prebid..
  var slot = { code: code, bids: bids };
  slot.mediaTypes = { banner: { sizes: sizes } };
  var sizeConfig = wrapper.sizeConfig,
      config = wrapper.config;


  pbjs.addAdUnits(slot);

  if (config) {
    pbjs.setConfig(config);
    return;
  }

  if (sizeConfig) {
    pbjs.setConfig({ sizeConfig: sizeConfig });
  }
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ArcAds = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mobile = __webpack_require__(4);

var _headerbidding = __webpack_require__(1);

var _gpt = __webpack_require__(0);

var _prebid = __webpack_require__(2);

var _sizemapping = __webpack_require__(8);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** @desc Displays an advertisement from Google DFP with optional support for Prebid.js and Amazon TAM/A9. **/
var ArcAds = exports.ArcAds = function () {
  function ArcAds(options) {
    var handleSlotRendered = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    _classCallCheck(this, ArcAds);

    this.dfpId = options.dfp.id || '';
    this.wrapper = options.bidding || {};
    this.positions = [];
    this.collapseEmptyDivs = options.dfp.collapseEmptyDivs;

    window.isMobile = _mobile.MobileDetection;

    if (this.dfpId === '') {
      console.warn('ArcAds: DFP id is missing from the arcads initialization script. \n        Documentation: https://github.com/wapopartners/arc-ads#getting-started');
    } else {
      (0, _gpt.initializeGPT)();
      (0, _gpt.queueGoogletagCommand)(_gpt.dfpSettings.bind(this, handleSlotRendered));
      (0, _headerbidding.initializeBiddingServices)(this.wrapper);
    }
  }

  /**
  * @desc Registers an advertisement in the service.
  * @param {object} params - An object containing all of the advertisement configuration settings such as slot name, id, and position.
  **/


  _createClass(ArcAds, [{
    key: 'registerAd',
    value: function registerAd(params) {
      var id = params.id,
          slotName = params.slotName,
          dimensions = params.dimensions,
          _params$adType = params.adType,
          adType = _params$adType === undefined ? false : _params$adType,
          _params$targeting = params.targeting,
          targeting = _params$targeting === undefined ? {} : _params$targeting,
          _params$display = params.display,
          display = _params$display === undefined ? 'all' : _params$display,
          _params$bidding = params.bidding,
          bidding = _params$bidding === undefined ? false : _params$bidding,
          _params$iframeBidders = params.iframeBidders,
          iframeBidders = _params$iframeBidders === undefined ? ['openx'] : _params$iframeBidders;

      var flatDimensions = [];
      var processDisplayAd = false;

      if (dimensions && typeof dimensions !== 'undefined' && typeof dimensions[0] === 'number') {
        flatDimensions.push.apply(flatDimensions, _toConsumableArray(dimensions));
      } else if (dimensions && typeof dimensions !== 'undefined' && dimensions.length > 0 && dimensions[0][0][0] === undefined) {
        flatDimensions.push.apply(flatDimensions, _toConsumableArray(dimensions));
      } else if (dimensions) {
        dimensions.forEach(function (set) {
          flatDimensions.push.apply(flatDimensions, _toConsumableArray(set));
        });
      }

      try {
        /* If positional targeting doesn't exist it gets assigned a numeric value
          based on the order and type of the advertisement. This logic is skipped if adType is not defined. */
        if ((!targeting || !targeting.hasOwnProperty('position')) && adType !== false) {
          var position = this.positions[adType] + 1 || 1;
          this.positions[adType] = position;

          var positionParam = Object.assign(targeting, { position: position });
          Object.assign(params, { targeting: positionParam });
        }

        if (isMobile.any() && display === 'mobile' || !isMobile.any() && display === 'desktop' || display === 'all') {
          // Registers the advertisement with Prebid.js if enabled on both the unit and wrapper.
          if (bidding.prebid && bidding.prebid.bids && this.wrapper.prebid && this.wrapper.prebid.enabled && flatDimensions) {
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
            var code = this.wrapper.prebid.useSlotForAdUnit ? (0, _gpt.determineSlotName)(this.dfpId, slotName) : id;
            _prebid.queuePrebidCommand.bind(this, (0, _prebid.addUnit)(code, flatDimensions, bidding.prebid.bids, this.wrapper.prebid));
          }

          processDisplayAd = this.displayAd.bind(this, params);
          if (processDisplayAd) {
            (0, _gpt.queueGoogletagCommand)(processDisplayAd);
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

  }, {
    key: 'registerAdCollection',
    value: function registerAdCollection(collection) {
      var _this = this;

      collection.forEach(function (advert) {
        _this.registerAd(advert);
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

  }, {
    key: 'displayAd',
    value: function displayAd(_ref) {
      var id = _ref.id,
          slotName = _ref.slotName,
          dimensions = _ref.dimensions,
          targeting = _ref.targeting,
          _ref$sizemap = _ref.sizemap,
          sizemap = _ref$sizemap === undefined ? false : _ref$sizemap,
          _ref$bidding = _ref.bidding,
          bidding = _ref$bidding === undefined ? false : _ref$bidding,
          _ref$prerender = _ref.prerender,
          prerender = _ref$prerender === undefined ? null : _ref$prerender;

      var fullSlotName = (0, _gpt.determineSlotName)(this.dfpId, slotName);
      var parsedDimensions = dimensions && !dimensions.length ? null : dimensions;
      var ad = !dimensions ? window.googletag.defineOutOfPageSlot(fullSlotName, id) : window.googletag.defineSlot(fullSlotName, parsedDimensions, id);

      if (sizemap && sizemap.breakpoints && dimensions) {
        var _prepareSizeMaps = (0, _sizemapping.prepareSizeMaps)(parsedDimensions, sizemap.breakpoints),
            mapping = _prepareSizeMaps.mapping,
            breakpoints = _prepareSizeMaps.breakpoints,
            correlators = _prepareSizeMaps.correlators;

        if (ad) {
          ad.defineSizeMapping(mapping);
        } else {
          return false;
        }

        if (sizemap.refresh) {
          (0, _sizemapping.setResizeListener)({
            ad: ad,
            slotName: fullSlotName,
            breakpoints: breakpoints,
            id: id,
            mapping: mapping,
            correlators: correlators,
            bidding: bidding,
            wrapper: this.wrapper,
            prerender: prerender
          });
        }
      }

      if (ad) {
        ad.addService(window.googletag.pubads());
        (0, _gpt.setTargeting)(ad, targeting);
      }

      var safebreakpoints = sizemap && sizemap.breakpoints ? sizemap.breakpoints : [];

      if (dimensions && bidding && (bidding.amazon && bidding.amazon.enabled || bidding.prebid && bidding.prebid.enabled)) {
        (0, _headerbidding.fetchBids)({
          ad: ad,
          id: id,
          slotName: fullSlotName,
          dimensions: parsedDimensions,
          wrapper: this.wrapper,
          prerender: prerender,
          bidding: bidding,
          breakpoints: safebreakpoints
        });
      } else {
        (0, _gpt.refreshSlot)({
          ad: ad,
          prerender: prerender,
          info: {
            adUnit: ad,
            adSlot: fullSlotName,
            adDimensions: parsedDimensions,
            adId: id
          }
        });
      }
    }
  }]);

  return ArcAds;
}();

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** @desc Utility class that determines the end user's browser user agent. **/
var MobileDetection = exports.MobileDetection = function () {
  function MobileDetection() {
    _classCallCheck(this, MobileDetection);
  }

  _createClass(MobileDetection, null, [{
    key: "Android",

    /**
    * @desc Determines if the user is using an Android device.
    **/
    value: function Android() {
      return !!navigator.userAgent.match(/Android/i);
    }

    /**
    * @desc Determines if the user is using an old Android device.
    **/

  }, {
    key: "AndroidOld",
    value: function AndroidOld() {
      return !!navigator.userAgent.match(/Android 2.3.3/i);
    }

    /**
    * @desc Determines if the user is using an Android tablet device.
    **/

  }, {
    key: "AndroidTablet",
    value: function AndroidTablet() {
      return !!(navigator.userAgent.match(/Android/i) && !navigator.userAgent.match(/Mobile/i));
    }

    /**
    * @desc Determines if the user is using a Kindle.
    **/

  }, {
    key: "Kindle",
    value: function Kindle() {
      return !!navigator.userAgent.match(/Kindle/i);
    }

    /**
    * @desc Determines if the user is using a Kindle Fire.
    **/

  }, {
    key: "KindleFire",
    value: function KindleFire() {
      return !!navigator.userAgent.match(/KFOT/i);
    }

    /**
    * @desc Determines if the user is using Silk.
    **/

  }, {
    key: "Silk",
    value: function Silk() {
      return !!navigator.userAgent.match(/Silk/i);
    }

    /**
    * @desc Determines if the user is using a BlackBerry device
    **/

  }, {
    key: "BlackBerry",
    value: function BlackBerry() {
      return !!navigator.userAgent.match(/BlackBerry/i);
    }

    /**
    * @desc Determines if the user is using an iOS device.
    **/

  }, {
    key: "iOS",
    value: function iOS() {
      return !!navigator.userAgent.match(/iPhone|iPad|iPod/i);
    }

    /**
    * @desc Determines if the user is using an iPhone or iPod.
    **/

  }, {
    key: "iPhone",
    value: function iPhone() {
      return !!navigator.userAgent.match(/iPhone|iPod/i);
    }

    /**
    * @desc Determines if the user is using an iPad.
    **/

  }, {
    key: "iPad",
    value: function iPad() {
      return !!navigator.userAgent.match(/iPad/i);
    }

    /**
    * @desc Determines if the user is using a Windows Mobile device.
    **/

  }, {
    key: "Windows",
    value: function Windows() {
      return !!navigator.userAgent.match(/IEMobile/i);
    }

    /**
    * @desc Determines if the user is using FireFoxOS.
    **/

  }, {
    key: "FirefoxOS",
    value: function FirefoxOS() {
      return !!navigator.userAgent.match(/Mozilla/i) && !!navigator.userAgent.match(/Mobile/i);
    }

    /**
    * @desc Determines if the user is using a Retina display.
    **/

  }, {
    key: "Retina",
    value: function Retina() {
      return window.retina || window.devicePixelRatio > 1;
    }

    /**
    * @desc Determines if the user is using any type of mobile device.
    **/

  }, {
    key: "any",
    value: function any() {
      return this.Android() || this.Kindle() || this.KindleFire() || this.Silk() || this.BlackBerry() || this.iOS() || this.Windows() || this.FirefoxOS();
    }
  }]);

  return MobileDetection;
}();

exports.default = MobileDetection;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.appendResource = appendResource;
/**
* @desc Appends a remote resource to the page within a HTML tag.
* @param {string} tagname - A string containing the type of HTML tag that should be appended.
* @param {string} url - A string containing the path of the resource.
* @param {boolean} async - A boolean representing if the resource should be loaded asynchronously or not.
* @param {boolean} defer - A boolean representing if the resource should be deferred or not.
* @param {function} cb - An optional callback function that should fire whenever the resource has been appended.
**/
function appendResource(tagname, url, async, defer, cb) {
  var tag = document.createElement(tagname);
  if (tagname === 'script') {
    tag.src = url;
    tag.async = async || false;
    tag.defer = async || defer || false;
  } else {
    return;
  }
  (document.head || document.documentElement).appendChild(tag);

  if (cb) {
    cb();
  }
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.expandQueryString = expandQueryString;
/**
* @desc Accepts a key as a string and returns the value of a query parameter on the page request.
* @param {string} param - A string that represents the key of a query paramter, for example 'adslot' will return 'hello' if the url has '?adslot=hello' at the end of it.
* @return - Returns a string containing the value of a query paramter.
**/
function expandQueryString(param) {
  var url = window.location.href;
  var name = param.replace(/[[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  var results = regex.exec(url);

  if (!results) {
    return null;
  }

  if (!results[2]) {
    return '';
  }
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchAmazonBids = fetchAmazonBids;
exports.queueAmazonCommand = queueAmazonCommand;
/**
* @desc Fetches a bid for an advertisement based on which services are enabled on unit and the wrapper.
* @param {string} id - A string containing the advertisement id corresponding to the div the advertisement will load into.
* @param {string} slotName - A string containing the slot name of the advertisement, for instance '1234/adn.com/homepage'.
* @param {array} dimensions - An array containing all of the applicable sizes the advertisement can use.
* @param {function} cb - An optional callback function that should fire whenever the bidding has concluded.
**/
function fetchAmazonBids(id, slotName, dimensions, breakpoints) {
  var cb = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

  // pass in breakpoints array
  var sizeArray = dimensions;

  if (breakpoints && typeof window.innerWidth !== 'undefined' && dimensions[0][0][0] !== undefined) {
    var viewPortWidth = window.innerWidth;
    var useIndex = -1;
    var breakpointsLength = breakpoints.length;

    for (var ind = 0; ind < breakpointsLength; ind++) {
      if (viewPortWidth >= breakpoints[ind][0]) {
        useIndex = ind;
        break;
      }
    }

    sizeArray = dimensions[useIndex];
  }

  queueAmazonCommand(function () {
    var slot = {
      slotName: slotName,
      slotID: id,
      sizes: sizeArray
    };

    // Retrieves the bid from Amazon
    window.apstag.fetchBids({ slots: [slot] }, function () {
      // Sets the targeting values on the display bid from apstag
      window.apstag.setDisplayBids();
      if (cb) {
        cb();
      }
    });
  });
}

/**
* @desc Adds an Amazon command to a callback queue which awaits for window.apstag
* @param {string} cmd - The function that should wait for window.apstag to be ready.
**/
function queueAmazonCommand(cmd) {
  if (window.apstag) {
    cmd();
  }
}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resizeListeners = exports.sizemapListeners = undefined;
exports.prepareSizeMaps = prepareSizeMaps;
exports.parseSizeMappings = parseSizeMappings;
exports.runResizeEvents = runResizeEvents;
exports.setResizeListener = setResizeListener;

var _debounce = __webpack_require__(9);

var _headerbidding = __webpack_require__(1);

var _gpt = __webpack_require__(0);

/** @desc An object containing all of the size map refresh event listeners and correlators for size mapping. **/
var sizemapListeners = exports.sizemapListeners = {};

/** @desc An object containing all of the screen resize event listeners for size mapping. **/
var resizeListeners = exports.resizeListeners = {};

/**
* @desc Prepares a set of dimensions and their corresponding breakpoints to create a sizemap which is readable by GPT.
* @param {array} dimensions - An array containing all of the applicable sizes the advertisement can use.
* @param {array} sizemap - An array containing all of the applicable breakpoints for the sizemapping.
**/
function prepareSizeMaps(dimensions, sizemap) {
  var mapping = [];
  var breakpoints = [];
  var correlators = [];
  var parsedSizemap = !sizemap.length ? null : sizemap;

  parsedSizemap.forEach(function (value, index) {
    mapping.push([value, dimensions[index]]);

    // Filters duplicates from the mapping
    if (breakpoints.indexOf(value[0]) === -1) {
      breakpoints.push(value[0]);
      correlators.push(false);
    }
  });

  breakpoints.sort(function (a, b) {
    return a - b;
  });

  return { mapping: mapping, breakpoints: breakpoints, correlators: correlators };
}

/**
* @desc Determines which set of ad sizes are about to display based on the users current screen size.
* @param {array} sizeMappings - An array containing the advertisements GPT readable size mapping.
* @return {array} - Returns an array containing the ad sizes which relate to the users current window width.
**/
function parseSizeMappings(sizeMappings) {
  try {
    var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

    var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    var sd = [width, height];

    /* Filters mappings that are valid by confirming that the current screen dimensions
      are both greater than or equal to the breakpoint [x, y] minimums specified in the first position in the mapping.
      Returns the leftmost mapping's sizes or an empty array. */
    var validMappings = sizeMappings.filter(function (mapping) {
      return mapping[0][0] <= sd[0] && mapping[0][1] <= sd[1];
    });

    var result = validMappings.length > 0 ? validMappings[0][1] : [];

    if (result.length > 0 && result[0].constructor !== Array) {
      // Wraps the 1D array in another set of brackets to make it 2D
      result = [result];
    }

    return result;
  } catch (e) {
    // Fallback to last size mapping supplied if there's an invalid mapping provided
    return sizeMappings[sizeMappings.length - 1][1];
  }
}

/**
* @desc Resize event that checks if a user has resized past a breakpoint included in the advertisements sizemap. If it has the GPT
* refresh method is called so the service can fetch a more apropriately sized creative.
* @param {object} params - An object containing all of the advertisement configuration settings such as slot name, id, and position.
**/
function runResizeEvents(params) {
  var lastBreakpoint = void 0;
  var initialLoad = false;

  return function () {
    var ad = params.ad,
        breakpoints = params.breakpoints,
        id = params.id,
        bidding = params.bidding,
        mapping = params.mapping,
        slotName = params.slotName,
        wrapper = params.wrapper,
        prerender = params.prerender;


    var width = window.innerWidth;
    var breakpoint = void 0;
    var nextBreakpoint = void 0;

    for (var i = 0; i < breakpoints.length; i++) {
      breakpoint = breakpoints[i];
      nextBreakpoint = breakpoints[i + 1];

      if (width > breakpoint && (width < nextBreakpoint || !nextBreakpoint) && lastBreakpoint !== breakpoint || width === breakpoint && !initialLoad) {
        lastBreakpoint = breakpoint;
        initialLoad = true;

        // Fetches a set of dimensions for the ad which is about to display.
        var parsedSizeMapping = parseSizeMappings(mapping);

        var adInfo = {
          adUnit: ad,
          adSlot: slotName,
          adDimensions: parsedSizeMapping,
          adId: id
        };

        // If it's included in a header-bidding service we re-fetch bids for the given slot, otherwise it refreshes as normal.
        if (bidding.prebid && bidding.prebid.enabled || bidding.amazon && bidding.amazon.enabled) {
          (0, _headerbidding.fetchBids)({
            ad: ad,
            id: id,
            slotName: slotName,
            dimensions: parsedSizeMapping,
            bidding: bidding,
            wrapper: wrapper,
            prerender: prerender,
            correlator: sizemapListeners[id].correlators[i],
            breakpoints: breakpoints
          });
        } else {
          (0, _gpt.refreshSlot)({
            ad: ad,
            correlator: sizemapListeners[id].correlators[i],
            prerender: prerender,
            info: adInfo
          });
        }
      }

      sizemapListeners[id].correlators[i] = true;
    }
  };
}

/**
* @desc Assigns an event listener for a size mapped ad which detects when the screen resizes past a breakpoint in the sizemap.
* Also stores the event listener in an object sorted by the advertisement id so it can be unbound later if needed.
* @param {object} params - An object containing all of the advertisement configuration settings such as slot name, id, and position.
**/
function setResizeListener(params) {
  var id = params.id,
      correlators = params.correlators;


  resizeListeners[id] = (0, _debounce.debounce)(runResizeEvents(params), 250);
  window.addEventListener('resize', resizeListeners[id]);

  // Adds the listener to an object with the id as the key so we can unbind it later.
  sizemapListeners[id] = { listener: resizeListeners[id], correlators: correlators };
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.debounce = debounce;
/**
* @desc Debounces a function preventing it from running more then every so many milliseconds. Useful for scroll or resize handlers.
* @param {function} func - The function that should be debounced.
* @param {number} wait - The amount of time a function should wait before it fires again.
* @return - Returns a function every so many milliseconds based on the provided parameters.
**/
function debounce(func, wait) {
  var timeout = void 0;
  return function () {
    var _this = this;

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    clearTimeout(timeout);
    timeout = setTimeout(function () {
      timeout = null;
      func.apply(_this, args);
    }, wait);
  };
}

/***/ })
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCA4MmJiNDQ3ZTBiYTJmZGE4NWNmYiIsIndlYnBhY2s6Ly8vLi9zcmMvc2VydmljZXMvZ3B0LmpzIiwid2VicGFjazovLy8uL3NyYy9zZXJ2aWNlcy9oZWFkZXJiaWRkaW5nLmpzIiwid2VicGFjazovLy8uL3NyYy9zZXJ2aWNlcy9wcmViaWQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsL21vYmlsZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbC9yZXNvdXJjZXMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWwvcXVlcnkuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NlcnZpY2VzL2FtYXpvbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc2VydmljZXMvc2l6ZW1hcHBpbmcuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWwvZGVib3VuY2UuanMiXSwibmFtZXMiOlsiaW5pdGlhbGl6ZUdQVCIsInJlZnJlc2hTbG90IiwicXVldWVHb29nbGV0YWdDb21tYW5kIiwic2V0VGFyZ2V0aW5nIiwiZGZwU2V0dGluZ3MiLCJkZXRlcm1pbmVTbG90TmFtZSIsIndpbmRvdyIsImdvb2dsZXRhZyIsImNtZCIsImFkIiwiY29ycmVsYXRvciIsInByZXJlbmRlciIsImluZm8iLCJQcm9taXNlIiwicmVzb2x2ZSIsInRoZW4iLCJlcnJvciIsImNvbnNvbGUiLCJ3YXJuIiwicnVuUmVmcmVzaEV2ZW50IiwiYmxvY2tBcmNBZHNMb2FkIiwicHViYWRzUmVhZHkiLCJwdWJhZHMiLCJyZWZyZXNoIiwiY2hhbmdlQ29ycmVsYXRvciIsInNldFRpbWVvdXQiLCJmbiIsInB1c2giLCJvcHRpb25zIiwia2V5IiwiaGFzT3duUHJvcGVydHkiLCJoYW5kbGVTbG90UmVuZGVyRW5kZWQiLCJkaXNhYmxlSW5pdGlhbExvYWQiLCJlbmFibGVTaW5nbGVSZXF1ZXN0IiwiZW5hYmxlQXN5bmNSZW5kZXJpbmciLCJjb2xsYXBzZUVtcHR5RGl2cyIsImVuYWJsZVNlcnZpY2VzIiwiYWRkRXZlbnRMaXN0ZW5lciIsImRmcENvZGUiLCJzbG90TmFtZSIsInNsb3RPdmVycmlkZSIsImluaXRpYWxpemVCaWRkaW5nU2VydmljZXMiLCJmZXRjaEJpZHMiLCJwcmViaWQiLCJhbWF6b24iLCJhcmNCaWRkaW5nUmVhZHkiLCJlbmFibGVQcmViaWQiLCJlbmFibGVkIiwicGJqcyIsInF1ZSIsImVuYWJsZUFtYXpvbiIsImFwc3RhZyIsImlkIiwiaW5pdCIsInB1YklEIiwiYWRTZXJ2ZXIiLCJhbGwiLCJkaW1lbnNpb25zIiwid3JhcHBlciIsImJpZGRpbmciLCJicmVha3BvaW50cyIsImFkSW5mbyIsImFkVW5pdCIsImFkU2xvdCIsImFkRGltZW5zaW9ucyIsImFkSWQiLCJiaWRzIiwicHJlYmlkQmlkcyIsInRpbWVvdXQiLCJxdWV1ZVByZWJpZENvbW1hbmQiLCJiaW5kIiwidXNlU2xvdEZvckFkVW5pdCIsImFtYXpvbkJpZHMiLCJmZXRjaFByZWJpZEJpZHMiLCJhZGRVbml0IiwiY29kZSIsImNiIiwiYWRkQWRVbml0cyIsInJlcXVlc3RCaWRzIiwiYWRVbml0Q29kZXMiLCJiaWRzQmFja0hhbmRsZXIiLCJyZXN1bHQiLCJsb2ciLCJzZXRUYXJnZXRpbmdGb3JHUFRBc3luYyIsInNpemVzIiwic2xvdCIsIm1lZGlhVHlwZXMiLCJiYW5uZXIiLCJzaXplQ29uZmlnIiwiY29uZmlnIiwic2V0Q29uZmlnIiwiQXJjQWRzIiwiaGFuZGxlU2xvdFJlbmRlcmVkIiwiZGZwSWQiLCJkZnAiLCJwb3NpdGlvbnMiLCJpc01vYmlsZSIsIk1vYmlsZURldGVjdGlvbiIsInBhcmFtcyIsImFkVHlwZSIsInRhcmdldGluZyIsImRpc3BsYXkiLCJpZnJhbWVCaWRkZXJzIiwiZmxhdERpbWVuc2lvbnMiLCJwcm9jZXNzRGlzcGxheUFkIiwibGVuZ3RoIiwidW5kZWZpbmVkIiwiZm9yRWFjaCIsInNldCIsInBvc2l0aW9uIiwicG9zaXRpb25QYXJhbSIsIk9iamVjdCIsImFzc2lnbiIsImFueSIsInVzZXJTeW5jIiwiaWZyYW1lRW5hYmxlZCIsImZpbHRlclNldHRpbmdzIiwiaWZyYW1lIiwiYmlkZGVycyIsImZpbHRlciIsImRpc3BsYXlBZCIsImVyciIsImNvbGxlY3Rpb24iLCJhZHZlcnQiLCJyZWdpc3RlckFkIiwic2l6ZW1hcCIsImZ1bGxTbG90TmFtZSIsInBhcnNlZERpbWVuc2lvbnMiLCJkZWZpbmVPdXRPZlBhZ2VTbG90IiwiZGVmaW5lU2xvdCIsIm1hcHBpbmciLCJjb3JyZWxhdG9ycyIsImRlZmluZVNpemVNYXBwaW5nIiwiYWRkU2VydmljZSIsInNhZmVicmVha3BvaW50cyIsIm5hdmlnYXRvciIsInVzZXJBZ2VudCIsIm1hdGNoIiwicmV0aW5hIiwiZGV2aWNlUGl4ZWxSYXRpbyIsIkFuZHJvaWQiLCJLaW5kbGUiLCJLaW5kbGVGaXJlIiwiU2lsayIsIkJsYWNrQmVycnkiLCJpT1MiLCJXaW5kb3dzIiwiRmlyZWZveE9TIiwiYXBwZW5kUmVzb3VyY2UiLCJ0YWduYW1lIiwidXJsIiwiYXN5bmMiLCJkZWZlciIsInRhZyIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInNyYyIsImhlYWQiLCJkb2N1bWVudEVsZW1lbnQiLCJhcHBlbmRDaGlsZCIsImV4cGFuZFF1ZXJ5U3RyaW5nIiwicGFyYW0iLCJsb2NhdGlvbiIsImhyZWYiLCJuYW1lIiwicmVwbGFjZSIsInJlZ2V4IiwiUmVnRXhwIiwicmVzdWx0cyIsImV4ZWMiLCJkZWNvZGVVUklDb21wb25lbnQiLCJmZXRjaEFtYXpvbkJpZHMiLCJxdWV1ZUFtYXpvbkNvbW1hbmQiLCJzaXplQXJyYXkiLCJpbm5lcldpZHRoIiwidmlld1BvcnRXaWR0aCIsInVzZUluZGV4IiwiYnJlYWtwb2ludHNMZW5ndGgiLCJpbmQiLCJzbG90SUQiLCJzbG90cyIsInNldERpc3BsYXlCaWRzIiwicHJlcGFyZVNpemVNYXBzIiwicGFyc2VTaXplTWFwcGluZ3MiLCJydW5SZXNpemVFdmVudHMiLCJzZXRSZXNpemVMaXN0ZW5lciIsInNpemVtYXBMaXN0ZW5lcnMiLCJyZXNpemVMaXN0ZW5lcnMiLCJwYXJzZWRTaXplbWFwIiwidmFsdWUiLCJpbmRleCIsImluZGV4T2YiLCJzb3J0IiwiYSIsImIiLCJzaXplTWFwcGluZ3MiLCJ3aWR0aCIsImNsaWVudFdpZHRoIiwiYm9keSIsImhlaWdodCIsImlubmVySGVpZ2h0IiwiY2xpZW50SGVpZ2h0Iiwic2QiLCJ2YWxpZE1hcHBpbmdzIiwiY29uc3RydWN0b3IiLCJBcnJheSIsImUiLCJsYXN0QnJlYWtwb2ludCIsImluaXRpYWxMb2FkIiwiYnJlYWtwb2ludCIsIm5leHRCcmVha3BvaW50IiwiaSIsInBhcnNlZFNpemVNYXBwaW5nIiwibGlzdGVuZXIiLCJkZWJvdW5jZSIsImZ1bmMiLCJ3YWl0IiwiYXJncyIsImNsZWFyVGltZW91dCIsImFwcGx5Il0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTztBQ1ZBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7O1FDdkRnQkEsYSxHQUFBQSxhO1FBZUFDLFcsR0FBQUEsVztRQXdDQUMscUIsR0FBQUEscUI7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bUI7QUFBQTs7QUFBQSxzQ0FBTnFKLElBQU07QUFBTkEsVUFBTTtBQUFBOztBQUN4QkMsaUJBQWF0SixPQUFiO0FBQ0FBLGNBQVUzQyxXQUFXLFlBQU07QUFDekIyQyxnQkFBVSxJQUFWO0FBQ0FtSixXQUFLSSxLQUFMLENBQVcsS0FBWCxFQUFpQkYsSUFBakI7QUFDRCxLQUhTLEVBR1BELElBSE8sQ0FBVjtBQUlELEdBTkQ7QUFPRCxDIiwiZmlsZSI6ImFyY2Fkcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSB7XG5cdFx0dmFyIGEgPSBmYWN0b3J5KCk7XG5cdFx0Zm9yKHZhciBpIGluIGEpICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgPyBleHBvcnRzIDogcm9vdClbaV0gPSBhW2ldO1xuXHR9XG59KSh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgPyBzZWxmIDogdGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDMpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDgyYmI0NDdlMGJhMmZkYTg1Y2ZiIiwiaW1wb3J0IHsgYXBwZW5kUmVzb3VyY2UgfSBmcm9tICcuLi91dGlsL3Jlc291cmNlcyc7XG5pbXBvcnQgeyBleHBhbmRRdWVyeVN0cmluZyB9IGZyb20gJy4uL3V0aWwvcXVlcnknO1xuXG4vKipcbiogQGRlc2MgSW5pdGlhbGl6ZXMgdGhlIEdvb2dsZSBQdWJsaXNoZXIgdGFnIHNjcmlwdHMuXG4qKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0aWFsaXplR1BUKCkge1xuICB3aW5kb3cuZ29vZ2xldGFnID0gd2luZG93Lmdvb2dsZXRhZyB8fCB7fTtcbiAgd2luZG93Lmdvb2dsZXRhZy5jbWQgPSB3aW5kb3cuZ29vZ2xldGFnLmNtZCB8fCBbXTtcblxuICBhcHBlbmRSZXNvdXJjZSgnc2NyaXB0JywgJy8vd3d3Lmdvb2dsZXRhZ3NlcnZpY2VzLmNvbS90YWcvanMvZ3B0LmpzJywgdHJ1ZSwgdHJ1ZSk7XG59XG5cbi8qKlxuKiBAZGVzYyBSZWZyZXNoZXMgYW4gYWR2ZXJ0aXNlbWVudCB2aWEgdGhlIEdQVCByZWZyZXNoIG1ldGhvZC4gSWYgYSBwcmVyZW5kZXIgZnVuY3Rpb24gaXMgcHJvdmlkZWQgaXQgaXMgZXhlY3V0ZWQgcHJpb3IgdG8gdGhlIHJlZnJlc2guXG4qIEBwYXJhbSB7b2JqZWN0fSBvYmogLSBBbiBvYmplY3QgY29udGFpbmluZyBhbGwgb2YgdGhlIGZ1bmN0aW9uIGFyZ3VtZW50cy5cbiogQHBhcmFtIHtPYmplY3R9IG9iai5hZCAtIEFuIG9iamVjdCBjb250YWluaW5nIHRoZSBHUFQgYWQgc2xvdC5cbiogQHBhcmFtIHtib29sZWFufSBvYmouY29ycmVsYXRvciAtIEFuIG9wdGlvbmFsIGJvb2xlYW4gdGhhdCBkZXNjcmliZXMgaWYgdGhlIGNvcnJlbGF0b3IgdmFsdWUgc2hvdWxkIHVwZGF0ZSBvciBub3QuXG4qIEBwYXJhbSB7ZnVuY3Rpb259IG9iai5wcmVyZW5kZXIgLSBBbiBvcHRpb25hbCBmdW5jdGlvbiB0aGF0IHdpbGwgcnVuIGJlZm9yZSB0aGUgYWR2ZXJ0aXNlbWVudCByZW5kZXJzLlxuKiBAcGFyYW0ge29iamVjdH0gb2JqLmluZm8gLSBBbiBvYmplY3QgY29udGFpbmluZyBpbmZvcm1hdGlvbiBhYm91dCB0aGUgYWR2ZXJ0aXNlbWVudCB0aGF0IGlzIGFib3V0IHRvIGxvYWQuXG4qKi9cbmV4cG9ydCBmdW5jdGlvbiByZWZyZXNoU2xvdCh7XG4gIGFkLFxuICBjb3JyZWxhdG9yID0gZmFsc2UsXG4gIHByZXJlbmRlciA9IG51bGwsXG4gIGluZm8gPSB7fVxufSkge1xuICBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIGlmIChwcmVyZW5kZXIpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHByZXJlbmRlcihpbmZvKS50aGVuKCgpID0+IHtcbiAgICAgICAgICByZXNvbHZlKCdQcmVyZW5kZXIgZnVuY3Rpb24gaGFzIGNvbXBsZXRlZC4nKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLndhcm4oYEFyY0FkczogUHJlcmVuZGVyIGZ1bmN0aW9uIGRpZCBub3QgcmV0dXJuIGEgcHJvbWlzZSBvciB0aGVyZSB3YXMgYW4gZXJyb3IuXG4gICAgICAgICAgRG9jdW1lbnRhdGlvbjogaHR0cHM6Ly9naXRodWIuY29tL3dhcG9wYXJ0bmVycy9hcmMtYWRzL3dpa2kvVXRpbGl6aW5nLWEtUHJlcmVuZGVyLUhvb2tgKTtcbiAgICAgICAgcmVzb2x2ZSgnUHJlcmVuZGVyIGZ1bmN0aW9uIGRpZCBub3QgcmV0dXJuIGEgcHJvbWlzZSBvciB0aGVyZSB3YXMgYW4gZXJyb3IsIGlnbm9yaW5nLicpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXNvbHZlKCdObyBQcmVyZW5kZXIgZnVuY3Rpb24gd2FzIHByb3ZpZGVkLicpO1xuICAgIH1cbiAgfSkudGhlbigoKSA9PiB7XG4gICAgcnVuUmVmcmVzaEV2ZW50KCk7XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIHJ1blJlZnJlc2hFdmVudCgpIHtcbiAgICBpZiAod2luZG93LmJsb2NrQXJjQWRzTG9hZCkgcmV0dXJuO1xuICAgIGlmICh3aW5kb3cuZ29vZ2xldGFnICYmIGdvb2dsZXRhZy5wdWJhZHNSZWFkeSkge1xuICAgICAgd2luZG93Lmdvb2dsZXRhZy5wdWJhZHMoKS5yZWZyZXNoKFthZF0sIHsgY2hhbmdlQ29ycmVsYXRvcjogY29ycmVsYXRvciB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHJ1blJlZnJlc2hFdmVudCgpO1xuICAgICAgfSwgMjAwKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4qIEBkZXNjIFF1ZXVlcyBhIGNvbW1hbmQgaW5zaWRlIG9mIEdQVC5cbiogQHBhcmFtIHtmdW5jdGlvbn0gZm4gLSBBY2NlcHRzIGEgZnVuY3Rpb24gdG8gcHVzaCBpbnRvIHRoZSBQcmViaWQgY29tbWFuZCBxdWV1ZS5cbioqL1xuZXhwb3J0IGZ1bmN0aW9uIHF1ZXVlR29vZ2xldGFnQ29tbWFuZChmbikge1xuICB3aW5kb3cuZ29vZ2xldGFnLmNtZC5wdXNoKGZuKTtcbn1cblxuLyoqXG4qIEBkZXNjIEFzc2lnbnMga2V5L3ZhbHVlIHRhcmdldGluZyB0byBhIHNwZWNpZmljIGFkdmVydGlzZW1lbnQuXG4qIEBwYXJhbSB7T2JqZWN0fSBhZCAtIEFuIG9iamVjdCBjb250YWluaW5nIHRoZSBHUFQgYWQgc2xvdC5cbiogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBBbiBvYmplY3QgY29udGFpbmluZyBhbGwgb2YgdGhlIGtleS92YWx1ZSB0YXJnZXRpbmcgcGFpcnMgdG8gYXNzaWduIHRvIHRoZSBhZHZlcnRpc2VtZW50LlxuKiovXG5leHBvcnQgZnVuY3Rpb24gc2V0VGFyZ2V0aW5nKGFkLCBvcHRpb25zKSB7XG4gIGZvciAoY29uc3Qga2V5IGluIG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIG9wdGlvbnNba2V5XSkge1xuICAgICAgYWQuc2V0VGFyZ2V0aW5nKGtleSwgb3B0aW9uc1trZXldKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4qIEBkZXNjIENvbmZpZ3VyZXMgdGhlIEdQVCBjb25maWd1cmF0aW9uIG9wdGlvbnMuXG4qIEBwYXJhbSB7ZnVuY3Rpb259IGhhbmRsZVNsb3RSZW5kZXJFbmRlZCAtIENhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgZ2V0cyBmaXJlZCB3aGVuZXZlciBhIEdQVCBhZCBzbG90IGhhcyBmaW5pc2hlZCByZW5kZXJpbmcuXG4qKi9cbmV4cG9ydCBmdW5jdGlvbiBkZnBTZXR0aW5ncyhoYW5kbGVTbG90UmVuZGVyRW5kZWQpIHtcbiAgd2luZG93Lmdvb2dsZXRhZy5wdWJhZHMoKS5kaXNhYmxlSW5pdGlhbExvYWQoKTtcbiAgd2luZG93Lmdvb2dsZXRhZy5wdWJhZHMoKS5lbmFibGVTaW5nbGVSZXF1ZXN0KCk7XG4gIHdpbmRvdy5nb29nbGV0YWcucHViYWRzKCkuZW5hYmxlQXN5bmNSZW5kZXJpbmcoKTtcbiAgaWYgKHRoaXMuY29sbGFwc2VFbXB0eURpdnMpIHtcbiAgICB3aW5kb3cuZ29vZ2xldGFnLnB1YmFkcygpLmNvbGxhcHNlRW1wdHlEaXZzKCk7XG4gIH1cbiAgd2luZG93Lmdvb2dsZXRhZy5lbmFibGVTZXJ2aWNlcygpO1xuXG4gIGlmIChoYW5kbGVTbG90UmVuZGVyRW5kZWQpIHtcbiAgICB3aW5kb3cuZ29vZ2xldGFnLnB1YmFkcygpLmFkZEV2ZW50TGlzdGVuZXIoJ3Nsb3RSZW5kZXJFbmRlZCcsIGhhbmRsZVNsb3RSZW5kZXJFbmRlZCk7XG4gIH1cbn1cblxuLyoqXG4qIEBkZXNjIERldGVybWluZXMgdGhlIGZ1bGwgc2xvdCBuYW1lIG9mIHRoZSBhZCB1bml0LiBJZiBhIHVzZXIgYXBwZW5kcyBhbiAnYWRzbG90JyBxdWVyeSBwYXJhbWV0ZXIgdG8gdGhlIHBhZ2UgVVJMIHRoZSBzbG90IG5hbWUgd2lsbCBiZSB2ZXJyaWRkZW4uXG4qIEBwYXJhbSB7c3RyaW5nfSBkZnBDb2RlIC0gQSBzdHJpbmcgY29udGFpbmluZyB0aGUgcHVibGlzaGVycyBERlAgaWQgY29kZS5cbiogQHBhcmFtIHtzdHJpbmd9IHNsb3ROYW1lIC0gQSBzdHJpbmcgY29udGFpbmluZyB0aGUgc2xvdCBuYW1lIG9mIHRoZSBhZHZlcnRpc2VtZW50LCBmb3IgZXhhbXBsZSAnaG9tZXBhZ2UnLlxuKiBAcmV0dXJuIC0gUmV0dXJucyBhIHN0cmluZyBjb21iaW5pbmcgdGhlIERGUCBpZCBjb2RlIGFuZCB0aGUgc2xvdCBuYW1lLCBmb3IgZXhhbXBsZSAnMTIzL2hvbWVwYWdlJy5cbioqL1xuZXhwb3J0IGZ1bmN0aW9uIGRldGVybWluZVNsb3ROYW1lKGRmcENvZGUsIHNsb3ROYW1lKSB7XG4gIGNvbnN0IHNsb3RPdmVycmlkZSA9IGV4cGFuZFF1ZXJ5U3RyaW5nKCdhZHNsb3QnKTtcbiAgaWYgKHNsb3RPdmVycmlkZSAmJiAoc2xvdE92ZXJyaWRlICE9PSAnJyB8fCBzbG90T3ZlcnJpZGUgIT09IG51bGwpKSB7XG4gICAgcmV0dXJuIGAvJHtkZnBDb2RlfS8ke3Nsb3RPdmVycmlkZX1gO1xuICB9XG4gIHJldHVybiBgLyR7ZGZwQ29kZX0vJHtzbG90TmFtZX1gO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3NlcnZpY2VzL2dwdC5qcyIsImltcG9ydCB7IGZldGNoUHJlYmlkQmlkcywgcXVldWVQcmViaWRDb21tYW5kIH0gZnJvbSAnLi9wcmViaWQnO1xuaW1wb3J0IHsgZmV0Y2hBbWF6b25CaWRzLCBxdWV1ZUFtYXpvbkNvbW1hbmQgfSBmcm9tICcuL2FtYXpvbic7XG5pbXBvcnQgeyByZWZyZXNoU2xvdCB9IGZyb20gJy4vZ3B0JztcblxuLyoqXG4qIEBkZXNjIEluaXRpYWxpemVzIGFsbCBoZWFkZXIgYmlkZGluZyBzZXJ2aWNlcyBhbmQgYXBwZW5kcyB0aGUgYXBwbGljYWJsZSBzY3JpcHRzIHRvIHRoZSBwYWdlLlxuKiBAcGFyYW0ge29iamVjdH0gb2JqIC0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgYWxsIG9mIHRoZSBmdW5jdGlvbiBhcmd1bWVudHMuXG4qIEBwYXJhbSB7b2JqZWN0fSBvYmoucHJlYmlkIC0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgY29uZmlndXJhdGlvbiBkYXRhIGZvciBQcmViaWQuanMuXG4qIEBwYXJhbSB7b2JqZWN0fSBvYmouYW1hem9uIC0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgY29uZmlndXJhdGlvbiBkYXRhIGZvciBBbWF6b24gQTkgYW5kIFRBTS5cbioqL1xuZXhwb3J0IGZ1bmN0aW9uIGluaXRpYWxpemVCaWRkaW5nU2VydmljZXMoe1xuICBwcmViaWQgPSBmYWxzZSxcbiAgYW1hem9uID0gZmFsc2Vcbn0pIHtcbiAgaWYgKHdpbmRvdy5hcmNCaWRkaW5nUmVhZHkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB3aW5kb3cuYXJjQmlkZGluZ1JlYWR5ID0gZmFsc2U7XG5cbiAgY29uc3QgZW5hYmxlUHJlYmlkID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBpZiAocHJlYmlkICYmIHByZWJpZC5lbmFibGVkKSB7XG4gICAgICBpZiAodHlwZW9mIHBianMgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGNvbnN0IHBianMgPSBwYmpzIHx8IHt9O1xuICAgICAgICBwYmpzLnF1ZSA9IHBianMucXVlIHx8IFtdO1xuICAgICAgfVxuICAgICAgcmVzb2x2ZSgnUHJlYmlkIGhhcyBiZWVuIGluaXRpYWxpemVkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc29sdmUoJ1ByZWJpZCBpcyBub3QgZW5hYmxlZCBvbiB0aGUgd3JhcHBlci4uLicpO1xuICAgIH1cbiAgfSk7XG5cbiAgY29uc3QgZW5hYmxlQW1hem9uID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBpZiAoYW1hem9uICYmIGFtYXpvbi5lbmFibGVkICYmIHdpbmRvdy5hcHN0YWcpIHtcbiAgICAgIGlmIChhbWF6b24uaWQgJiYgYW1hem9uLmlkICE9PSAnJykge1xuICAgICAgICBxdWV1ZUFtYXpvbkNvbW1hbmQoKCkgPT4ge1xuICAgICAgICAgIC8vIEluaXRpYWxpemVzIHRoZSBBbWF6b24gQVBTIHRhZyBzY3JpcHQuXG4gICAgICAgICAgd2luZG93LmFwc3RhZy5pbml0KHtcbiAgICAgICAgICAgIHB1YklEOiBhbWF6b24uaWQsXG4gICAgICAgICAgICBhZFNlcnZlcjogJ2dvb2dsZXRhZydcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHJlc29sdmUoJ0FtYXpvbiBzY3JpcHRzIGhhdmUgYmVlbiBhZGRlZCBvbnRvIHRoZSBwYWdlIScpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUud2FybihgQXJjQWRzOiBNaXNzaW5nIEFtYXpvbiBhY2NvdW50IGlkLiBcbiAgICAgICAgICBEb2N1bWVudGF0aW9uOiBodHRwczovL2dpdGh1Yi5jb20vd2Fwb3BhcnRuZXJzL2FyYy1hZHMjYW1hem9uLXRhbWE5YCk7XG4gICAgICAgIHJlc29sdmUoJ0FtYXpvbiBpcyBub3QgZW5hYmxlZCBvbiB0aGUgd3JhcHBlci4uLicpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXNvbHZlKCdBbWF6b24gaXMgbm90IGVuYWJsZWQgb24gdGhlIHdyYXBwZXIuLi4nKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIFdhaXRzIGZvciBhbGwgaGVhZGVyIGJpZGRpbmcgc2VydmljZXMgdG8gYmUgaW5pdGlhbGl6ZWQgYmVmb3JlIHRlbGxpbmcgdGhlIHNlcnZpY2UgaXQncyByZWFkeSB0byByZXRyaWV2ZSBiaWRzLlxuICBQcm9taXNlLmFsbChbZW5hYmxlUHJlYmlkLCBlbmFibGVBbWF6b25dKVxuICAgIC50aGVuKCgpID0+IHtcbiAgICAgIHdpbmRvdy5hcmNCaWRkaW5nUmVhZHkgPSB0cnVlO1xuICAgIH0pO1xufVxuXG4vKipcbiogQGRlc2MgRmV0Y2hlcyBhIGJpZCBmb3IgYW4gYWR2ZXJ0aXNlbWVudCBiYXNlZCBvbiB3aGljaCBzZXJ2aWNlcyBhcmUgZW5hYmxlZCBvbiB1bml0IGFuZCB0aGUgd3JhcHBlci5cbiogQHBhcmFtIHtvYmplY3R9IG9iaiAtIEFuIG9iamVjdCBjb250YWluaW5nIGFsbCBvZiB0aGUgZnVuY3Rpb24gYXJndW1lbnRzLlxuKiBAcGFyYW0ge09iamVjdH0gb2JqLmFkIC0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIEdQVCBhZCBzbG90LlxuKiBAcGFyYW0ge3N0cmluZ30gb2JqLmlkIC0gQSBzdHJpbmcgY29udGFpbmluZyB0aGUgYWR2ZXJ0aXNlbWVudCBpZCBjb3JyZXNwb25kaW5nIHRvIHRoZSBkaXYgdGhlIGFkdmVydGlzZW1lbnQgd2lsbCBsb2FkIGludG8uXG4qIEBwYXJhbSB7c3RyaW5nfSBvYmouc2xvdE5hbWUgLSBBIHN0cmluZyBjb250YWluaW5nIHRoZSBzbG90IG5hbWUgb2YgdGhlIGFkdmVydGlzZW1lbnQsIGZvciBpbnN0YW5jZSAnMTIzNC9hZG4uY29tL2hvbWVwYWdlJy5cbiogQHBhcmFtIHtBcnJheX0gb2JqLmRpbWVuc2lvbnMgLSBBbiBhcnJheSBjb250YWluaW5nIGFsbCBvZiB0aGUgYXBwbGljYWJsZSBzaXplcyB0aGUgYWR2ZXJ0aXNlbWVudCBjYW4gdXNlLlxuKiBAcGFyYW0ge09iamVjdH0gb2JqLndyYXBwZXIgLSBBbiBvYmplY3QgY29udGFpbmluZyBhbGwgb2YgdGhlIHdyYXBwZXIgc2V0dGluZ3MuXG4qIEBwYXJhbSB7QXJyYXl9IG9iai5iaWRkaW5nIC0gQ29udGFpbnMgYWxsIG9mIHRoZSBhcHBsaWNhYmxlIGJpZCBkYXRhLCBzdWNoIGFzIHdoaWNoIHZlbmRvcnMgdG8gdXNlIGFuZCB0aGVpciBwbGFjZW1lbnQgaWRzLlxuKiBAcGFyYW0ge2Jvb2xlYW59IG9iai5jb3JyZWxhdG9yIC0gQW4gb3B0aW9uYWwgYm9vbGVhbiB0aGF0IGRlc2NyaWJlcyBpZiB0aGUgY29ycmVsYXRvciB2YWx1ZSBzaG91bGQgdXBkYXRlIG9yIG5vdC5cbiogQHBhcmFtIHtmdW5jdGlvbn0gb2JqLnByZXJlbmRlciAtIEFuIG9wdGlvbmFsIGZ1bmN0aW9uIHRoYXQgd2lsbCBydW4gYmVmb3JlIHRoZSBhZHZlcnRpc2VtZW50IHJlbmRlcnMuXG4qKi9cbmV4cG9ydCBmdW5jdGlvbiBmZXRjaEJpZHMoe1xuICBhZCxcbiAgaWQsXG4gIHNsb3ROYW1lLFxuICBkaW1lbnNpb25zLFxuICB3cmFwcGVyLFxuICBiaWRkaW5nLFxuICBjb3JyZWxhdG9yID0gZmFsc2UsXG4gIHByZXJlbmRlcixcbiAgYnJlYWtwb2ludHNcbn0pIHtcbiAgY29uc3QgYWRJbmZvID0ge1xuICAgIGFkVW5pdDogYWQsXG4gICAgYWRTbG90OiBzbG90TmFtZSxcbiAgICBhZERpbWVuc2lvbnM6IGRpbWVuc2lvbnMsXG4gICAgYWRJZDogaWQsXG4gICAgYmlkczogYmlkZGluZyxcbiAgfTtcblxuICBjb25zdCBwcmViaWRCaWRzID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBpZiAod3JhcHBlci5wcmViaWQgJiYgd3JhcHBlci5wcmViaWQuZW5hYmxlZCkge1xuICAgICAgY29uc3QgdGltZW91dCA9IHdyYXBwZXIucHJlYmlkLnRpbWVvdXQgfHwgNzAwO1xuICAgICAgcXVldWVQcmViaWRDb21tYW5kLmJpbmQodGhpcywgZmV0Y2hQcmViaWRCaWRzKGFkLCB3cmFwcGVyLnByZWJpZC51c2VTbG90Rm9yQWRVbml0ID8gc2xvdE5hbWUgOiBpZCwgdGltZW91dCwgYWRJbmZvLCBwcmVyZW5kZXIsICgpID0+IHtcbiAgICAgICAgcmVzb2x2ZSgnRmV0Y2hlZCBQcmViaWQgYWRzIScpO1xuICAgICAgfSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXNvbHZlKCdQcmViaWQgaXMgbm90IGVuYWJsZWQgb24gdGhlIHdyYXBwZXIuLi4nKTtcbiAgICB9XG4gIH0pO1xuXG4gIGNvbnN0IGFtYXpvbkJpZHMgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIGlmICh3cmFwcGVyLmFtYXpvbiAmJiB3cmFwcGVyLmFtYXpvbi5lbmFibGVkKSB7XG4gICAgICBmZXRjaEFtYXpvbkJpZHMoaWQsIHNsb3ROYW1lLCBkaW1lbnNpb25zLCBicmVha3BvaW50cywgKCkgPT4ge1xuICAgICAgICByZXNvbHZlKCdGZXRjaGVkIEFtYXpvbiBhZHMhJyk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzb2x2ZSgnQW1hem9uIGlzIG5vdCBlbmFibGVkIG9uIHRoZSB3cmFwcGVyLi4uJyk7XG4gICAgfVxuICB9KTtcblxuICBpZiAod2luZG93LmFyY0JpZGRpbmdSZWFkeSkge1xuICAgIFByb21pc2UuYWxsKFtwcmViaWRCaWRzLCBhbWF6b25CaWRzXSlcbiAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgcmVmcmVzaFNsb3Qoe1xuICAgICAgICAgIGFkLFxuICAgICAgICAgIGNvcnJlbGF0b3IsXG4gICAgICAgICAgcHJlcmVuZGVyLFxuICAgICAgICAgIGluZm86IGFkSW5mb1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHNldFRpbWVvdXQoKCkgPT4gaW5pdGlhbGl6ZUJpZGRpbmdTZXJ2aWNlcygpLCAyMDApO1xuICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvc2VydmljZXMvaGVhZGVyYmlkZGluZy5qcyIsImltcG9ydCB7IHJlZnJlc2hTbG90IH0gZnJvbSAnLi9ncHQnO1xuXG4vKipcbiAqIEBkZXNjIFF1ZXVlcyBhIGNvbW1hbmQgaW5zaWRlIG9mIFByZWJpZC5qc1xuICogQHBhcmFtIHtmdW5jdGlvbn0gZm4gLSBBY2NlcHRzIGEgZnVuY3Rpb24gdG8gcHVzaCBpbnRvIHRoZSBQcmViaWQgY29tbWFuZCBxdWV1ZS5cbiAqKi9cbmV4cG9ydCBmdW5jdGlvbiBxdWV1ZVByZWJpZENvbW1hbmQoZm4pIHtcbiAgcGJqcy5xdWUucHVzaChmbik7XG59XG5cbi8qKlxuICogQGRlc2MgQ2FsbHMgdGhlIFByZWJpZCByZXF1ZXN0IG1ldGhvZCBmb3IgZmV0Y2hpbmcgYmlkcywgb25jZSBmZXRjaGVkIHRoZSBhZHZlcnRpc2VtZW50IGlzIHJlZnJlc2hlZCB1bmxlc3MgYSBjYWxsYmFjayBpcyBkZWZpbmVkLlxuICogQHBhcmFtIHtvYmplY3R9IGFkIC0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIEdQVCBhZCBzbG90LlxuICogQHBhcmFtIHtzdHJpbmd9IGNvZGUgLSBBIHN0cmluZyBjb250YWluaW5nIHRoZSBhZHZlcnRpc2VtZW50IGlkIG9yIHNsb3RuYW1lIGNvcnJlc3BvbmRpbmcgdG8gdGhlIGRpdiB0aGUgYWR2ZXJ0aXNlbWVudCB3aWxsIGxvYWQgaW50by5cbiAqIEBwYXJhbSB7bnVtYmVyfSB0aW1lb3V0IC0gQW4gaW50ZWdlciBjb21tdW5pY2F0aW5nIGhvdyBsb25nIGluIG1zIHRoZSBQcmViaWQuanMgc2VydmljZSBzaG91bGQgd2FpdCBiZWZvcmUgaXQgY2xvc2VzIHRoZSBhdWN0aW9uIGZvciBhIGxvdC5cbiAqIEBwYXJhbSB7b2JqZWN0fSBpbmZvIC0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGFkdmVydGlzZW1lbnQgdGhhdCBpcyBhYm91dCB0byBsb2FkLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gcHJlcmVuZGVyIC0gQW4gb3B0aW9uYWwgZnVuY3Rpb24gdGhhdCB3aWxsIHJ1biBiZWZvcmUgdGhlIGFkdmVydGlzZW1lbnQgcmVuZGVycy5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNiIC0gQW4gb3B0aW9uYWwgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBzaG91bGQgZmlyZSB3aGVuZXZlciB0aGUgYmlkZGluZyBoYXMgY29uY2x1ZGVkLlxuICoqL1xuZXhwb3J0IGZ1bmN0aW9uIGZldGNoUHJlYmlkQmlkcyhhZCwgY29kZSwgdGltZW91dCwgaW5mbywgcHJlcmVuZGVyLCBjYiA9IG51bGwpIHtcbiAgcGJqcy5hZGRBZFVuaXRzKGluZm8pO1xuICBwYmpzLnJlcXVlc3RCaWRzKHtcbiAgICB0aW1lb3V0LFxuICAgIGFkVW5pdENvZGVzOiBbY29kZV0sXG4gICAgYmlkc0JhY2tIYW5kbGVyOiAocmVzdWx0KSA9PiB7XG4gICAgICBjb25zb2xlLmxvZygnQmlkIEJhY2sgSGFuZGxlcicsIHJlc3VsdCk7XG4gICAgICBwYmpzLnNldFRhcmdldGluZ0ZvckdQVEFzeW5jKFtjb2RlXSk7XG4gICAgICBpZiAoY2IpIHtcbiAgICAgICAgY2IoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlZnJlc2hTbG90KHsgYWQsIGluZm8sIHByZXJlbmRlciB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufVxuXG4vKipcbiAqIEBkZXNjIFJlZ2lzdGVycyBhbiBhZHZlcnRpc2VtZW50IHdpdGggUHJlYmlkLmpzIHNvIGl0J3MgcHJlcGFyZWQgdG8gZmV0Y2ggYmlkcyBmb3IgaXQuXG4gKiBAcGFyYW0ge3N0cmluZ30gY29kZSAtIENvbnRhaW5zIHRoZSBkaXYgaWQgb3Igc2xvdG5hbWUgdXNlZCBmb3IgdGhlIGFkdmVydGlzZW1lbnRcbiAqIEBwYXJhbSB7YXJyYXl9IHNpemVzIC0gQW4gYXJyYXkgb2YgYXBwbGljYWJsZSBhZCBzaXplcyB0aGF0IGFyZSBhdmFpbGFibGUgZm9yIGJpZGRpbmcuXG4gKiBAcGFyYW0ge29iamVjdH0gYmlkcyAtIENvbnRhaW5zIGFsbCBvZiB0aGUgYXBwbGljYWJsZSBiaWQgZGF0YSwgc3VjaCBhcyB3aGljaCB2ZW5kb3JzIHRvIHVzZSBhbmQgdGhlaXIgcGxhY2VtZW50IGlkcy5cbiAqIEBwYXJhbSB7b2JqZWN0fSB3cmFwcGVyIC0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgYWxsIGVuYWJsZWQgc2VydmljZXMgb24gdGhlIEFyYyBBZHMuXG4gKiovXG5leHBvcnQgZnVuY3Rpb24gYWRkVW5pdChjb2RlLCBzaXplcywgYmlkcywgd3JhcHBlciA9IHt9KSB7XG4gIC8vIEZvcm1hdHMgdGhlIGFkZCB1bml0IGZvciBwcmViaWQuLlxuICBjb25zdCBzbG90ID0geyBjb2RlLCBiaWRzIH07XG4gIHNsb3QubWVkaWFUeXBlcyA9IHsgYmFubmVyOiB7IHNpemVzIH0gfTtcbiAgY29uc3QgeyBzaXplQ29uZmlnLCBjb25maWcgfSA9IHdyYXBwZXI7XG5cbiAgcGJqcy5hZGRBZFVuaXRzKHNsb3QpO1xuXG4gIGlmIChjb25maWcpIHtcbiAgICBwYmpzLnNldENvbmZpZyhjb25maWcpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChzaXplQ29uZmlnKSB7XG4gICAgcGJqcy5zZXRDb25maWcoeyBzaXplQ29uZmlnIH0pO1xuICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvc2VydmljZXMvcHJlYmlkLmpzIiwiaW1wb3J0IHsgTW9iaWxlRGV0ZWN0aW9uIH0gZnJvbSAnLi91dGlsL21vYmlsZSc7XG5pbXBvcnQgeyBmZXRjaEJpZHMsIGluaXRpYWxpemVCaWRkaW5nU2VydmljZXMgfSBmcm9tICcuL3NlcnZpY2VzL2hlYWRlcmJpZGRpbmcnO1xuaW1wb3J0IHsgaW5pdGlhbGl6ZUdQVCwgcXVldWVHb29nbGV0YWdDb21tYW5kLCByZWZyZXNoU2xvdCwgZGZwU2V0dGluZ3MsIHNldFRhcmdldGluZywgZGV0ZXJtaW5lU2xvdE5hbWUgfSBmcm9tICcuL3NlcnZpY2VzL2dwdCc7XG5pbXBvcnQgeyBxdWV1ZVByZWJpZENvbW1hbmQsIGFkZFVuaXQgfSBmcm9tICcuL3NlcnZpY2VzL3ByZWJpZCc7XG5pbXBvcnQgeyBwcmVwYXJlU2l6ZU1hcHMsIHNldFJlc2l6ZUxpc3RlbmVyIH0gZnJvbSAnLi9zZXJ2aWNlcy9zaXplbWFwcGluZyc7XG5cbi8qKiBAZGVzYyBEaXNwbGF5cyBhbiBhZHZlcnRpc2VtZW50IGZyb20gR29vZ2xlIERGUCB3aXRoIG9wdGlvbmFsIHN1cHBvcnQgZm9yIFByZWJpZC5qcyBhbmQgQW1hem9uIFRBTS9BOS4gKiovXG5leHBvcnQgY2xhc3MgQXJjQWRzIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucywgaGFuZGxlU2xvdFJlbmRlcmVkID0gbnVsbCkge1xuICAgIHRoaXMuZGZwSWQgPSBvcHRpb25zLmRmcC5pZCB8fCAnJztcbiAgICB0aGlzLndyYXBwZXIgPSBvcHRpb25zLmJpZGRpbmcgfHwge307XG4gICAgdGhpcy5wb3NpdGlvbnMgPSBbXTtcbiAgICB0aGlzLmNvbGxhcHNlRW1wdHlEaXZzID0gb3B0aW9ucy5kZnAuY29sbGFwc2VFbXB0eURpdnM7XG5cbiAgICB3aW5kb3cuaXNNb2JpbGUgPSBNb2JpbGVEZXRlY3Rpb247XG5cbiAgICBpZiAodGhpcy5kZnBJZCA9PT0gJycpIHtcbiAgICAgIGNvbnNvbGUud2FybihgQXJjQWRzOiBERlAgaWQgaXMgbWlzc2luZyBmcm9tIHRoZSBhcmNhZHMgaW5pdGlhbGl6YXRpb24gc2NyaXB0LiBcbiAgICAgICAgRG9jdW1lbnRhdGlvbjogaHR0cHM6Ly9naXRodWIuY29tL3dhcG9wYXJ0bmVycy9hcmMtYWRzI2dldHRpbmctc3RhcnRlZGApO1xuICAgIH0gZWxzZSB7XG4gICAgICBpbml0aWFsaXplR1BUKCk7XG4gICAgICBxdWV1ZUdvb2dsZXRhZ0NvbW1hbmQoZGZwU2V0dGluZ3MuYmluZCh0aGlzLCBoYW5kbGVTbG90UmVuZGVyZWQpKTtcbiAgICAgIGluaXRpYWxpemVCaWRkaW5nU2VydmljZXModGhpcy53cmFwcGVyKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgKiBAZGVzYyBSZWdpc3RlcnMgYW4gYWR2ZXJ0aXNlbWVudCBpbiB0aGUgc2VydmljZS5cbiAgKiBAcGFyYW0ge29iamVjdH0gcGFyYW1zIC0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgYWxsIG9mIHRoZSBhZHZlcnRpc2VtZW50IGNvbmZpZ3VyYXRpb24gc2V0dGluZ3Mgc3VjaCBhcyBzbG90IG5hbWUsIGlkLCBhbmQgcG9zaXRpb24uXG4gICoqL1xuICByZWdpc3RlckFkKHBhcmFtcykge1xuICAgIGNvbnN0IHsgaWQsIHNsb3ROYW1lLCBkaW1lbnNpb25zLCBhZFR5cGUgPSBmYWxzZSwgdGFyZ2V0aW5nID0ge30sIGRpc3BsYXkgPSAnYWxsJywgYmlkZGluZyA9IGZhbHNlLCBpZnJhbWVCaWRkZXJzID0gWydvcGVueCddIH0gPSBwYXJhbXM7XG4gICAgY29uc3QgZmxhdERpbWVuc2lvbnMgPSBbXTtcbiAgICBsZXQgcHJvY2Vzc0Rpc3BsYXlBZCA9IGZhbHNlO1xuXG4gICAgaWYgKGRpbWVuc2lvbnMgJiYgdHlwZW9mIGRpbWVuc2lvbnMgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBkaW1lbnNpb25zWzBdID09PSAnbnVtYmVyJykge1xuICAgICAgZmxhdERpbWVuc2lvbnMucHVzaCguLi5kaW1lbnNpb25zKTtcbiAgICB9IGVsc2UgaWYgKGRpbWVuc2lvbnMgJiYgdHlwZW9mIGRpbWVuc2lvbnMgIT09ICd1bmRlZmluZWQnICYmIGRpbWVuc2lvbnMubGVuZ3RoID4gMCAmJiBkaW1lbnNpb25zWzBdWzBdWzBdID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGZsYXREaW1lbnNpb25zLnB1c2goLi4uZGltZW5zaW9ucyk7XG4gICAgfSBlbHNlIGlmIChkaW1lbnNpb25zKSB7XG4gICAgICBkaW1lbnNpb25zLmZvckVhY2goKHNldCkgPT4ge1xuICAgICAgICBmbGF0RGltZW5zaW9ucy5wdXNoKC4uLnNldCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgLyogSWYgcG9zaXRpb25hbCB0YXJnZXRpbmcgZG9lc24ndCBleGlzdCBpdCBnZXRzIGFzc2lnbmVkIGEgbnVtZXJpYyB2YWx1ZVxuICAgICAgICBiYXNlZCBvbiB0aGUgb3JkZXIgYW5kIHR5cGUgb2YgdGhlIGFkdmVydGlzZW1lbnQuIFRoaXMgbG9naWMgaXMgc2tpcHBlZCBpZiBhZFR5cGUgaXMgbm90IGRlZmluZWQuICovXG4gICAgICBpZiAoKCF0YXJnZXRpbmcgfHwgIXRhcmdldGluZy5oYXNPd25Qcm9wZXJ0eSgncG9zaXRpb24nKSkgJiYgYWRUeXBlICE9PSBmYWxzZSkge1xuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMucG9zaXRpb25zW2FkVHlwZV0gKyAxIHx8IDE7XG4gICAgICAgIHRoaXMucG9zaXRpb25zW2FkVHlwZV0gPSBwb3NpdGlvbjtcblxuICAgICAgICBjb25zdCBwb3NpdGlvblBhcmFtID0gT2JqZWN0LmFzc2lnbih0YXJnZXRpbmcsIHsgcG9zaXRpb24gfSk7XG4gICAgICAgIE9iamVjdC5hc3NpZ24ocGFyYW1zLCB7IHRhcmdldGluZzogcG9zaXRpb25QYXJhbSB9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKChpc01vYmlsZS5hbnkoKSAmJiBkaXNwbGF5ID09PSAnbW9iaWxlJykgfHwgKCFpc01vYmlsZS5hbnkoKSAmJiBkaXNwbGF5ID09PSAnZGVza3RvcCcpIHx8IChkaXNwbGF5ID09PSAnYWxsJykpIHtcbiAgICAgICAgLy8gUmVnaXN0ZXJzIHRoZSBhZHZlcnRpc2VtZW50IHdpdGggUHJlYmlkLmpzIGlmIGVuYWJsZWQgb24gYm90aCB0aGUgdW5pdCBhbmQgd3JhcHBlci5cbiAgICAgICAgaWYgKChiaWRkaW5nLnByZWJpZCAmJiBiaWRkaW5nLnByZWJpZC5iaWRzKSAmJiAodGhpcy53cmFwcGVyLnByZWJpZCAmJiB0aGlzLndyYXBwZXIucHJlYmlkLmVuYWJsZWQpICYmIGZsYXREaW1lbnNpb25zKSB7XG4gICAgICAgICAgaWYgKHBianMgJiYgaWZyYW1lQmlkZGVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBwYmpzLnNldENvbmZpZyh7XG4gICAgICAgICAgICAgIHVzZXJTeW5jOiB7XG4gICAgICAgICAgICAgICAgaWZyYW1lRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBmaWx0ZXJTZXR0aW5nczoge1xuICAgICAgICAgICAgICAgICAgaWZyYW1lOiB7XG4gICAgICAgICAgICAgICAgICAgIGJpZGRlcnM6IGlmcmFtZUJpZGRlcnMsXG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcjogJ2luY2x1ZGUnXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgY29kZSA9IHRoaXMud3JhcHBlci5wcmViaWQudXNlU2xvdEZvckFkVW5pdCA/IGRldGVybWluZVNsb3ROYW1lKHRoaXMuZGZwSWQsIHNsb3ROYW1lKSA6IGlkO1xuICAgICAgICAgIHF1ZXVlUHJlYmlkQ29tbWFuZC5iaW5kKHRoaXMsIGFkZFVuaXQoY29kZSwgZmxhdERpbWVuc2lvbnMsIGJpZGRpbmcucHJlYmlkLmJpZHMsIHRoaXMud3JhcHBlci5wcmViaWQpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb2Nlc3NEaXNwbGF5QWQgPSB0aGlzLmRpc3BsYXlBZC5iaW5kKHRoaXMsIHBhcmFtcyk7XG4gICAgICAgIGlmIChwcm9jZXNzRGlzcGxheUFkKSB7XG4gICAgICAgICAgcXVldWVHb29nbGV0YWdDb21tYW5kKHByb2Nlc3NEaXNwbGF5QWQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdhZHMgZXJyb3InLCBlcnIpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAqIEBkZXNjIFJlZ2lzdGVycyBhIGNvbGxlY3Rpb24gb2YgYWR2ZXJ0aXNlbWVudHMuXG4gICogQHBhcmFtIHthcnJheX0gY29sbGVjdGlvbiAtIEFuIGFycmF5IGNvbnRhaW5pbmcgYSBsaXN0IG9mIG9iamVjdHMgY29udGFpbmluZyBhZHZlcnRpc2VtZW50IGRhdGEuXG4gICoqL1xuICByZWdpc3RlckFkQ29sbGVjdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgY29sbGVjdGlvbi5mb3JFYWNoKChhZHZlcnQpID0+IHtcbiAgICAgIHRoaXMucmVnaXN0ZXJBZChhZHZlcnQpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICogQGRlc2MgRGlzcGxheXMgYW4gYWR2ZXJ0aXNlbWVudCBhbmQgc2V0cyB1cCBhbnkgbmVjY2Vyc2FyeSBldmVudCBiaW5kaW5nLlxuICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJhbXMgLSBBbiBvYmplY3QgY29udGFpbmluZyBhbGwgb2YgdGhlIGZ1bmN0aW9uIGFyZ3VtZW50cy5cbiAgKiBAcGFyYW0ge3N0cmluZ30gcGFyYW1zLmlkIC0gQSBzdHJpbmcgY29udGFpbmluZyB0aGUgYWR2ZXJ0aXNlbWVudCBpZCBjb3JyZXNwb25kaW5nIHRvIHRoZSBkaXYgdGhlIGFkdmVydGlzZW1lbnQgd2lsbCBsb2FkIGludG8uXG4gICogQHBhcmFtIHtzdHJpbmd9IHBhcmFtcy5zbG90TmFtZSAtIEEgc3RyaW5nIGNvbnRhaW5pbmcgdGhlIHNsb3QgbmFtZSBvZiB0aGUgYWR2ZXJ0aXNlbWVudCwgZm9yIGluc3RhbmNlICcxMjM0L25ld3MvaG9tZXBhZ2UnLlxuICAqIEBwYXJhbSB7YXJyYXl9IHBhcmFtcy5kaW1lbnNpb25zIC0gQW4gYXJyYXkgY29udGFpbmluZyBhbGwgb2YgdGhlIGFwcGxpY2FibGUgc2l6ZXMgdGhlIGFkdmVydGlzZW1lbnQgY2FuIHVzZS5cbiAgKiBAcGFyYW0ge29iamVjdH0gcGFyYW1zLnRhcmdldGluZyAtIEFuIG9iamVjdCBjb250YWluaW5nIGFsbCBvZiB0aGUgYWR2ZXJ0aXNlbWVudHMgdGFyZ2V0aW5nIGRhdGEuXG4gICogQHBhcmFtIHthcnJheX0gcGFyYW1zLnNpemVtYXAgLSBBbiBhcnJheSBjb250YWluaW5nIG9wdGlvbmFsIHNpemUgbWFwcGluZyBpbmZvcm1hdGlvbi5cbiAgKiBAcGFyYW0ge29iamVjdH0gcGFyYW1zLmJpZGRpbmcgLSBDb250YWlucyBhbGwgb2YgdGhlIGFwcGxpY2FibGUgYmlkIGRhdGEsIHN1Y2ggYXMgd2hpY2ggdmVuZG9ycyB0byB1c2UgYW5kIHRoZWlyIHBsYWNlbWVudCBpZHMuXG4gICogQHBhcmFtIHtmdW5jdGlvbn0gcGFyYW1zLnByZXJlbmRlciAtIEFuIG9wdGlvbmFsIGZ1bmN0aW9uIHRoYXQgd2lsbCBydW4gYmVmb3JlIHRoZSBhZHZlcnRpc2VtZW50IHJlbmRlcnMuXG4gICoqL1xuICBkaXNwbGF5QWQoe1xuICAgIGlkLFxuICAgIHNsb3ROYW1lLFxuICAgIGRpbWVuc2lvbnMsXG4gICAgdGFyZ2V0aW5nLFxuICAgIHNpemVtYXAgPSBmYWxzZSxcbiAgICBiaWRkaW5nID0gZmFsc2UsXG4gICAgcHJlcmVuZGVyID0gbnVsbFxuICB9KSB7XG4gICAgY29uc3QgZnVsbFNsb3ROYW1lID0gZGV0ZXJtaW5lU2xvdE5hbWUodGhpcy5kZnBJZCwgc2xvdE5hbWUpO1xuICAgIGNvbnN0IHBhcnNlZERpbWVuc2lvbnMgPSBkaW1lbnNpb25zICYmICFkaW1lbnNpb25zLmxlbmd0aCA/IG51bGwgOiBkaW1lbnNpb25zO1xuICAgIGNvbnN0IGFkID0gIWRpbWVuc2lvbnMgPyB3aW5kb3cuZ29vZ2xldGFnLmRlZmluZU91dE9mUGFnZVNsb3QoZnVsbFNsb3ROYW1lLCBpZClcbiAgICAgIDogd2luZG93Lmdvb2dsZXRhZy5kZWZpbmVTbG90KGZ1bGxTbG90TmFtZSwgcGFyc2VkRGltZW5zaW9ucywgaWQpO1xuXG5cbiAgICBpZiAoc2l6ZW1hcCAmJiBzaXplbWFwLmJyZWFrcG9pbnRzICYmIGRpbWVuc2lvbnMpIHtcbiAgICAgIGNvbnN0IHsgbWFwcGluZywgYnJlYWtwb2ludHMsIGNvcnJlbGF0b3JzIH0gPSBwcmVwYXJlU2l6ZU1hcHMocGFyc2VkRGltZW5zaW9ucywgc2l6ZW1hcC5icmVha3BvaW50cyk7XG5cbiAgICAgIGlmIChhZCkge1xuICAgICAgICBhZC5kZWZpbmVTaXplTWFwcGluZyhtYXBwaW5nKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHNpemVtYXAucmVmcmVzaCkge1xuICAgICAgICBzZXRSZXNpemVMaXN0ZW5lcih7XG4gICAgICAgICAgYWQsXG4gICAgICAgICAgc2xvdE5hbWU6IGZ1bGxTbG90TmFtZSxcbiAgICAgICAgICBicmVha3BvaW50cyxcbiAgICAgICAgICBpZCxcbiAgICAgICAgICBtYXBwaW5nLFxuICAgICAgICAgIGNvcnJlbGF0b3JzLFxuICAgICAgICAgIGJpZGRpbmcsXG4gICAgICAgICAgd3JhcHBlcjogdGhpcy53cmFwcGVyLFxuICAgICAgICAgIHByZXJlbmRlclxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoYWQpIHtcbiAgICAgIGFkLmFkZFNlcnZpY2Uod2luZG93Lmdvb2dsZXRhZy5wdWJhZHMoKSk7XG4gICAgICBzZXRUYXJnZXRpbmcoYWQsIHRhcmdldGluZyk7XG4gICAgfVxuXG4gICAgY29uc3Qgc2FmZWJyZWFrcG9pbnRzID0gKHNpemVtYXAgJiYgc2l6ZW1hcC5icmVha3BvaW50cykgPyBzaXplbWFwLmJyZWFrcG9pbnRzIDogW107XG5cbiAgICBpZiAoZGltZW5zaW9ucyAmJiBiaWRkaW5nICYmICgoYmlkZGluZy5hbWF6b24gJiYgYmlkZGluZy5hbWF6b24uZW5hYmxlZCkgfHwgKGJpZGRpbmcucHJlYmlkICYmIGJpZGRpbmcucHJlYmlkLmVuYWJsZWQpKSkge1xuICAgICAgZmV0Y2hCaWRzKHtcbiAgICAgICAgYWQsXG4gICAgICAgIGlkLFxuICAgICAgICBzbG90TmFtZTogZnVsbFNsb3ROYW1lLFxuICAgICAgICBkaW1lbnNpb25zOiBwYXJzZWREaW1lbnNpb25zLFxuICAgICAgICB3cmFwcGVyOiB0aGlzLndyYXBwZXIsXG4gICAgICAgIHByZXJlbmRlcixcbiAgICAgICAgYmlkZGluZyxcbiAgICAgICAgYnJlYWtwb2ludHM6IHNhZmVicmVha3BvaW50c1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlZnJlc2hTbG90KHtcbiAgICAgICAgYWQsXG4gICAgICAgIHByZXJlbmRlcixcbiAgICAgICAgaW5mbzoge1xuICAgICAgICAgIGFkVW5pdDogYWQsXG4gICAgICAgICAgYWRTbG90OiBmdWxsU2xvdE5hbWUsXG4gICAgICAgICAgYWREaW1lbnNpb25zOiBwYXJzZWREaW1lbnNpb25zLFxuICAgICAgICAgIGFkSWQ6IGlkXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2luZGV4LmpzIiwiLyoqIEBkZXNjIFV0aWxpdHkgY2xhc3MgdGhhdCBkZXRlcm1pbmVzIHRoZSBlbmQgdXNlcidzIGJyb3dzZXIgdXNlciBhZ2VudC4gKiovXG5leHBvcnQgY2xhc3MgTW9iaWxlRGV0ZWN0aW9uIHtcbiAgLyoqXG4gICogQGRlc2MgRGV0ZXJtaW5lcyBpZiB0aGUgdXNlciBpcyB1c2luZyBhbiBBbmRyb2lkIGRldmljZS5cbiAgKiovXG4gIHN0YXRpYyBBbmRyb2lkKCkge1xuICAgIHJldHVybiAhIW5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL0FuZHJvaWQvaSk7XG4gIH1cblxuICAvKipcbiAgKiBAZGVzYyBEZXRlcm1pbmVzIGlmIHRoZSB1c2VyIGlzIHVzaW5nIGFuIG9sZCBBbmRyb2lkIGRldmljZS5cbiAgKiovXG4gIHN0YXRpYyBBbmRyb2lkT2xkKCkge1xuICAgIHJldHVybiAhIW5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL0FuZHJvaWQgMi4zLjMvaSk7XG4gIH1cblxuICAvKipcbiAgKiBAZGVzYyBEZXRlcm1pbmVzIGlmIHRoZSB1c2VyIGlzIHVzaW5nIGFuIEFuZHJvaWQgdGFibGV0IGRldmljZS5cbiAgKiovXG4gIHN0YXRpYyBBbmRyb2lkVGFibGV0KCkge1xuICAgIHJldHVybiAhIShuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9BbmRyb2lkL2kpICYmICFuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9Nb2JpbGUvaSkpO1xuICB9XG5cbiAgLyoqXG4gICogQGRlc2MgRGV0ZXJtaW5lcyBpZiB0aGUgdXNlciBpcyB1c2luZyBhIEtpbmRsZS5cbiAgKiovXG4gIHN0YXRpYyBLaW5kbGUoKSB7XG4gICAgcmV0dXJuICEhbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvS2luZGxlL2kpO1xuICB9XG5cbiAgLyoqXG4gICogQGRlc2MgRGV0ZXJtaW5lcyBpZiB0aGUgdXNlciBpcyB1c2luZyBhIEtpbmRsZSBGaXJlLlxuICAqKi9cbiAgc3RhdGljIEtpbmRsZUZpcmUoKSB7XG4gICAgcmV0dXJuICEhbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvS0ZPVC9pKTtcbiAgfVxuXG4gIC8qKlxuICAqIEBkZXNjIERldGVybWluZXMgaWYgdGhlIHVzZXIgaXMgdXNpbmcgU2lsay5cbiAgKiovXG4gIHN0YXRpYyBTaWxrKCkge1xuICAgIHJldHVybiAhIW5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL1NpbGsvaSk7XG4gIH1cblxuICAvKipcbiAgKiBAZGVzYyBEZXRlcm1pbmVzIGlmIHRoZSB1c2VyIGlzIHVzaW5nIGEgQmxhY2tCZXJyeSBkZXZpY2VcbiAgKiovXG4gIHN0YXRpYyBCbGFja0JlcnJ5KCkge1xuICAgIHJldHVybiAhIW5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL0JsYWNrQmVycnkvaSk7XG4gIH1cblxuICAvKipcbiAgKiBAZGVzYyBEZXRlcm1pbmVzIGlmIHRoZSB1c2VyIGlzIHVzaW5nIGFuIGlPUyBkZXZpY2UuXG4gICoqL1xuICBzdGF0aWMgaU9TKCkge1xuICAgIHJldHVybiAhIW5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL2lQaG9uZXxpUGFkfGlQb2QvaSk7XG4gIH1cblxuICAvKipcbiAgKiBAZGVzYyBEZXRlcm1pbmVzIGlmIHRoZSB1c2VyIGlzIHVzaW5nIGFuIGlQaG9uZSBvciBpUG9kLlxuICAqKi9cbiAgc3RhdGljIGlQaG9uZSgpIHtcbiAgICByZXR1cm4gISFuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9pUGhvbmV8aVBvZC9pKTtcbiAgfVxuXG4gIC8qKlxuICAqIEBkZXNjIERldGVybWluZXMgaWYgdGhlIHVzZXIgaXMgdXNpbmcgYW4gaVBhZC5cbiAgKiovXG4gIHN0YXRpYyBpUGFkKCkge1xuICAgIHJldHVybiAhIW5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL2lQYWQvaSk7XG4gIH1cblxuICAvKipcbiAgKiBAZGVzYyBEZXRlcm1pbmVzIGlmIHRoZSB1c2VyIGlzIHVzaW5nIGEgV2luZG93cyBNb2JpbGUgZGV2aWNlLlxuICAqKi9cbiAgc3RhdGljIFdpbmRvd3MoKSB7XG4gICAgcmV0dXJuICEhbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvSUVNb2JpbGUvaSk7XG4gIH1cblxuICAvKipcbiAgKiBAZGVzYyBEZXRlcm1pbmVzIGlmIHRoZSB1c2VyIGlzIHVzaW5nIEZpcmVGb3hPUy5cbiAgKiovXG4gIHN0YXRpYyBGaXJlZm94T1MoKSB7XG4gICAgcmV0dXJuICEhbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvTW96aWxsYS9pKSAmJiAhIW5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL01vYmlsZS9pKTtcbiAgfVxuXG4gIC8qKlxuICAqIEBkZXNjIERldGVybWluZXMgaWYgdGhlIHVzZXIgaXMgdXNpbmcgYSBSZXRpbmEgZGlzcGxheS5cbiAgKiovXG4gIHN0YXRpYyBSZXRpbmEoKSB7XG4gICAgcmV0dXJuICh3aW5kb3cucmV0aW5hIHx8IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvID4gMSk7XG4gIH1cblxuICAvKipcbiAgKiBAZGVzYyBEZXRlcm1pbmVzIGlmIHRoZSB1c2VyIGlzIHVzaW5nIGFueSB0eXBlIG9mIG1vYmlsZSBkZXZpY2UuXG4gICoqL1xuICBzdGF0aWMgYW55KCkge1xuICAgIHJldHVybiAodGhpcy5BbmRyb2lkKCkgfHwgdGhpcy5LaW5kbGUoKSB8fCB0aGlzLktpbmRsZUZpcmUoKSB8fCB0aGlzLlNpbGsoKSB8fCB0aGlzLkJsYWNrQmVycnkoKSB8fCB0aGlzLmlPUygpIHx8IHRoaXMuV2luZG93cygpIHx8IHRoaXMuRmlyZWZveE9TKCkpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1vYmlsZURldGVjdGlvbjtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy91dGlsL21vYmlsZS5qcyIsIi8qKlxuKiBAZGVzYyBBcHBlbmRzIGEgcmVtb3RlIHJlc291cmNlIHRvIHRoZSBwYWdlIHdpdGhpbiBhIEhUTUwgdGFnLlxuKiBAcGFyYW0ge3N0cmluZ30gdGFnbmFtZSAtIEEgc3RyaW5nIGNvbnRhaW5pbmcgdGhlIHR5cGUgb2YgSFRNTCB0YWcgdGhhdCBzaG91bGQgYmUgYXBwZW5kZWQuXG4qIEBwYXJhbSB7c3RyaW5nfSB1cmwgLSBBIHN0cmluZyBjb250YWluaW5nIHRoZSBwYXRoIG9mIHRoZSByZXNvdXJjZS5cbiogQHBhcmFtIHtib29sZWFufSBhc3luYyAtIEEgYm9vbGVhbiByZXByZXNlbnRpbmcgaWYgdGhlIHJlc291cmNlIHNob3VsZCBiZSBsb2FkZWQgYXN5bmNocm9ub3VzbHkgb3Igbm90LlxuKiBAcGFyYW0ge2Jvb2xlYW59IGRlZmVyIC0gQSBib29sZWFuIHJlcHJlc2VudGluZyBpZiB0aGUgcmVzb3VyY2Ugc2hvdWxkIGJlIGRlZmVycmVkIG9yIG5vdC5cbiogQHBhcmFtIHtmdW5jdGlvbn0gY2IgLSBBbiBvcHRpb25hbCBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IHNob3VsZCBmaXJlIHdoZW5ldmVyIHRoZSByZXNvdXJjZSBoYXMgYmVlbiBhcHBlbmRlZC5cbioqL1xuZXhwb3J0IGZ1bmN0aW9uIGFwcGVuZFJlc291cmNlKHRhZ25hbWUsIHVybCwgYXN5bmMsIGRlZmVyLCBjYikge1xuICBjb25zdCB0YWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZ25hbWUpO1xuICBpZiAodGFnbmFtZSA9PT0gJ3NjcmlwdCcpIHtcbiAgICB0YWcuc3JjID0gdXJsO1xuICAgIHRhZy5hc3luYyA9IGFzeW5jIHx8IGZhbHNlO1xuICAgIHRhZy5kZWZlciA9IGFzeW5jIHx8IGRlZmVyIHx8IGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybjtcbiAgfVxuICAoZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpLmFwcGVuZENoaWxkKHRhZyk7XG5cbiAgaWYgKGNiKSB7XG4gICAgY2IoKTtcbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3V0aWwvcmVzb3VyY2VzLmpzIiwiLyoqXG4qIEBkZXNjIEFjY2VwdHMgYSBrZXkgYXMgYSBzdHJpbmcgYW5kIHJldHVybnMgdGhlIHZhbHVlIG9mIGEgcXVlcnkgcGFyYW1ldGVyIG9uIHRoZSBwYWdlIHJlcXVlc3QuXG4qIEBwYXJhbSB7c3RyaW5nfSBwYXJhbSAtIEEgc3RyaW5nIHRoYXQgcmVwcmVzZW50cyB0aGUga2V5IG9mIGEgcXVlcnkgcGFyYW10ZXIsIGZvciBleGFtcGxlICdhZHNsb3QnIHdpbGwgcmV0dXJuICdoZWxsbycgaWYgdGhlIHVybCBoYXMgJz9hZHNsb3Q9aGVsbG8nIGF0IHRoZSBlbmQgb2YgaXQuXG4qIEByZXR1cm4gLSBSZXR1cm5zIGEgc3RyaW5nIGNvbnRhaW5pbmcgdGhlIHZhbHVlIG9mIGEgcXVlcnkgcGFyYW10ZXIuXG4qKi9cbmV4cG9ydCBmdW5jdGlvbiBleHBhbmRRdWVyeVN0cmluZyhwYXJhbSkge1xuICBjb25zdCB1cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcbiAgY29uc3QgbmFtZSA9IHBhcmFtLnJlcGxhY2UoL1tbXFxdXS9nLCAnXFxcXCQmJyk7XG4gIGNvbnN0IHJlZ2V4ID0gbmV3IFJlZ0V4cChgWz8mXSR7bmFtZX0oPShbXiYjXSopfCZ8I3wkKWApO1xuICBjb25zdCByZXN1bHRzID0gcmVnZXguZXhlYyh1cmwpO1xuXG4gIGlmICghcmVzdWx0cykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgaWYgKCFyZXN1bHRzWzJdKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG4gIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQocmVzdWx0c1syXS5yZXBsYWNlKC9cXCsvZywgJyAnKSk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvdXRpbC9xdWVyeS5qcyIsIi8qKlxuKiBAZGVzYyBGZXRjaGVzIGEgYmlkIGZvciBhbiBhZHZlcnRpc2VtZW50IGJhc2VkIG9uIHdoaWNoIHNlcnZpY2VzIGFyZSBlbmFibGVkIG9uIHVuaXQgYW5kIHRoZSB3cmFwcGVyLlxuKiBAcGFyYW0ge3N0cmluZ30gaWQgLSBBIHN0cmluZyBjb250YWluaW5nIHRoZSBhZHZlcnRpc2VtZW50IGlkIGNvcnJlc3BvbmRpbmcgdG8gdGhlIGRpdiB0aGUgYWR2ZXJ0aXNlbWVudCB3aWxsIGxvYWQgaW50by5cbiogQHBhcmFtIHtzdHJpbmd9IHNsb3ROYW1lIC0gQSBzdHJpbmcgY29udGFpbmluZyB0aGUgc2xvdCBuYW1lIG9mIHRoZSBhZHZlcnRpc2VtZW50LCBmb3IgaW5zdGFuY2UgJzEyMzQvYWRuLmNvbS9ob21lcGFnZScuXG4qIEBwYXJhbSB7YXJyYXl9IGRpbWVuc2lvbnMgLSBBbiBhcnJheSBjb250YWluaW5nIGFsbCBvZiB0aGUgYXBwbGljYWJsZSBzaXplcyB0aGUgYWR2ZXJ0aXNlbWVudCBjYW4gdXNlLlxuKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYiAtIEFuIG9wdGlvbmFsIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgc2hvdWxkIGZpcmUgd2hlbmV2ZXIgdGhlIGJpZGRpbmcgaGFzIGNvbmNsdWRlZC5cbioqL1xuZXhwb3J0IGZ1bmN0aW9uIGZldGNoQW1hem9uQmlkcyhpZCwgc2xvdE5hbWUsIGRpbWVuc2lvbnMsIGJyZWFrcG9pbnRzLCBjYiA9IG51bGwpIHtcbiAgLy8gcGFzcyBpbiBicmVha3BvaW50cyBhcnJheVxuICBsZXQgc2l6ZUFycmF5ID0gZGltZW5zaW9ucztcblxuICBpZiAoYnJlYWtwb2ludHMgJiYgdHlwZW9mIHdpbmRvdy5pbm5lcldpZHRoICE9PSAndW5kZWZpbmVkJyAmJiBkaW1lbnNpb25zWzBdWzBdWzBdICE9PSB1bmRlZmluZWQpIHtcbiAgICBjb25zdCB2aWV3UG9ydFdpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgbGV0IHVzZUluZGV4ID0gLTE7XG4gICAgY29uc3QgYnJlYWtwb2ludHNMZW5ndGggPSBicmVha3BvaW50cy5sZW5ndGg7XG5cbiAgICBmb3IgKGxldCBpbmQgPSAwOyBpbmQgPCBicmVha3BvaW50c0xlbmd0aDsgaW5kKyspIHtcbiAgICAgIGlmICh2aWV3UG9ydFdpZHRoID49IGJyZWFrcG9pbnRzW2luZF1bMF0pIHtcbiAgICAgICAgdXNlSW5kZXggPSBpbmQ7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIHNpemVBcnJheSA9IGRpbWVuc2lvbnNbdXNlSW5kZXhdO1xuICB9XG5cbiAgcXVldWVBbWF6b25Db21tYW5kKCgpID0+IHtcbiAgICBjb25zdCBzbG90ID0ge1xuICAgICAgc2xvdE5hbWUsXG4gICAgICBzbG90SUQ6IGlkLFxuICAgICAgc2l6ZXM6IHNpemVBcnJheVxuICAgIH07XG5cbiAgICAvLyBSZXRyaWV2ZXMgdGhlIGJpZCBmcm9tIEFtYXpvblxuICAgIHdpbmRvdy5hcHN0YWcuZmV0Y2hCaWRzKHsgc2xvdHM6IFtzbG90XSB9LCAoKSA9PiB7XG4gICAgICAvLyBTZXRzIHRoZSB0YXJnZXRpbmcgdmFsdWVzIG9uIHRoZSBkaXNwbGF5IGJpZCBmcm9tIGFwc3RhZ1xuICAgICAgd2luZG93LmFwc3RhZy5zZXREaXNwbGF5QmlkcygpO1xuICAgICAgaWYgKGNiKSB7XG4gICAgICAgIGNiKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufVxuXG4vKipcbiogQGRlc2MgQWRkcyBhbiBBbWF6b24gY29tbWFuZCB0byBhIGNhbGxiYWNrIHF1ZXVlIHdoaWNoIGF3YWl0cyBmb3Igd2luZG93LmFwc3RhZ1xuKiBAcGFyYW0ge3N0cmluZ30gY21kIC0gVGhlIGZ1bmN0aW9uIHRoYXQgc2hvdWxkIHdhaXQgZm9yIHdpbmRvdy5hcHN0YWcgdG8gYmUgcmVhZHkuXG4qKi9cbmV4cG9ydCBmdW5jdGlvbiBxdWV1ZUFtYXpvbkNvbW1hbmQoY21kKSB7XG4gIGlmICh3aW5kb3cuYXBzdGFnKSB7XG4gICAgY21kKCk7XG4gIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9zZXJ2aWNlcy9hbWF6b24uanMiLCJpbXBvcnQgeyBkZWJvdW5jZSB9IGZyb20gJy4uL3V0aWwvZGVib3VuY2UnO1xuaW1wb3J0IHsgZmV0Y2hCaWRzIH0gZnJvbSAnLi9oZWFkZXJiaWRkaW5nJztcbmltcG9ydCB7IHJlZnJlc2hTbG90IH0gZnJvbSAnLi9ncHQnO1xuXG4vKiogQGRlc2MgQW4gb2JqZWN0IGNvbnRhaW5pbmcgYWxsIG9mIHRoZSBzaXplIG1hcCByZWZyZXNoIGV2ZW50IGxpc3RlbmVycyBhbmQgY29ycmVsYXRvcnMgZm9yIHNpemUgbWFwcGluZy4gKiovXG5leHBvcnQgY29uc3Qgc2l6ZW1hcExpc3RlbmVycyA9IHt9O1xuXG4vKiogQGRlc2MgQW4gb2JqZWN0IGNvbnRhaW5pbmcgYWxsIG9mIHRoZSBzY3JlZW4gcmVzaXplIGV2ZW50IGxpc3RlbmVycyBmb3Igc2l6ZSBtYXBwaW5nLiAqKi9cbmV4cG9ydCBjb25zdCByZXNpemVMaXN0ZW5lcnMgPSB7fTtcblxuLyoqXG4qIEBkZXNjIFByZXBhcmVzIGEgc2V0IG9mIGRpbWVuc2lvbnMgYW5kIHRoZWlyIGNvcnJlc3BvbmRpbmcgYnJlYWtwb2ludHMgdG8gY3JlYXRlIGEgc2l6ZW1hcCB3aGljaCBpcyByZWFkYWJsZSBieSBHUFQuXG4qIEBwYXJhbSB7YXJyYXl9IGRpbWVuc2lvbnMgLSBBbiBhcnJheSBjb250YWluaW5nIGFsbCBvZiB0aGUgYXBwbGljYWJsZSBzaXplcyB0aGUgYWR2ZXJ0aXNlbWVudCBjYW4gdXNlLlxuKiBAcGFyYW0ge2FycmF5fSBzaXplbWFwIC0gQW4gYXJyYXkgY29udGFpbmluZyBhbGwgb2YgdGhlIGFwcGxpY2FibGUgYnJlYWtwb2ludHMgZm9yIHRoZSBzaXplbWFwcGluZy5cbioqL1xuZXhwb3J0IGZ1bmN0aW9uIHByZXBhcmVTaXplTWFwcyhkaW1lbnNpb25zLCBzaXplbWFwKSB7XG4gIGNvbnN0IG1hcHBpbmcgPSBbXTtcbiAgY29uc3QgYnJlYWtwb2ludHMgPSBbXTtcbiAgY29uc3QgY29ycmVsYXRvcnMgPSBbXTtcbiAgY29uc3QgcGFyc2VkU2l6ZW1hcCA9ICFzaXplbWFwLmxlbmd0aCA/IG51bGwgOiBzaXplbWFwO1xuXG4gIHBhcnNlZFNpemVtYXAuZm9yRWFjaCgodmFsdWUsIGluZGV4KSA9PiB7XG4gICAgbWFwcGluZy5wdXNoKFt2YWx1ZSwgZGltZW5zaW9uc1tpbmRleF1dKTtcblxuICAgIC8vIEZpbHRlcnMgZHVwbGljYXRlcyBmcm9tIHRoZSBtYXBwaW5nXG4gICAgaWYgKGJyZWFrcG9pbnRzLmluZGV4T2YodmFsdWVbMF0pID09PSAtMSkge1xuICAgICAgYnJlYWtwb2ludHMucHVzaCh2YWx1ZVswXSk7XG4gICAgICBjb3JyZWxhdG9ycy5wdXNoKGZhbHNlKTtcbiAgICB9XG4gIH0pO1xuXG4gIGJyZWFrcG9pbnRzLnNvcnQoKGEsIGIpID0+IHsgcmV0dXJuIGEgLSBiOyB9KTtcblxuICByZXR1cm4geyBtYXBwaW5nLCBicmVha3BvaW50cywgY29ycmVsYXRvcnMgfTtcbn1cblxuLyoqXG4qIEBkZXNjIERldGVybWluZXMgd2hpY2ggc2V0IG9mIGFkIHNpemVzIGFyZSBhYm91dCB0byBkaXNwbGF5IGJhc2VkIG9uIHRoZSB1c2VycyBjdXJyZW50IHNjcmVlbiBzaXplLlxuKiBAcGFyYW0ge2FycmF5fSBzaXplTWFwcGluZ3MgLSBBbiBhcnJheSBjb250YWluaW5nIHRoZSBhZHZlcnRpc2VtZW50cyBHUFQgcmVhZGFibGUgc2l6ZSBtYXBwaW5nLlxuKiBAcmV0dXJuIHthcnJheX0gLSBSZXR1cm5zIGFuIGFycmF5IGNvbnRhaW5pbmcgdGhlIGFkIHNpemVzIHdoaWNoIHJlbGF0ZSB0byB0aGUgdXNlcnMgY3VycmVudCB3aW5kb3cgd2lkdGguXG4qKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVNpemVNYXBwaW5ncyhzaXplTWFwcGluZ3MpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCB3aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoIHx8XG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoIHx8XG4gICAgZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aDtcblxuICAgIGNvbnN0IGhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodCB8fFxuICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQgfHxcbiAgICBkb2N1bWVudC5ib2R5LmNsaWVudEhlaWdodDtcblxuICAgIGNvbnN0IHNkID0gW3dpZHRoLCBoZWlnaHRdO1xuXG4gICAgLyogRmlsdGVycyBtYXBwaW5ncyB0aGF0IGFyZSB2YWxpZCBieSBjb25maXJtaW5nIHRoYXQgdGhlIGN1cnJlbnQgc2NyZWVuIGRpbWVuc2lvbnNcbiAgICAgIGFyZSBib3RoIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byB0aGUgYnJlYWtwb2ludCBbeCwgeV0gbWluaW11bXMgc3BlY2lmaWVkIGluIHRoZSBmaXJzdCBwb3NpdGlvbiBpbiB0aGUgbWFwcGluZy5cbiAgICAgIFJldHVybnMgdGhlIGxlZnRtb3N0IG1hcHBpbmcncyBzaXplcyBvciBhbiBlbXB0eSBhcnJheS4gKi9cbiAgICBjb25zdCB2YWxpZE1hcHBpbmdzID0gc2l6ZU1hcHBpbmdzLmZpbHRlcigobWFwcGluZykgPT4ge1xuICAgICAgcmV0dXJuIG1hcHBpbmdbMF1bMF0gPD0gc2RbMF0gJiYgbWFwcGluZ1swXVsxXSA8PSBzZFsxXTtcbiAgICB9KTtcblxuICAgIGxldCByZXN1bHQgPSB2YWxpZE1hcHBpbmdzLmxlbmd0aCA+IDAgPyB2YWxpZE1hcHBpbmdzWzBdWzFdIDogW107XG5cbiAgICBpZiAocmVzdWx0Lmxlbmd0aCA+IDAgJiYgcmVzdWx0WzBdLmNvbnN0cnVjdG9yICE9PSBBcnJheSkge1xuICAgICAgLy8gV3JhcHMgdGhlIDFEIGFycmF5IGluIGFub3RoZXIgc2V0IG9mIGJyYWNrZXRzIHRvIG1ha2UgaXQgMkRcbiAgICAgIHJlc3VsdCA9IFtyZXN1bHRdO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICAvLyBGYWxsYmFjayB0byBsYXN0IHNpemUgbWFwcGluZyBzdXBwbGllZCBpZiB0aGVyZSdzIGFuIGludmFsaWQgbWFwcGluZyBwcm92aWRlZFxuICAgIHJldHVybiBzaXplTWFwcGluZ3Nbc2l6ZU1hcHBpbmdzLmxlbmd0aCAtIDFdWzFdO1xuICB9XG59XG5cbi8qKlxuKiBAZGVzYyBSZXNpemUgZXZlbnQgdGhhdCBjaGVja3MgaWYgYSB1c2VyIGhhcyByZXNpemVkIHBhc3QgYSBicmVha3BvaW50IGluY2x1ZGVkIGluIHRoZSBhZHZlcnRpc2VtZW50cyBzaXplbWFwLiBJZiBpdCBoYXMgdGhlIEdQVFxuKiByZWZyZXNoIG1ldGhvZCBpcyBjYWxsZWQgc28gdGhlIHNlcnZpY2UgY2FuIGZldGNoIGEgbW9yZSBhcHJvcHJpYXRlbHkgc2l6ZWQgY3JlYXRpdmUuXG4qIEBwYXJhbSB7b2JqZWN0fSBwYXJhbXMgLSBBbiBvYmplY3QgY29udGFpbmluZyBhbGwgb2YgdGhlIGFkdmVydGlzZW1lbnQgY29uZmlndXJhdGlvbiBzZXR0aW5ncyBzdWNoIGFzIHNsb3QgbmFtZSwgaWQsIGFuZCBwb3NpdGlvbi5cbioqL1xuZXhwb3J0IGZ1bmN0aW9uIHJ1blJlc2l6ZUV2ZW50cyhwYXJhbXMpIHtcbiAgbGV0IGxhc3RCcmVha3BvaW50O1xuICBsZXQgaW5pdGlhbExvYWQgPSBmYWxzZTtcblxuICByZXR1cm4gKCkgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIGFkLFxuICAgICAgYnJlYWtwb2ludHMsXG4gICAgICBpZCxcbiAgICAgIGJpZGRpbmcsXG4gICAgICBtYXBwaW5nLFxuICAgICAgc2xvdE5hbWUsXG4gICAgICB3cmFwcGVyLFxuICAgICAgcHJlcmVuZGVyIH0gPSBwYXJhbXM7XG5cbiAgICBjb25zdCB3aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIGxldCBicmVha3BvaW50O1xuICAgIGxldCBuZXh0QnJlYWtwb2ludDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYnJlYWtwb2ludHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGJyZWFrcG9pbnQgPSBicmVha3BvaW50c1tpXTtcbiAgICAgIG5leHRCcmVha3BvaW50ID0gYnJlYWtwb2ludHNbaSArIDFdO1xuXG4gICAgICBpZiAoKHdpZHRoID4gYnJlYWtwb2ludCAmJiAod2lkdGggPCBuZXh0QnJlYWtwb2ludCB8fCAhbmV4dEJyZWFrcG9pbnQpICYmIGxhc3RCcmVha3BvaW50ICE9PSBicmVha3BvaW50KSB8fCAod2lkdGggPT09IGJyZWFrcG9pbnQgJiYgIWluaXRpYWxMb2FkKSkge1xuICAgICAgICBsYXN0QnJlYWtwb2ludCA9IGJyZWFrcG9pbnQ7XG4gICAgICAgIGluaXRpYWxMb2FkID0gdHJ1ZTtcblxuICAgICAgICAvLyBGZXRjaGVzIGEgc2V0IG9mIGRpbWVuc2lvbnMgZm9yIHRoZSBhZCB3aGljaCBpcyBhYm91dCB0byBkaXNwbGF5LlxuICAgICAgICBjb25zdCBwYXJzZWRTaXplTWFwcGluZyA9IHBhcnNlU2l6ZU1hcHBpbmdzKG1hcHBpbmcpO1xuXG4gICAgICAgIGNvbnN0IGFkSW5mbyA9IHtcbiAgICAgICAgICBhZFVuaXQ6IGFkLFxuICAgICAgICAgIGFkU2xvdDogc2xvdE5hbWUsXG4gICAgICAgICAgYWREaW1lbnNpb25zOiBwYXJzZWRTaXplTWFwcGluZyxcbiAgICAgICAgICBhZElkOiBpZFxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIElmIGl0J3MgaW5jbHVkZWQgaW4gYSBoZWFkZXItYmlkZGluZyBzZXJ2aWNlIHdlIHJlLWZldGNoIGJpZHMgZm9yIHRoZSBnaXZlbiBzbG90LCBvdGhlcndpc2UgaXQgcmVmcmVzaGVzIGFzIG5vcm1hbC5cbiAgICAgICAgaWYgKChiaWRkaW5nLnByZWJpZCAmJiBiaWRkaW5nLnByZWJpZC5lbmFibGVkKSB8fCAoYmlkZGluZy5hbWF6b24gJiYgYmlkZGluZy5hbWF6b24uZW5hYmxlZCkpIHtcbiAgICAgICAgICBmZXRjaEJpZHMoe1xuICAgICAgICAgICAgYWQsXG4gICAgICAgICAgICBpZCxcbiAgICAgICAgICAgIHNsb3ROYW1lLFxuICAgICAgICAgICAgZGltZW5zaW9uczogcGFyc2VkU2l6ZU1hcHBpbmcsXG4gICAgICAgICAgICBiaWRkaW5nLFxuICAgICAgICAgICAgd3JhcHBlcixcbiAgICAgICAgICAgIHByZXJlbmRlcixcbiAgICAgICAgICAgIGNvcnJlbGF0b3I6IHNpemVtYXBMaXN0ZW5lcnNbaWRdLmNvcnJlbGF0b3JzW2ldLFxuICAgICAgICAgICAgYnJlYWtwb2ludHNcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZWZyZXNoU2xvdCh7XG4gICAgICAgICAgICBhZCxcbiAgICAgICAgICAgIGNvcnJlbGF0b3I6IHNpemVtYXBMaXN0ZW5lcnNbaWRdLmNvcnJlbGF0b3JzW2ldLFxuICAgICAgICAgICAgcHJlcmVuZGVyLFxuICAgICAgICAgICAgaW5mbzogYWRJbmZvXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgc2l6ZW1hcExpc3RlbmVyc1tpZF0uY29ycmVsYXRvcnNbaV0gPSB0cnVlO1xuICAgIH1cbiAgfTtcbn1cblxuLyoqXG4qIEBkZXNjIEFzc2lnbnMgYW4gZXZlbnQgbGlzdGVuZXIgZm9yIGEgc2l6ZSBtYXBwZWQgYWQgd2hpY2ggZGV0ZWN0cyB3aGVuIHRoZSBzY3JlZW4gcmVzaXplcyBwYXN0IGEgYnJlYWtwb2ludCBpbiB0aGUgc2l6ZW1hcC5cbiogQWxzbyBzdG9yZXMgdGhlIGV2ZW50IGxpc3RlbmVyIGluIGFuIG9iamVjdCBzb3J0ZWQgYnkgdGhlIGFkdmVydGlzZW1lbnQgaWQgc28gaXQgY2FuIGJlIHVuYm91bmQgbGF0ZXIgaWYgbmVlZGVkLlxuKiBAcGFyYW0ge29iamVjdH0gcGFyYW1zIC0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgYWxsIG9mIHRoZSBhZHZlcnRpc2VtZW50IGNvbmZpZ3VyYXRpb24gc2V0dGluZ3Mgc3VjaCBhcyBzbG90IG5hbWUsIGlkLCBhbmQgcG9zaXRpb24uXG4qKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRSZXNpemVMaXN0ZW5lcihwYXJhbXMpIHtcbiAgY29uc3QgeyBpZCwgY29ycmVsYXRvcnMgfSA9IHBhcmFtcztcblxuICByZXNpemVMaXN0ZW5lcnNbaWRdID0gZGVib3VuY2UocnVuUmVzaXplRXZlbnRzKHBhcmFtcyksIDI1MCk7XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCByZXNpemVMaXN0ZW5lcnNbaWRdKTtcblxuICAvLyBBZGRzIHRoZSBsaXN0ZW5lciB0byBhbiBvYmplY3Qgd2l0aCB0aGUgaWQgYXMgdGhlIGtleSBzbyB3ZSBjYW4gdW5iaW5kIGl0IGxhdGVyLlxuICBzaXplbWFwTGlzdGVuZXJzW2lkXSA9IHsgbGlzdGVuZXI6IHJlc2l6ZUxpc3RlbmVyc1tpZF0sIGNvcnJlbGF0b3JzIH07XG59XG5cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9zZXJ2aWNlcy9zaXplbWFwcGluZy5qcyIsIi8qKlxuKiBAZGVzYyBEZWJvdW5jZXMgYSBmdW5jdGlvbiBwcmV2ZW50aW5nIGl0IGZyb20gcnVubmluZyBtb3JlIHRoZW4gZXZlcnkgc28gbWFueSBtaWxsaXNlY29uZHMuIFVzZWZ1bCBmb3Igc2Nyb2xsIG9yIHJlc2l6ZSBoYW5kbGVycy5cbiogQHBhcmFtIHtmdW5jdGlvbn0gZnVuYyAtIFRoZSBmdW5jdGlvbiB0aGF0IHNob3VsZCBiZSBkZWJvdW5jZWQuXG4qIEBwYXJhbSB7bnVtYmVyfSB3YWl0IC0gVGhlIGFtb3VudCBvZiB0aW1lIGEgZnVuY3Rpb24gc2hvdWxkIHdhaXQgYmVmb3JlIGl0IGZpcmVzIGFnYWluLlxuKiBAcmV0dXJuIC0gUmV0dXJucyBhIGZ1bmN0aW9uIGV2ZXJ5IHNvIG1hbnkgbWlsbGlzZWNvbmRzIGJhc2VkIG9uIHRoZSBwcm92aWRlZCBwYXJhbWV0ZXJzLlxuKiovXG5leHBvcnQgZnVuY3Rpb24gZGVib3VuY2UoZnVuYywgd2FpdCkge1xuICBsZXQgdGltZW91dDtcbiAgcmV0dXJuIGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgZnVuYy5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9LCB3YWl0KTtcbiAgfTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy91dGlsL2RlYm91bmNlLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==