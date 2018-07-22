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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
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

var _resources = __webpack_require__(3);

var _query = __webpack_require__(14);

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
    return dfpCode + '/' + slotOverride;
  }
  return dfpCode + '/' + slotName;
}

/***/ }),
/* 1 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initializeBiddingServices = initializeBiddingServices;
exports.fetchBids = fetchBids;

var _resources = __webpack_require__(3);

var _prebid = __webpack_require__(4);

var _amazon = __webpack_require__(15);

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

  window.arcBiddingReady = false;

  var enablePrebid = new Promise(function (resolve) {
    if (prebid && prebid.enabled) {
      var pbjs = pbjs || {};
      pbjs.que = pbjs.que || [];

      resolve('Prebid has been initialized');
    } else {
      resolve('Prebid is not enabled on the wrapper...');
    }
  });

  var enableAmazon = new Promise(function (resolve) {
    if (amazon && amazon.enabled) {
      (0, _resources.appendResource)('script', '//c.amazon-adsystem.com/aax2/apstag.js', true, true, function () {
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
          console.warn('ArcAds: Missing Amazon account id. \n            Documentation: https://github.com/wapopartners/arc-ads#amazon-tama9');
          resolve('Amazon is not enabled on the wrapper...');
        }
      });
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
      prerender = _ref2.prerender;

  var adInfo = {
    adUnit: ad,
    adSlot: slotName,
    adDimensions: dimensions,
    adId: id
  };

  var prebidBids = new Promise(function (resolve) {
    if (wrapper.prebid && wrapper.prebid.enabled) {
      var timeout = wrapper.prebid.timeout || 700;
      if (bidding.prebid.slotSuffix) {
        adInfo.adSlot = '' + slotName + bidding.prebid.slotSuffix;
      }

      _prebid.queuePrebidCommand.bind(_this, (0, _prebid.fetchPrebidBids)(ad, id, timeout, adInfo, prerender, function () {
        resolve('Fetched Prebid ads!');
      }));
    } else {
      resolve('Prebid is not enabled on the wrapper...');
    }
  });

  var amazonBids = new Promise(function (resolve) {
    if (wrapper.amazon && wrapper.amazon.enabled) {
      var targetedSlotName = bidding.amazon.slotSuffix ? '' + slotName + bidding.amazon.slotSuffix : slotName;

      (0, _amazon.fetchAmazonBids)(id, targetedSlotName, dimensions, function () {
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
      fetchBids({
        ad: ad,
        id: id,
        slotName: slotName,
        dimensions: dimensions,
        wrapper: wrapper,
        bidding: bidding,
        correlator: correlator,
        prerender: prerender
      });
    }, 200);
  }
}

/***/ }),
/* 3 */
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
/* 4 */
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
* @param {string} id - A string containing the advertisement id corresponding to the div the advertisement will load into.
* @param {number} timeout - An integer communicating how long in ms the Prebid.js service should wait before it closes the auction for a lot.
* @param {object} info - An object containing information about the advertisement that is about to load.
* @param {function} prerender - An optional function that will run before the advertisement renders.
* @param {function} cb - An optional callback function that should fire whenever the bidding has concluded.
**/
function fetchPrebidBids(ad, id, timeout, info, prerender) {
  var cb = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;

  pbjs.requestBids({
    timeout: timeout,
    adUnitCodes: [id],
    bidsBackHandler: function bidsBackHandler() {
      pbjs.setTargetingForGPTAsync([id]);
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
* @param {string} code - Contains the div id used for the advertisement
* @param {array} sizes - An array of applicable ad sizes that are available for bidding.
* @param {object} bids - Contains all of the applicable bid data, such as which vendors to use and their placement ids.
* @param {object} wrapper - An object containing all enabled services on the Arc Ads.
**/
function addUnit(code, sizes, bids) {
  var wrapper = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  // Formats the add unit for prebid..
  var slot = { code: code, sizes: sizes, bids: bids };
  var sizeConfig = wrapper.sizeConfig;


  pbjs.addAdUnits(slot);

  if (sizeConfig) {
    pbjs.setConfig({ sizeConfig: [sizeConfig] });
  }
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ArcAds = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(6);

var _mobile = __webpack_require__(12);

var _customTargeting = __webpack_require__(13);

var _headerbidding = __webpack_require__(2);

var _gpt = __webpack_require__(0);

var _prebid = __webpack_require__(4);

var _sizemapping = __webpack_require__(16);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** @desc Displays an advertisement from Google DFP with optional support for Prebid.js and Amazon TAM/A9. **/
var ArcAds = exports.ArcAds = function () {
  function ArcAds(options) {
    var handleSlotRendered = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    _classCallCheck(this, ArcAds);

    this.dfpId = options.dfp.id || '';
    this.wrapper = options.bidding || {};
    this.positions = [];

    window.isMobile = _mobile.MobileDetection;

    if (this.dfpId === '') {
      console.warn('ArcAds: DFP id is missing from the arcads initialization script.\n        Documentation: https://github.com/wapopartners/arc-ads#getting-started');
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
          dimensions = params.dimensions,
          _params$adType = params.adType,
          adType = _params$adType === undefined ? false : _params$adType,
          _params$targeting = params.targeting,
          targeting = _params$targeting === undefined ? {} : _params$targeting,
          _params$display = params.display,
          display = _params$display === undefined ? 'all' : _params$display,
          _params$bidding = params.bidding,
          bidding = _params$bidding === undefined ? false : _params$bidding;

      /* If positional targeting doesn't exist it gets assigned a numeric value
        based on the order and type of the advertisement. This logic is skipped if adType is not defined. */

      if ((!targeting.hasOwnProperty('position') || _typeof(targeting.position) === 'object') && adType !== false) {
        var position = this.positions[adType] + 1 || 1;
        this.positions[adType] = position;

        if (_typeof(targeting.position) === 'object' && targeting.position.as) {
          Object.assign(position, (0, _customTargeting.renamePositionKey)(targeting, position));
        } else {
          var positionParam = Object.assign(targeting, { position: position });
          Object.assign(params, { targeting: positionParam });
        }
      }

      if (isMobile.any() && display === 'mobile' || !isMobile.any() && display === 'desktop' || display === 'all') {
        // Registers the advertisement with Prebid.js if enabled on both the unit and wrapper.
        if (bidding.prebid && bidding.prebid.bids && this.wrapper.prebid && this.wrapper.prebid.enabled && dimensions) {
          _prebid.queuePrebidCommand.bind(this, (0, _prebid.addUnit)(id, dimensions, bidding.prebid.bids, this.wrapper.prebid));
        }

        (0, _gpt.queueGoogletagCommand)(this.displayAd.bind(this, params));
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
      var parsedDimensions = !dimensions.length ? null : JSON.parse(dimensions);
      var ad = !dimensions ? window.googletag.defineOutOfPageSlot(fullSlotName, id) : window.googletag.defineSlot(fullSlotName, parsedDimensions, id);

      if (sizemap && sizemap.breakpoints && dimensions) {
        var _prepareSizeMaps = (0, _sizemapping.prepareSizeMaps)(parsedDimensions, sizemap.breakpoints),
            mapping = _prepareSizeMaps.mapping,
            breakpoints = _prepareSizeMaps.breakpoints,
            correlators = _prepareSizeMaps.correlators;

        ad.defineSizeMapping(mapping);

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

      ad.addService(window.googletag.pubads());

      (0, _gpt.setTargeting)(ad, targeting);

      if (bidding && dimensions) {
        (0, _headerbidding.fetchBids)({
          ad: ad,
          id: id,
          slotName: fullSlotName,
          dimensions: parsedDimensions,
          wrapper: this.wrapper,
          prerender: prerender,
          bidding: bidding
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
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _promisePolyfill = __webpack_require__(7);

var _promisePolyfill2 = _interopRequireDefault(_promisePolyfill);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (!window.Promise) {
  window.Promise = _promisePolyfill2.default;
}

/* eslint-disable */

// source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill
/* Object.assign() for IE11 (obviously) */
if (typeof Object.assign != 'function') {
  // Must be writable: true, enumerable: false, configurable: true
  Object.defineProperty(Object, "assign", {
    value: function assign(target, varArgs) {
      // .length of function is 2
      'use strict';

      if (target == null) {
        // TypeError if undefined or null
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var to = Object(target);

      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource != null) {
          // Skip over if undefined or null
          for (var nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    },
    writable: true,
    configurable: true
  });
}

/* eslint-enable */

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(setImmediate) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__finally__ = __webpack_require__(11);


// Store setTimeout reference so promise-polyfill will be unaffected by
// other code modifying setTimeout (like sinon.useFakeTimers())
var setTimeoutFunc = setTimeout;

function noop() {}

// Polyfill for Function.prototype.bind
function bind(fn, thisArg) {
  return function() {
    fn.apply(thisArg, arguments);
  };
}

function Promise(fn) {
  if (!(this instanceof Promise))
    throw new TypeError('Promises must be constructed via new');
  if (typeof fn !== 'function') throw new TypeError('not a function');
  this._state = 0;
  this._handled = false;
  this._value = undefined;
  this._deferreds = [];

  doResolve(fn, this);
}

function handle(self, deferred) {
  while (self._state === 3) {
    self = self._value;
  }
  if (self._state === 0) {
    self._deferreds.push(deferred);
    return;
  }
  self._handled = true;
  Promise._immediateFn(function() {
    var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
    if (cb === null) {
      (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
      return;
    }
    var ret;
    try {
      ret = cb(self._value);
    } catch (e) {
      reject(deferred.promise, e);
      return;
    }
    resolve(deferred.promise, ret);
  });
}

function resolve(self, newValue) {
  try {
    // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
    if (newValue === self)
      throw new TypeError('A promise cannot be resolved with itself.');
    if (
      newValue &&
      (typeof newValue === 'object' || typeof newValue === 'function')
    ) {
      var then = newValue.then;
      if (newValue instanceof Promise) {
        self._state = 3;
        self._value = newValue;
        finale(self);
        return;
      } else if (typeof then === 'function') {
        doResolve(bind(then, newValue), self);
        return;
      }
    }
    self._state = 1;
    self._value = newValue;
    finale(self);
  } catch (e) {
    reject(self, e);
  }
}

function reject(self, newValue) {
  self._state = 2;
  self._value = newValue;
  finale(self);
}

function finale(self) {
  if (self._state === 2 && self._deferreds.length === 0) {
    Promise._immediateFn(function() {
      if (!self._handled) {
        Promise._unhandledRejectionFn(self._value);
      }
    });
  }

  for (var i = 0, len = self._deferreds.length; i < len; i++) {
    handle(self, self._deferreds[i]);
  }
  self._deferreds = null;
}

function Handler(onFulfilled, onRejected, promise) {
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
  this.onRejected = typeof onRejected === 'function' ? onRejected : null;
  this.promise = promise;
}

/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 */
function doResolve(fn, self) {
  var done = false;
  try {
    fn(
      function(value) {
        if (done) return;
        done = true;
        resolve(self, value);
      },
      function(reason) {
        if (done) return;
        done = true;
        reject(self, reason);
      }
    );
  } catch (ex) {
    if (done) return;
    done = true;
    reject(self, ex);
  }
}

Promise.prototype['catch'] = function(onRejected) {
  return this.then(null, onRejected);
};

Promise.prototype.then = function(onFulfilled, onRejected) {
  var prom = new this.constructor(noop);

  handle(this, new Handler(onFulfilled, onRejected, prom));
  return prom;
};

Promise.prototype['finally'] = __WEBPACK_IMPORTED_MODULE_0__finally__["a" /* default */];

Promise.all = function(arr) {
  return new Promise(function(resolve, reject) {
    if (!arr || typeof arr.length === 'undefined')
      throw new TypeError('Promise.all accepts an array');
    var args = Array.prototype.slice.call(arr);
    if (args.length === 0) return resolve([]);
    var remaining = args.length;

    function res(i, val) {
      try {
        if (val && (typeof val === 'object' || typeof val === 'function')) {
          var then = val.then;
          if (typeof then === 'function') {
            then.call(
              val,
              function(val) {
                res(i, val);
              },
              reject
            );
            return;
          }
        }
        args[i] = val;
        if (--remaining === 0) {
          resolve(args);
        }
      } catch (ex) {
        reject(ex);
      }
    }

    for (var i = 0; i < args.length; i++) {
      res(i, args[i]);
    }
  });
};

Promise.resolve = function(value) {
  if (value && typeof value === 'object' && value.constructor === Promise) {
    return value;
  }

  return new Promise(function(resolve) {
    resolve(value);
  });
};

Promise.reject = function(value) {
  return new Promise(function(resolve, reject) {
    reject(value);
  });
};

Promise.race = function(values) {
  return new Promise(function(resolve, reject) {
    for (var i = 0, len = values.length; i < len; i++) {
      values[i].then(resolve, reject);
    }
  });
};

// Use polyfill for setImmediate for performance gains
Promise._immediateFn =
  (typeof setImmediate === 'function' &&
    function(fn) {
      setImmediate(fn);
    }) ||
  function(fn) {
    setTimeoutFunc(fn, 0);
  };

Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
  if (typeof console !== 'undefined' && console) {
    console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
  }
};

/* harmony default export */ __webpack_exports__["default"] = (Promise);

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(8).setImmediate))

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var scope = (typeof global !== "undefined" && global) ||
            (typeof self !== "undefined" && self) ||
            window;
var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, scope, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, scope, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(scope, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(9);
// On some exotic environments, it's not clear which object `setimmediate` was
// able to install onto.  Search each possibility in the same order as the
// `setimmediate` library.
exports.setImmediate = (typeof self !== "undefined" && self.setImmediate) ||
                       (typeof global !== "undefined" && global.setImmediate) ||
                       (this && this.setImmediate);
exports.clearImmediate = (typeof self !== "undefined" && self.clearImmediate) ||
                         (typeof global !== "undefined" && global.clearImmediate) ||
                         (this && this.clearImmediate);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(10)))

/***/ }),
/* 10 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (function(callback) {
  var constructor = this.constructor;
  return this.then(
    function(value) {
      return constructor.resolve(callback()).then(function() {
        return value;
      });
    },
    function(reason) {
      return constructor.resolve(callback()).then(function() {
        return constructor.reject(reason);
      });
    }
  );
});


/***/ }),
/* 12 */
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
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renamePositionKey = renamePositionKey;
/**
* @desc If a different key is required to serve position targeting for older creatives, rename it here.
* @param {object} targeting - Targeting object passed in from the ad object.
* @param {number} positionValue - The nth number of adType included.
* @return - Returns the targeting object with the old position value stripped out, and the new one with the desired key in its place.
**/
function renamePositionKey(targeting, positionValue) {
  var newTargetingObject = targeting;
  var keyName = targeting.position.as;
  delete newTargetingObject.position;
  newTargetingObject[keyName] = positionValue;
  Object.assign(targeting, newTargetingObject);
  return targeting;
}

/***/ }),
/* 14 */
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
/* 15 */
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
function fetchAmazonBids(id, slotName, dimensions) {
  var cb = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

  queueAmazonCommand(function () {
    var slot = {
      slotName: slotName,
      slotID: id,
      sizes: dimensions
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
  } else {
    setTimeout(function () {
      queueAmazonCommand(cmd);
    }, 200);
  }
}

/***/ }),
/* 16 */
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

var _debounce = __webpack_require__(17);

var _headerbidding = __webpack_require__(2);

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
  var parsedSizemap = !sizemap.length ? null : JSON.parse(sizemap);

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
            correlator: sizemapListeners[id].correlators[i]
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
/* 17 */
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCAzMjFlYmFhYjFlMGIwYjk0ZmIzOSIsIndlYnBhY2s6Ly8vLi9zcmMvc2VydmljZXMvZ3B0LmpzIiwid2VicGFjazovLy8od2VicGFjaykvYnVpbGRpbi9nbG9iYWwuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NlcnZpY2VzL2hlYWRlcmJpZGRpbmcuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWwvcmVzb3VyY2VzLmpzIiwid2VicGFjazovLy8uL3NyYy9zZXJ2aWNlcy9wcmViaWQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsL3BvbHlmaWxscy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHJvbWlzZS1wb2x5ZmlsbC9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RpbWVycy1icm93c2VyaWZ5L21haW4uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3NldGltbWVkaWF0ZS9zZXRJbW1lZGlhdGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHJvbWlzZS1wb2x5ZmlsbC9zcmMvZmluYWxseS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbC9tb2JpbGUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWwvY3VzdG9tVGFyZ2V0aW5nLmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsL3F1ZXJ5LmpzIiwid2VicGFjazovLy8uL3NyYy9zZXJ2aWNlcy9hbWF6b24uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NlcnZpY2VzL3NpemVtYXBwaW5nLmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsL2RlYm91bmNlLmpzIl0sIm5hbWVzIjpbImluaXRpYWxpemVHUFQiLCJyZWZyZXNoU2xvdCIsInF1ZXVlR29vZ2xldGFnQ29tbWFuZCIsInNldFRhcmdldGluZyIsImRmcFNldHRpbmdzIiwiZGV0ZXJtaW5lU2xvdE5hbWUiLCJ3aW5kb3ciLCJnb29nbGV0YWciLCJjbWQiLCJhZCIsImNvcnJlbGF0b3IiLCJwcmVyZW5kZXIiLCJpbmZvIiwiUHJvbWlzZSIsInJlc29sdmUiLCJ0aGVuIiwiZXJyb3IiLCJjb25zb2xlIiwid2FybiIsInJ1blJlZnJlc2hFdmVudCIsInB1YmFkc1JlYWR5IiwicHViYWRzIiwicmVmcmVzaCIsImNoYW5nZUNvcnJlbGF0b3IiLCJzZXRUaW1lb3V0IiwiZm4iLCJwdXNoIiwib3B0aW9ucyIsImtleSIsImhhc093blByb3BlcnR5IiwiaGFuZGxlU2xvdFJlbmRlckVuZGVkIiwiZGlzYWJsZUluaXRpYWxMb2FkIiwiZW5hYmxlU2luZ2xlUmVxdWVzdCIsImVuYWJsZUFzeW5jUmVuZGVyaW5nIiwiZW5hYmxlU2VydmljZXMiLCJhZGRFdmVudExpc3RlbmVyIiwiZGZwQ29kZSIsInNsb3ROYW1lIiwic2xvdE92ZXJyaWRlIiwiaW5pdGlhbGl6ZUJpZGRpbmdTZXJ2aWNlcyIsImZldGNoQmlkcyIsInByZWJpZCIsImFtYXpvbiIsImFyY0JpZGRpbmdSZWFkeSIsImVuYWJsZVByZWJpZCIsImVuYWJsZWQiLCJwYmpzIiwicXVlIiwiZW5hYmxlQW1hem9uIiwiaWQiLCJhcHN0YWciLCJpbml0IiwicHViSUQiLCJhZFNlcnZlciIsImFsbCIsImRpbWVuc2lvbnMiLCJ3cmFwcGVyIiwiYmlkZGluZyIsImFkSW5mbyIsImFkVW5pdCIsImFkU2xvdCIsImFkRGltZW5zaW9ucyIsImFkSWQiLCJwcmViaWRCaWRzIiwidGltZW91dCIsInNsb3RTdWZmaXgiLCJxdWV1ZVByZWJpZENvbW1hbmQiLCJiaW5kIiwiYW1hem9uQmlkcyIsInRhcmdldGVkU2xvdE5hbWUiLCJhcHBlbmRSZXNvdXJjZSIsInRhZ25hbWUiLCJ1cmwiLCJhc3luYyIsImRlZmVyIiwiY2IiLCJ0YWciLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJzcmMiLCJoZWFkIiwiZG9jdW1lbnRFbGVtZW50IiwiYXBwZW5kQ2hpbGQiLCJmZXRjaFByZWJpZEJpZHMiLCJhZGRVbml0IiwicmVxdWVzdEJpZHMiLCJhZFVuaXRDb2RlcyIsImJpZHNCYWNrSGFuZGxlciIsInNldFRhcmdldGluZ0ZvckdQVEFzeW5jIiwiY29kZSIsInNpemVzIiwiYmlkcyIsInNsb3QiLCJzaXplQ29uZmlnIiwiYWRkQWRVbml0cyIsInNldENvbmZpZyIsIkFyY0FkcyIsImhhbmRsZVNsb3RSZW5kZXJlZCIsImRmcElkIiwiZGZwIiwicG9zaXRpb25zIiwiaXNNb2JpbGUiLCJNb2JpbGVEZXRlY3Rpb24iLCJwYXJhbXMiLCJhZFR5cGUiLCJ0YXJnZXRpbmciLCJkaXNwbGF5IiwicG9zaXRpb24iLCJhcyIsIk9iamVjdCIsImFzc2lnbiIsInBvc2l0aW9uUGFyYW0iLCJhbnkiLCJkaXNwbGF5QWQiLCJjb2xsZWN0aW9uIiwiZm9yRWFjaCIsImFkdmVydCIsInJlZ2lzdGVyQWQiLCJzaXplbWFwIiwiZnVsbFNsb3ROYW1lIiwicGFyc2VkRGltZW5zaW9ucyIsImxlbmd0aCIsIkpTT04iLCJwYXJzZSIsImRlZmluZU91dE9mUGFnZVNsb3QiLCJkZWZpbmVTbG90IiwiYnJlYWtwb2ludHMiLCJtYXBwaW5nIiwiY29ycmVsYXRvcnMiLCJkZWZpbmVTaXplTWFwcGluZyIsImFkZFNlcnZpY2UiLCJkZWZpbmVQcm9wZXJ0eSIsInZhbHVlIiwidGFyZ2V0IiwidmFyQXJncyIsIlR5cGVFcnJvciIsInRvIiwiaW5kZXgiLCJhcmd1bWVudHMiLCJuZXh0U291cmNlIiwibmV4dEtleSIsInByb3RvdHlwZSIsImNhbGwiLCJ3cml0YWJsZSIsImNvbmZpZ3VyYWJsZSIsIm5hdmlnYXRvciIsInVzZXJBZ2VudCIsIm1hdGNoIiwicmV0aW5hIiwiZGV2aWNlUGl4ZWxSYXRpbyIsIkFuZHJvaWQiLCJLaW5kbGUiLCJLaW5kbGVGaXJlIiwiU2lsayIsIkJsYWNrQmVycnkiLCJpT1MiLCJXaW5kb3dzIiwiRmlyZWZveE9TIiwicmVuYW1lUG9zaXRpb25LZXkiLCJwb3NpdGlvblZhbHVlIiwibmV3VGFyZ2V0aW5nT2JqZWN0Iiwia2V5TmFtZSIsImV4cGFuZFF1ZXJ5U3RyaW5nIiwicGFyYW0iLCJsb2NhdGlvbiIsImhyZWYiLCJuYW1lIiwicmVwbGFjZSIsInJlZ2V4IiwiUmVnRXhwIiwicmVzdWx0cyIsImV4ZWMiLCJkZWNvZGVVUklDb21wb25lbnQiLCJmZXRjaEFtYXpvbkJpZHMiLCJxdWV1ZUFtYXpvbkNvbW1hbmQiLCJzbG90SUQiLCJzbG90cyIsInNldERpc3BsYXlCaWRzIiwicHJlcGFyZVNpemVNYXBzIiwicGFyc2VTaXplTWFwcGluZ3MiLCJydW5SZXNpemVFdmVudHMiLCJzZXRSZXNpemVMaXN0ZW5lciIsInNpemVtYXBMaXN0ZW5lcnMiLCJyZXNpemVMaXN0ZW5lcnMiLCJwYXJzZWRTaXplbWFwIiwiaW5kZXhPZiIsInNvcnQiLCJhIiwiYiIsInNpemVNYXBwaW5ncyIsIndpZHRoIiwiaW5uZXJXaWR0aCIsImNsaWVudFdpZHRoIiwiYm9keSIsImhlaWdodCIsImlubmVySGVpZ2h0IiwiY2xpZW50SGVpZ2h0Iiwic2QiLCJ2YWxpZE1hcHBpbmdzIiwiZmlsdGVyIiwicmVzdWx0IiwiY29uc3RydWN0b3IiLCJBcnJheSIsImUiLCJsYXN0QnJlYWtwb2ludCIsImluaXRpYWxMb2FkIiwiYnJlYWtwb2ludCIsIm5leHRCcmVha3BvaW50IiwiaSIsInBhcnNlZFNpemVNYXBwaW5nIiwibGlzdGVuZXIiLCJkZWJvdW5jZSIsImZ1bmMiLCJ3YWl0IiwiYXJncyIsImNsZWFyVGltZW91dCIsImFwcGx5Il0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTztBQ1ZBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtB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QTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EseUNBQXlDO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxVQUFVO0FBQ1Y7QUFDQTs7QUFFQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDOzs7Ozs7OztBQ3pMRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Es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QXJCLENBQWlDZ0YsQ0FBakMsQ0FGRjtBQUdWck0sZ0NBSFU7QUFJVkMsa0JBQU04QztBQUpJLFdBQVo7QUFNRDtBQUNGOztBQUVENEgsdUJBQWlCckksRUFBakIsRUFBcUIrRSxXQUFyQixDQUFpQ2dGLENBQWpDLElBQXNDLElBQXRDO0FBQ0Q7QUFDRixHQXpERDtBQTBERDs7QUFFRDs7Ozs7QUFLTyxTQUFTM0IsaUJBQVQsQ0FBMkI5RSxNQUEzQixFQUFtQztBQUFBLE1BQ2hDdEQsRUFEZ0MsR0FDWnNELE1BRFksQ0FDaEN0RCxFQURnQztBQUFBLE1BQzVCK0UsV0FENEIsR0FDWnpCLE1BRFksQ0FDNUJ5QixXQUQ0Qjs7O0FBR3hDdUQsa0JBQWdCdEksRUFBaEIsSUFBc0Isd0JBQVNtSSxnQkFBZ0I3RSxNQUFoQixDQUFULEVBQWtDLEdBQWxDLENBQXRCO0FBQ0FqRyxTQUFPNkIsZ0JBQVAsQ0FBd0IsUUFBeEIsRUFBa0NvSixnQkFBZ0J0SSxFQUFoQixDQUFsQzs7QUFFQTtBQUNBcUksbUJBQWlCckksRUFBakIsSUFBdUIsRUFBRWlLLFVBQVUzQixnQkFBZ0J0SSxFQUFoQixDQUFaLEVBQWlDK0Usd0JBQWpDLEVBQXZCO0FBQ0QsQzs7Ozs7Ozs7Ozs7O1FDdEplbUYsUSxHQUFBQSxRO0FBTmhCOzs7Ozs7QUFNTyxTQUFTQSxRQUFULENBQWtCQyxJQUFsQixFQUF3QkMsSUFBeEIsRUFBOEI7QUFDbkMsTUFBSXJKLGdCQUFKO0FBQ0EsU0FBTyxZQUFtQjtBQUFBOztBQUFBLHNDQUFOc0osSUFBTTtBQUFOQSxVQUFNO0FBQUE7O0FBQ3hCQyxpQkFBYXZKLE9BQWI7QUFDQUEsY0FBVXhDLFdBQVcsWUFBTTtBQUN6QndDLGdCQUFVLElBQVY7QUFDQW9KLFdBQUtJLEtBQUwsUUFBaUJGLElBQWpCO0FBQ0QsS0FIUyxFQUdQRCxJQUhPLENBQVY7QUFJRCxHQU5EO0FBT0QsQyIsImZpbGUiOiJhcmNhZHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2Uge1xuXHRcdHZhciBhID0gZmFjdG9yeSgpO1xuXHRcdGZvcih2YXIgaSBpbiBhKSAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnID8gZXhwb3J0cyA6IHJvb3QpW2ldID0gYVtpXTtcblx0fVxufSkodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnID8gc2VsZiA6IHRoaXMsIGZ1bmN0aW9uKCkge1xucmV0dXJuIFxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA1KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCAzMjFlYmFhYjFlMGIwYjk0ZmIzOSIsImltcG9ydCB7IGFwcGVuZFJlc291cmNlIH0gZnJvbSAnLi4vdXRpbC9yZXNvdXJjZXMnO1xuaW1wb3J0IHsgZXhwYW5kUXVlcnlTdHJpbmcgfSBmcm9tICcuLi91dGlsL3F1ZXJ5JztcblxuLyoqXG4qIEBkZXNjIEluaXRpYWxpemVzIHRoZSBHb29nbGUgUHVibGlzaGVyIHRhZyBzY3JpcHRzLlxuKiovXG5leHBvcnQgZnVuY3Rpb24gaW5pdGlhbGl6ZUdQVCgpIHtcbiAgd2luZG93Lmdvb2dsZXRhZyA9IHdpbmRvdy5nb29nbGV0YWcgfHwge307XG4gIHdpbmRvdy5nb29nbGV0YWcuY21kID0gd2luZG93Lmdvb2dsZXRhZy5jbWQgfHwgW107XG5cbiAgYXBwZW5kUmVzb3VyY2UoJ3NjcmlwdCcsICcvL3d3dy5nb29nbGV0YWdzZXJ2aWNlcy5jb20vdGFnL2pzL2dwdC5qcycsIHRydWUsIHRydWUpO1xufVxuXG4vKipcbiogQGRlc2MgUmVmcmVzaGVzIGFuIGFkdmVydGlzZW1lbnQgdmlhIHRoZSBHUFQgcmVmcmVzaCBtZXRob2QuIElmIGEgcHJlcmVuZGVyIGZ1bmN0aW9uIGlzIHByb3ZpZGVkIGl0IGlzIGV4ZWN1dGVkIHByaW9yIHRvIHRoZSByZWZyZXNoLlxuKiBAcGFyYW0ge29iamVjdH0gb2JqIC0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgYWxsIG9mIHRoZSBmdW5jdGlvbiBhcmd1bWVudHMuXG4qIEBwYXJhbSB7T2JqZWN0fSBvYmouYWQgLSBBbiBvYmplY3QgY29udGFpbmluZyB0aGUgR1BUIGFkIHNsb3QuXG4qIEBwYXJhbSB7Ym9vbGVhbn0gb2JqLmNvcnJlbGF0b3IgLSBBbiBvcHRpb25hbCBib29sZWFuIHRoYXQgZGVzY3JpYmVzIGlmIHRoZSBjb3JyZWxhdG9yIHZhbHVlIHNob3VsZCB1cGRhdGUgb3Igbm90LlxuKiBAcGFyYW0ge2Z1bmN0aW9ufSBvYmoucHJlcmVuZGVyIC0gQW4gb3B0aW9uYWwgZnVuY3Rpb24gdGhhdCB3aWxsIHJ1biBiZWZvcmUgdGhlIGFkdmVydGlzZW1lbnQgcmVuZGVycy5cbiogQHBhcmFtIHtvYmplY3R9IG9iai5pbmZvIC0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGFkdmVydGlzZW1lbnQgdGhhdCBpcyBhYm91dCB0byBsb2FkLlxuKiovXG5leHBvcnQgZnVuY3Rpb24gcmVmcmVzaFNsb3Qoe1xuICBhZCxcbiAgY29ycmVsYXRvciA9IGZhbHNlLFxuICBwcmVyZW5kZXIgPSBudWxsLFxuICBpbmZvID0ge31cbn0pIHtcbiAgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBpZiAocHJlcmVuZGVyKSB7XG4gICAgICB0cnkge1xuICAgICAgICBwcmVyZW5kZXIoaW5mbykudGhlbigoKSA9PiB7XG4gICAgICAgICAgcmVzb2x2ZSgnUHJlcmVuZGVyIGZ1bmN0aW9uIGhhcyBjb21wbGV0ZWQuJyk7XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS53YXJuKGBBcmNBZHM6IFByZXJlbmRlciBmdW5jdGlvbiBkaWQgbm90IHJldHVybiBhIHByb21pc2Ugb3IgdGhlcmUgd2FzIGFuIGVycm9yLlxuICAgICAgICAgIERvY3VtZW50YXRpb246IGh0dHBzOi8vZ2l0aHViLmNvbS93YXBvcGFydG5lcnMvYXJjLWFkcy93aWtpL1V0aWxpemluZy1hLVByZXJlbmRlci1Ib29rYCk7XG4gICAgICAgIHJlc29sdmUoJ1ByZXJlbmRlciBmdW5jdGlvbiBkaWQgbm90IHJldHVybiBhIHByb21pc2Ugb3IgdGhlcmUgd2FzIGFuIGVycm9yLCBpZ25vcmluZy4nKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmVzb2x2ZSgnTm8gUHJlcmVuZGVyIGZ1bmN0aW9uIHdhcyBwcm92aWRlZC4nKTtcbiAgICB9XG4gIH0pLnRoZW4oKCkgPT4ge1xuICAgIHJ1blJlZnJlc2hFdmVudCgpO1xuICB9KTtcblxuICBmdW5jdGlvbiBydW5SZWZyZXNoRXZlbnQoKSB7XG4gICAgaWYgKHdpbmRvdy5nb29nbGV0YWcgJiYgZ29vZ2xldGFnLnB1YmFkc1JlYWR5KSB7XG4gICAgICB3aW5kb3cuZ29vZ2xldGFnLnB1YmFkcygpLnJlZnJlc2goW2FkXSwgeyBjaGFuZ2VDb3JyZWxhdG9yOiBjb3JyZWxhdG9yIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgcnVuUmVmcmVzaEV2ZW50KCk7XG4gICAgICB9LCAyMDApO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiogQGRlc2MgUXVldWVzIGEgY29tbWFuZCBpbnNpZGUgb2YgR1BULlxuKiBAcGFyYW0ge2Z1bmN0aW9ufSBmbiAtIEFjY2VwdHMgYSBmdW5jdGlvbiB0byBwdXNoIGludG8gdGhlIFByZWJpZCBjb21tYW5kIHF1ZXVlLlxuKiovXG5leHBvcnQgZnVuY3Rpb24gcXVldWVHb29nbGV0YWdDb21tYW5kKGZuKSB7XG4gIHdpbmRvdy5nb29nbGV0YWcuY21kLnB1c2goZm4pO1xufVxuXG4vKipcbiogQGRlc2MgQXNzaWducyBrZXkvdmFsdWUgdGFyZ2V0aW5nIHRvIGEgc3BlY2lmaWMgYWR2ZXJ0aXNlbWVudC5cbiogQHBhcmFtIHtPYmplY3R9IGFkIC0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIEdQVCBhZCBzbG90LlxuKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIEFuIG9iamVjdCBjb250YWluaW5nIGFsbCBvZiB0aGUga2V5L3ZhbHVlIHRhcmdldGluZyBwYWlycyB0byBhc3NpZ24gdG8gdGhlIGFkdmVydGlzZW1lbnQuXG4qKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRUYXJnZXRpbmcoYWQsIG9wdGlvbnMpIHtcbiAgZm9yIChjb25zdCBrZXkgaW4gb3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zLmhhc093blByb3BlcnR5KGtleSkgJiYgb3B0aW9uc1trZXldKSB7XG4gICAgICBhZC5zZXRUYXJnZXRpbmcoa2V5LCBvcHRpb25zW2tleV0pO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiogQGRlc2MgQ29uZmlndXJlcyB0aGUgR1BUIGNvbmZpZ3VyYXRpb24gb3B0aW9ucy5cbiogQHBhcmFtIHtmdW5jdGlvbn0gaGFuZGxlU2xvdFJlbmRlckVuZGVkIC0gQ2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBnZXRzIGZpcmVkIHdoZW5ldmVyIGEgR1BUIGFkIHNsb3QgaGFzIGZpbmlzaGVkIHJlbmRlcmluZy5cbioqL1xuZXhwb3J0IGZ1bmN0aW9uIGRmcFNldHRpbmdzKGhhbmRsZVNsb3RSZW5kZXJFbmRlZCkge1xuICB3aW5kb3cuZ29vZ2xldGFnLnB1YmFkcygpLmRpc2FibGVJbml0aWFsTG9hZCgpO1xuICB3aW5kb3cuZ29vZ2xldGFnLnB1YmFkcygpLmVuYWJsZVNpbmdsZVJlcXVlc3QoKTtcbiAgd2luZG93Lmdvb2dsZXRhZy5wdWJhZHMoKS5lbmFibGVBc3luY1JlbmRlcmluZygpO1xuICB3aW5kb3cuZ29vZ2xldGFnLmVuYWJsZVNlcnZpY2VzKCk7XG5cbiAgaWYgKGhhbmRsZVNsb3RSZW5kZXJFbmRlZCkge1xuICAgIHdpbmRvdy5nb29nbGV0YWcucHViYWRzKCkuYWRkRXZlbnRMaXN0ZW5lcignc2xvdFJlbmRlckVuZGVkJywgaGFuZGxlU2xvdFJlbmRlckVuZGVkKTtcbiAgfVxufVxuXG4vKipcbiogQGRlc2MgRGV0ZXJtaW5lcyB0aGUgZnVsbCBzbG90IG5hbWUgb2YgdGhlIGFkIHVuaXQuIElmIGEgdXNlciBhcHBlbmRzIGFuICdhZHNsb3QnIHF1ZXJ5IHBhcmFtZXRlciB0byB0aGUgcGFnZSBVUkwgdGhlIHNsb3QgbmFtZSB3aWxsIGJlIHZlcnJpZGRlbi5cbiogQHBhcmFtIHtzdHJpbmd9IGRmcENvZGUgLSBBIHN0cmluZyBjb250YWluaW5nIHRoZSBwdWJsaXNoZXJzIERGUCBpZCBjb2RlLlxuKiBAcGFyYW0ge3N0cmluZ30gc2xvdE5hbWUgLSBBIHN0cmluZyBjb250YWluaW5nIHRoZSBzbG90IG5hbWUgb2YgdGhlIGFkdmVydGlzZW1lbnQsIGZvciBleGFtcGxlICdob21lcGFnZScuXG4qIEByZXR1cm4gLSBSZXR1cm5zIGEgc3RyaW5nIGNvbWJpbmluZyB0aGUgREZQIGlkIGNvZGUgYW5kIHRoZSBzbG90IG5hbWUsIGZvciBleGFtcGxlICcxMjMvaG9tZXBhZ2UnLlxuKiovXG5leHBvcnQgZnVuY3Rpb24gZGV0ZXJtaW5lU2xvdE5hbWUoZGZwQ29kZSwgc2xvdE5hbWUpIHtcbiAgY29uc3Qgc2xvdE92ZXJyaWRlID0gZXhwYW5kUXVlcnlTdHJpbmcoJ2Fkc2xvdCcpO1xuICBpZiAoc2xvdE92ZXJyaWRlICYmIChzbG90T3ZlcnJpZGUgIT09ICcnIHx8IHNsb3RPdmVycmlkZSAhPT0gbnVsbCkpIHtcbiAgICByZXR1cm4gYCR7ZGZwQ29kZX0vJHtzbG90T3ZlcnJpZGV9YDtcbiAgfVxuICByZXR1cm4gYCR7ZGZwQ29kZX0vJHtzbG90TmFtZX1gO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3NlcnZpY2VzL2dwdC5qcyIsInZhciBnO1xyXG5cclxuLy8gVGhpcyB3b3JrcyBpbiBub24tc3RyaWN0IG1vZGVcclxuZyA9IChmdW5jdGlvbigpIHtcclxuXHRyZXR1cm4gdGhpcztcclxufSkoKTtcclxuXHJcbnRyeSB7XHJcblx0Ly8gVGhpcyB3b3JrcyBpZiBldmFsIGlzIGFsbG93ZWQgKHNlZSBDU1ApXHJcblx0ZyA9IGcgfHwgRnVuY3Rpb24oXCJyZXR1cm4gdGhpc1wiKSgpIHx8ICgxLGV2YWwpKFwidGhpc1wiKTtcclxufSBjYXRjaChlKSB7XHJcblx0Ly8gVGhpcyB3b3JrcyBpZiB0aGUgd2luZG93IHJlZmVyZW5jZSBpcyBhdmFpbGFibGVcclxuXHRpZih0eXBlb2Ygd2luZG93ID09PSBcIm9iamVjdFwiKVxyXG5cdFx0ZyA9IHdpbmRvdztcclxufVxyXG5cclxuLy8gZyBjYW4gc3RpbGwgYmUgdW5kZWZpbmVkLCBidXQgbm90aGluZyB0byBkbyBhYm91dCBpdC4uLlxyXG4vLyBXZSByZXR1cm4gdW5kZWZpbmVkLCBpbnN0ZWFkIG9mIG5vdGhpbmcgaGVyZSwgc28gaXQnc1xyXG4vLyBlYXNpZXIgdG8gaGFuZGxlIHRoaXMgY2FzZS4gaWYoIWdsb2JhbCkgeyAuLi59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGc7XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vICh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBhcHBlbmRSZXNvdXJjZSB9IGZyb20gJy4uL3V0aWwvcmVzb3VyY2VzJztcbmltcG9ydCB7IGZldGNoUHJlYmlkQmlkcywgcXVldWVQcmViaWRDb21tYW5kIH0gZnJvbSAnLi9wcmViaWQnO1xuaW1wb3J0IHsgZmV0Y2hBbWF6b25CaWRzLCBxdWV1ZUFtYXpvbkNvbW1hbmQgfSBmcm9tICcuL2FtYXpvbic7XG5pbXBvcnQgeyByZWZyZXNoU2xvdCB9IGZyb20gJy4vZ3B0JztcblxuLyoqXG4qIEBkZXNjIEluaXRpYWxpemVzIGFsbCBoZWFkZXIgYmlkZGluZyBzZXJ2aWNlcyBhbmQgYXBwZW5kcyB0aGUgYXBwbGljYWJsZSBzY3JpcHRzIHRvIHRoZSBwYWdlLlxuKiBAcGFyYW0ge29iamVjdH0gb2JqIC0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgYWxsIG9mIHRoZSBmdW5jdGlvbiBhcmd1bWVudHMuXG4qIEBwYXJhbSB7b2JqZWN0fSBvYmoucHJlYmlkIC0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgY29uZmlndXJhdGlvbiBkYXRhIGZvciBQcmViaWQuanMuXG4qIEBwYXJhbSB7b2JqZWN0fSBvYmouYW1hem9uIC0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgY29uZmlndXJhdGlvbiBkYXRhIGZvciBBbWF6b24gQTkgYW5kIFRBTS5cbioqL1xuZXhwb3J0IGZ1bmN0aW9uIGluaXRpYWxpemVCaWRkaW5nU2VydmljZXMoe1xuICBwcmViaWQgPSBmYWxzZSxcbiAgYW1hem9uID0gZmFsc2Vcbn0pIHtcbiAgd2luZG93LmFyY0JpZGRpbmdSZWFkeSA9IGZhbHNlO1xuXG4gIGNvbnN0IGVuYWJsZVByZWJpZCA9IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgaWYgKHByZWJpZCAmJiBwcmViaWQuZW5hYmxlZCkge1xuICAgICAgY29uc3QgcGJqcyA9IHBianMgfHwge307XG4gICAgICBwYmpzLnF1ZSA9IHBianMucXVlIHx8IFtdO1xuXG4gICAgICByZXNvbHZlKCdQcmViaWQgaGFzIGJlZW4gaW5pdGlhbGl6ZWQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzb2x2ZSgnUHJlYmlkIGlzIG5vdCBlbmFibGVkIG9uIHRoZSB3cmFwcGVyLi4uJyk7XG4gICAgfVxuICB9KTtcblxuICBjb25zdCBlbmFibGVBbWF6b24gPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIGlmIChhbWF6b24gJiYgYW1hem9uLmVuYWJsZWQpIHtcbiAgICAgIGFwcGVuZFJlc291cmNlKCdzY3JpcHQnLCAnLy9jLmFtYXpvbi1hZHN5c3RlbS5jb20vYWF4Mi9hcHN0YWcuanMnLCB0cnVlLCB0cnVlLCAoKSA9PiB7XG4gICAgICAgIGlmIChhbWF6b24uaWQgJiYgYW1hem9uLmlkICE9PSAnJykge1xuICAgICAgICAgIHF1ZXVlQW1hem9uQ29tbWFuZCgoKSA9PiB7XG4gICAgICAgICAgICAvLyBJbml0aWFsaXplcyB0aGUgQW1hem9uIEFQUyB0YWcgc2NyaXB0LlxuICAgICAgICAgICAgd2luZG93LmFwc3RhZy5pbml0KHtcbiAgICAgICAgICAgICAgcHViSUQ6IGFtYXpvbi5pZCxcbiAgICAgICAgICAgICAgYWRTZXJ2ZXI6ICdnb29nbGV0YWcnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmVzb2x2ZSgnQW1hem9uIHNjcmlwdHMgaGF2ZSBiZWVuIGFkZGVkIG9udG8gdGhlIHBhZ2UhJyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKGBBcmNBZHM6IE1pc3NpbmcgQW1hem9uIGFjY291bnQgaWQuIFxuICAgICAgICAgICAgRG9jdW1lbnRhdGlvbjogaHR0cHM6Ly9naXRodWIuY29tL3dhcG9wYXJ0bmVycy9hcmMtYWRzI2FtYXpvbi10YW1hOWApO1xuICAgICAgICAgIHJlc29sdmUoJ0FtYXpvbiBpcyBub3QgZW5hYmxlZCBvbiB0aGUgd3JhcHBlci4uLicpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzb2x2ZSgnQW1hem9uIGlzIG5vdCBlbmFibGVkIG9uIHRoZSB3cmFwcGVyLi4uJyk7XG4gICAgfVxuICB9KTtcblxuICAvLyBXYWl0cyBmb3IgYWxsIGhlYWRlciBiaWRkaW5nIHNlcnZpY2VzIHRvIGJlIGluaXRpYWxpemVkIGJlZm9yZSB0ZWxsaW5nIHRoZSBzZXJ2aWNlIGl0J3MgcmVhZHkgdG8gcmV0cmlldmUgYmlkcy5cbiAgUHJvbWlzZS5hbGwoW2VuYWJsZVByZWJpZCwgZW5hYmxlQW1hem9uXSlcbiAgICAudGhlbigoKSA9PiB7XG4gICAgICB3aW5kb3cuYXJjQmlkZGluZ1JlYWR5ID0gdHJ1ZTtcbiAgICB9KTtcbn1cblxuLyoqXG4qIEBkZXNjIEZldGNoZXMgYSBiaWQgZm9yIGFuIGFkdmVydGlzZW1lbnQgYmFzZWQgb24gd2hpY2ggc2VydmljZXMgYXJlIGVuYWJsZWQgb24gdW5pdCBhbmQgdGhlIHdyYXBwZXIuXG4qIEBwYXJhbSB7b2JqZWN0fSBvYmogLSBBbiBvYmplY3QgY29udGFpbmluZyBhbGwgb2YgdGhlIGZ1bmN0aW9uIGFyZ3VtZW50cy5cbiogQHBhcmFtIHtPYmplY3R9IG9iai5hZCAtIEFuIG9iamVjdCBjb250YWluaW5nIHRoZSBHUFQgYWQgc2xvdC5cbiogQHBhcmFtIHtzdHJpbmd9IG9iai5pZCAtIEEgc3RyaW5nIGNvbnRhaW5pbmcgdGhlIGFkdmVydGlzZW1lbnQgaWQgY29ycmVzcG9uZGluZyB0byB0aGUgZGl2IHRoZSBhZHZlcnRpc2VtZW50IHdpbGwgbG9hZCBpbnRvLlxuKiBAcGFyYW0ge3N0cmluZ30gb2JqLnNsb3ROYW1lIC0gQSBzdHJpbmcgY29udGFpbmluZyB0aGUgc2xvdCBuYW1lIG9mIHRoZSBhZHZlcnRpc2VtZW50LCBmb3IgaW5zdGFuY2UgJzEyMzQvYWRuLmNvbS9ob21lcGFnZScuXG4qIEBwYXJhbSB7QXJyYXl9IG9iai5kaW1lbnNpb25zIC0gQW4gYXJyYXkgY29udGFpbmluZyBhbGwgb2YgdGhlIGFwcGxpY2FibGUgc2l6ZXMgdGhlIGFkdmVydGlzZW1lbnQgY2FuIHVzZS5cbiogQHBhcmFtIHtPYmplY3R9IG9iai53cmFwcGVyIC0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgYWxsIG9mIHRoZSB3cmFwcGVyIHNldHRpbmdzLlxuKiBAcGFyYW0ge0FycmF5fSBvYmouYmlkZGluZyAtIENvbnRhaW5zIGFsbCBvZiB0aGUgYXBwbGljYWJsZSBiaWQgZGF0YSwgc3VjaCBhcyB3aGljaCB2ZW5kb3JzIHRvIHVzZSBhbmQgdGhlaXIgcGxhY2VtZW50IGlkcy5cbiogQHBhcmFtIHtib29sZWFufSBvYmouY29ycmVsYXRvciAtIEFuIG9wdGlvbmFsIGJvb2xlYW4gdGhhdCBkZXNjcmliZXMgaWYgdGhlIGNvcnJlbGF0b3IgdmFsdWUgc2hvdWxkIHVwZGF0ZSBvciBub3QuXG4qIEBwYXJhbSB7ZnVuY3Rpb259IG9iai5wcmVyZW5kZXIgLSBBbiBvcHRpb25hbCBmdW5jdGlvbiB0aGF0IHdpbGwgcnVuIGJlZm9yZSB0aGUgYWR2ZXJ0aXNlbWVudCByZW5kZXJzLlxuKiovXG5leHBvcnQgZnVuY3Rpb24gZmV0Y2hCaWRzKHtcbiAgYWQsXG4gIGlkLFxuICBzbG90TmFtZSxcbiAgZGltZW5zaW9ucyxcbiAgd3JhcHBlcixcbiAgYmlkZGluZyxcbiAgY29ycmVsYXRvciA9IGZhbHNlLFxuICBwcmVyZW5kZXIsXG59KSB7XG4gIGNvbnN0IGFkSW5mbyA9IHtcbiAgICBhZFVuaXQ6IGFkLFxuICAgIGFkU2xvdDogc2xvdE5hbWUsXG4gICAgYWREaW1lbnNpb25zOiBkaW1lbnNpb25zLFxuICAgIGFkSWQ6IGlkXG4gIH07XG5cbiAgY29uc3QgcHJlYmlkQmlkcyA9IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgaWYgKHdyYXBwZXIucHJlYmlkICYmIHdyYXBwZXIucHJlYmlkLmVuYWJsZWQpIHtcbiAgICAgIGNvbnN0IHRpbWVvdXQgPSB3cmFwcGVyLnByZWJpZC50aW1lb3V0IHx8IDcwMDtcbiAgICAgIGlmIChiaWRkaW5nLnByZWJpZC5zbG90U3VmZml4KSB7XG4gICAgICAgIGFkSW5mby5hZFNsb3QgPSBgJHtzbG90TmFtZX0ke2JpZGRpbmcucHJlYmlkLnNsb3RTdWZmaXh9YDtcbiAgICAgIH1cblxuICAgICAgcXVldWVQcmViaWRDb21tYW5kLmJpbmQodGhpcywgZmV0Y2hQcmViaWRCaWRzKGFkLCBpZCwgdGltZW91dCwgYWRJbmZvLCBwcmVyZW5kZXIsICgpID0+IHtcbiAgICAgICAgcmVzb2x2ZSgnRmV0Y2hlZCBQcmViaWQgYWRzIScpO1xuICAgICAgfSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXNvbHZlKCdQcmViaWQgaXMgbm90IGVuYWJsZWQgb24gdGhlIHdyYXBwZXIuLi4nKTtcbiAgICB9XG4gIH0pO1xuXG4gIGNvbnN0IGFtYXpvbkJpZHMgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIGlmICh3cmFwcGVyLmFtYXpvbiAmJiB3cmFwcGVyLmFtYXpvbi5lbmFibGVkKSB7XG4gICAgICBjb25zdCB0YXJnZXRlZFNsb3ROYW1lID0gYmlkZGluZy5hbWF6b24uc2xvdFN1ZmZpeCA/IGAke3Nsb3ROYW1lfSR7YmlkZGluZy5hbWF6b24uc2xvdFN1ZmZpeH1gIDogc2xvdE5hbWU7XG5cbiAgICAgIGZldGNoQW1hem9uQmlkcyhpZCwgdGFyZ2V0ZWRTbG90TmFtZSwgZGltZW5zaW9ucywgKCkgPT4ge1xuICAgICAgICByZXNvbHZlKCdGZXRjaGVkIEFtYXpvbiBhZHMhJyk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzb2x2ZSgnQW1hem9uIGlzIG5vdCBlbmFibGVkIG9uIHRoZSB3cmFwcGVyLi4uJyk7XG4gICAgfVxuICB9KTtcblxuICBpZiAod2luZG93LmFyY0JpZGRpbmdSZWFkeSkge1xuICAgIFByb21pc2UuYWxsKFtwcmViaWRCaWRzLCBhbWF6b25CaWRzXSlcbiAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgcmVmcmVzaFNsb3Qoe1xuICAgICAgICAgIGFkLFxuICAgICAgICAgIGNvcnJlbGF0b3IsXG4gICAgICAgICAgcHJlcmVuZGVyLFxuICAgICAgICAgIGluZm86IGFkSW5mb1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgZmV0Y2hCaWRzKHtcbiAgICAgICAgYWQsXG4gICAgICAgIGlkLFxuICAgICAgICBzbG90TmFtZSxcbiAgICAgICAgZGltZW5zaW9ucyxcbiAgICAgICAgd3JhcHBlcixcbiAgICAgICAgYmlkZGluZyxcbiAgICAgICAgY29ycmVsYXRvcixcbiAgICAgICAgcHJlcmVuZGVyXG4gICAgICB9KTtcbiAgICB9LCAyMDApO1xuICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvc2VydmljZXMvaGVhZGVyYmlkZGluZy5qcyIsIi8qKlxuKiBAZGVzYyBBcHBlbmRzIGEgcmVtb3RlIHJlc291cmNlIHRvIHRoZSBwYWdlIHdpdGhpbiBhIEhUTUwgdGFnLlxuKiBAcGFyYW0ge3N0cmluZ30gdGFnbmFtZSAtIEEgc3RyaW5nIGNvbnRhaW5pbmcgdGhlIHR5cGUgb2YgSFRNTCB0YWcgdGhhdCBzaG91bGQgYmUgYXBwZW5kZWQuXG4qIEBwYXJhbSB7c3RyaW5nfSB1cmwgLSBBIHN0cmluZyBjb250YWluaW5nIHRoZSBwYXRoIG9mIHRoZSByZXNvdXJjZS5cbiogQHBhcmFtIHtib29sZWFufSBhc3luYyAtIEEgYm9vbGVhbiByZXByZXNlbnRpbmcgaWYgdGhlIHJlc291cmNlIHNob3VsZCBiZSBsb2FkZWQgYXN5bmNocm9ub3VzbHkgb3Igbm90LlxuKiBAcGFyYW0ge2Jvb2xlYW59IGRlZmVyIC0gQSBib29sZWFuIHJlcHJlc2VudGluZyBpZiB0aGUgcmVzb3VyY2Ugc2hvdWxkIGJlIGRlZmVycmVkIG9yIG5vdC5cbiogQHBhcmFtIHtmdW5jdGlvbn0gY2IgLSBBbiBvcHRpb25hbCBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IHNob3VsZCBmaXJlIHdoZW5ldmVyIHRoZSByZXNvdXJjZSBoYXMgYmVlbiBhcHBlbmRlZC5cbioqL1xuZXhwb3J0IGZ1bmN0aW9uIGFwcGVuZFJlc291cmNlKHRhZ25hbWUsIHVybCwgYXN5bmMsIGRlZmVyLCBjYikge1xuICBjb25zdCB0YWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZ25hbWUpO1xuICBpZiAodGFnbmFtZSA9PT0gJ3NjcmlwdCcpIHtcbiAgICB0YWcuc3JjID0gdXJsO1xuICAgIHRhZy5hc3luYyA9IGFzeW5jIHx8IGZhbHNlO1xuICAgIHRhZy5kZWZlciA9IGFzeW5jIHx8IGRlZmVyIHx8IGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybjtcbiAgfVxuICAoZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpLmFwcGVuZENoaWxkKHRhZyk7XG5cbiAgaWYgKGNiKSB7XG4gICAgY2IoKTtcbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3V0aWwvcmVzb3VyY2VzLmpzIiwiaW1wb3J0IHsgcmVmcmVzaFNsb3QgfSBmcm9tICcuL2dwdCc7XG5cbi8qKlxuKiBAZGVzYyBRdWV1ZXMgYSBjb21tYW5kIGluc2lkZSBvZiBQcmViaWQuanNcbiogQHBhcmFtIHtmdW5jdGlvbn0gZm4gLSBBY2NlcHRzIGEgZnVuY3Rpb24gdG8gcHVzaCBpbnRvIHRoZSBQcmViaWQgY29tbWFuZCBxdWV1ZS5cbioqL1xuZXhwb3J0IGZ1bmN0aW9uIHF1ZXVlUHJlYmlkQ29tbWFuZChmbikge1xuICBwYmpzLnF1ZS5wdXNoKGZuKTtcbn1cblxuLyoqXG4qIEBkZXNjIENhbGxzIHRoZSBQcmViaWQgcmVxdWVzdCBtZXRob2QgZm9yIGZldGNoaW5nIGJpZHMsIG9uY2UgZmV0Y2hlZCB0aGUgYWR2ZXJ0aXNlbWVudCBpcyByZWZyZXNoZWQgdW5sZXNzIGEgY2FsbGJhY2sgaXMgZGVmaW5lZC5cbiogQHBhcmFtIHtvYmplY3R9IGFkIC0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIEdQVCBhZCBzbG90LlxuKiBAcGFyYW0ge3N0cmluZ30gaWQgLSBBIHN0cmluZyBjb250YWluaW5nIHRoZSBhZHZlcnRpc2VtZW50IGlkIGNvcnJlc3BvbmRpbmcgdG8gdGhlIGRpdiB0aGUgYWR2ZXJ0aXNlbWVudCB3aWxsIGxvYWQgaW50by5cbiogQHBhcmFtIHtudW1iZXJ9IHRpbWVvdXQgLSBBbiBpbnRlZ2VyIGNvbW11bmljYXRpbmcgaG93IGxvbmcgaW4gbXMgdGhlIFByZWJpZC5qcyBzZXJ2aWNlIHNob3VsZCB3YWl0IGJlZm9yZSBpdCBjbG9zZXMgdGhlIGF1Y3Rpb24gZm9yIGEgbG90LlxuKiBAcGFyYW0ge29iamVjdH0gaW5mbyAtIEFuIG9iamVjdCBjb250YWluaW5nIGluZm9ybWF0aW9uIGFib3V0IHRoZSBhZHZlcnRpc2VtZW50IHRoYXQgaXMgYWJvdXQgdG8gbG9hZC5cbiogQHBhcmFtIHtmdW5jdGlvbn0gcHJlcmVuZGVyIC0gQW4gb3B0aW9uYWwgZnVuY3Rpb24gdGhhdCB3aWxsIHJ1biBiZWZvcmUgdGhlIGFkdmVydGlzZW1lbnQgcmVuZGVycy5cbiogQHBhcmFtIHtmdW5jdGlvbn0gY2IgLSBBbiBvcHRpb25hbCBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IHNob3VsZCBmaXJlIHdoZW5ldmVyIHRoZSBiaWRkaW5nIGhhcyBjb25jbHVkZWQuXG4qKi9cbmV4cG9ydCBmdW5jdGlvbiBmZXRjaFByZWJpZEJpZHMoYWQsIGlkLCB0aW1lb3V0LCBpbmZvLCBwcmVyZW5kZXIsIGNiID0gbnVsbCkge1xuICBwYmpzLnJlcXVlc3RCaWRzKHtcbiAgICB0aW1lb3V0LFxuICAgIGFkVW5pdENvZGVzOiBbaWRdLFxuICAgIGJpZHNCYWNrSGFuZGxlcjogKCkgPT4ge1xuICAgICAgcGJqcy5zZXRUYXJnZXRpbmdGb3JHUFRBc3luYyhbaWRdKTtcbiAgICAgIGlmIChjYikge1xuICAgICAgICBjYigpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVmcmVzaFNsb3QoeyBhZCwgaW5mbywgcHJlcmVuZGVyIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59XG5cbi8qKlxuKiBAZGVzYyBSZWdpc3RlcnMgYW4gYWR2ZXJ0aXNlbWVudCB3aXRoIFByZWJpZC5qcyBzbyBpdCdzIHByZXBhcmVkIHRvIGZldGNoIGJpZHMgZm9yIGl0LlxuKiBAcGFyYW0ge3N0cmluZ30gY29kZSAtIENvbnRhaW5zIHRoZSBkaXYgaWQgdXNlZCBmb3IgdGhlIGFkdmVydGlzZW1lbnRcbiogQHBhcmFtIHthcnJheX0gc2l6ZXMgLSBBbiBhcnJheSBvZiBhcHBsaWNhYmxlIGFkIHNpemVzIHRoYXQgYXJlIGF2YWlsYWJsZSBmb3IgYmlkZGluZy5cbiogQHBhcmFtIHtvYmplY3R9IGJpZHMgLSBDb250YWlucyBhbGwgb2YgdGhlIGFwcGxpY2FibGUgYmlkIGRhdGEsIHN1Y2ggYXMgd2hpY2ggdmVuZG9ycyB0byB1c2UgYW5kIHRoZWlyIHBsYWNlbWVudCBpZHMuXG4qIEBwYXJhbSB7b2JqZWN0fSB3cmFwcGVyIC0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgYWxsIGVuYWJsZWQgc2VydmljZXMgb24gdGhlIEFyYyBBZHMuXG4qKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGRVbml0KGNvZGUsIHNpemVzLCBiaWRzLCB3cmFwcGVyID0ge30pIHtcbiAgLy8gRm9ybWF0cyB0aGUgYWRkIHVuaXQgZm9yIHByZWJpZC4uXG4gIGNvbnN0IHNsb3QgPSB7IGNvZGUsIHNpemVzLCBiaWRzIH07XG4gIGNvbnN0IHsgc2l6ZUNvbmZpZyB9ID0gd3JhcHBlcjtcblxuICBwYmpzLmFkZEFkVW5pdHMoc2xvdCk7XG5cbiAgaWYgKHNpemVDb25maWcpIHtcbiAgICBwYmpzLnNldENvbmZpZyh7IHNpemVDb25maWc6IFtzaXplQ29uZmlnXSB9KTtcbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3NlcnZpY2VzL3ByZWJpZC5qcyIsImltcG9ydCAnLi91dGlsL3BvbHlmaWxscyc7XG5pbXBvcnQgeyBNb2JpbGVEZXRlY3Rpb24gfSBmcm9tICcuL3V0aWwvbW9iaWxlJztcbmltcG9ydCB7IHJlbmFtZVBvc2l0aW9uS2V5IH0gZnJvbSAnLi91dGlsL2N1c3RvbVRhcmdldGluZyc7XG5pbXBvcnQgeyBmZXRjaEJpZHMsIGluaXRpYWxpemVCaWRkaW5nU2VydmljZXMgfSBmcm9tICcuL3NlcnZpY2VzL2hlYWRlcmJpZGRpbmcnO1xuaW1wb3J0IHsgaW5pdGlhbGl6ZUdQVCwgcXVldWVHb29nbGV0YWdDb21tYW5kLCByZWZyZXNoU2xvdCwgZGZwU2V0dGluZ3MsIHNldFRhcmdldGluZywgZGV0ZXJtaW5lU2xvdE5hbWUgfSBmcm9tICcuL3NlcnZpY2VzL2dwdCc7XG5pbXBvcnQgeyBxdWV1ZVByZWJpZENvbW1hbmQsIGFkZFVuaXQgfSBmcm9tICcuL3NlcnZpY2VzL3ByZWJpZCc7XG5pbXBvcnQgeyBwcmVwYXJlU2l6ZU1hcHMsIHNldFJlc2l6ZUxpc3RlbmVyIH0gZnJvbSAnLi9zZXJ2aWNlcy9zaXplbWFwcGluZyc7XG5cbi8qKiBAZGVzYyBEaXNwbGF5cyBhbiBhZHZlcnRpc2VtZW50IGZyb20gR29vZ2xlIERGUCB3aXRoIG9wdGlvbmFsIHN1cHBvcnQgZm9yIFByZWJpZC5qcyBhbmQgQW1hem9uIFRBTS9BOS4gKiovXG5leHBvcnQgY2xhc3MgQXJjQWRzIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucywgaGFuZGxlU2xvdFJlbmRlcmVkID0gbnVsbCkge1xuICAgIHRoaXMuZGZwSWQgPSBvcHRpb25zLmRmcC5pZCB8fCAnJztcbiAgICB0aGlzLndyYXBwZXIgPSBvcHRpb25zLmJpZGRpbmcgfHwge307XG4gICAgdGhpcy5wb3NpdGlvbnMgPSBbXTtcblxuICAgIHdpbmRvdy5pc01vYmlsZSA9IE1vYmlsZURldGVjdGlvbjtcblxuICAgIGlmICh0aGlzLmRmcElkID09PSAnJykge1xuICAgICAgY29uc29sZS53YXJuKGBBcmNBZHM6IERGUCBpZCBpcyBtaXNzaW5nIGZyb20gdGhlIGFyY2FkcyBpbml0aWFsaXphdGlvbiBzY3JpcHQuXG4gICAgICAgIERvY3VtZW50YXRpb246IGh0dHBzOi8vZ2l0aHViLmNvbS93YXBvcGFydG5lcnMvYXJjLWFkcyNnZXR0aW5nLXN0YXJ0ZWRgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaW5pdGlhbGl6ZUdQVCgpO1xuICAgICAgcXVldWVHb29nbGV0YWdDb21tYW5kKGRmcFNldHRpbmdzLmJpbmQodGhpcywgaGFuZGxlU2xvdFJlbmRlcmVkKSk7XG4gICAgICBpbml0aWFsaXplQmlkZGluZ1NlcnZpY2VzKHRoaXMud3JhcHBlcik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICogQGRlc2MgUmVnaXN0ZXJzIGFuIGFkdmVydGlzZW1lbnQgaW4gdGhlIHNlcnZpY2UuXG4gICogQHBhcmFtIHtvYmplY3R9IHBhcmFtcyAtIEFuIG9iamVjdCBjb250YWluaW5nIGFsbCBvZiB0aGUgYWR2ZXJ0aXNlbWVudCBjb25maWd1cmF0aW9uIHNldHRpbmdzIHN1Y2ggYXMgc2xvdCBuYW1lLCBpZCwgYW5kIHBvc2l0aW9uLlxuICAqKi9cbiAgcmVnaXN0ZXJBZChwYXJhbXMpIHtcbiAgICBjb25zdCB7IGlkLCBkaW1lbnNpb25zLCBhZFR5cGUgPSBmYWxzZSwgdGFyZ2V0aW5nID0ge30sIGRpc3BsYXkgPSAnYWxsJywgYmlkZGluZyA9IGZhbHNlIH0gPSBwYXJhbXM7XG5cbiAgICAvKiBJZiBwb3NpdGlvbmFsIHRhcmdldGluZyBkb2Vzbid0IGV4aXN0IGl0IGdldHMgYXNzaWduZWQgYSBudW1lcmljIHZhbHVlXG4gICAgICBiYXNlZCBvbiB0aGUgb3JkZXIgYW5kIHR5cGUgb2YgdGhlIGFkdmVydGlzZW1lbnQuIFRoaXMgbG9naWMgaXMgc2tpcHBlZCBpZiBhZFR5cGUgaXMgbm90IGRlZmluZWQuICovXG5cbiAgICBpZiAoKCF0YXJnZXRpbmcuaGFzT3duUHJvcGVydHkoJ3Bvc2l0aW9uJykgfHwgdHlwZW9mIHRhcmdldGluZy5wb3NpdGlvbiA9PT0gJ29iamVjdCcpICYmIGFkVHlwZSAhPT0gZmFsc2UpIHtcbiAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5wb3NpdGlvbnNbYWRUeXBlXSArIDEgfHwgMTtcbiAgICAgIHRoaXMucG9zaXRpb25zW2FkVHlwZV0gPSBwb3NpdGlvbjtcblxuICAgICAgaWYgKHR5cGVvZiB0YXJnZXRpbmcucG9zaXRpb24gPT09ICdvYmplY3QnICYmIHRhcmdldGluZy5wb3NpdGlvbi5hcykge1xuICAgICAgICBPYmplY3QuYXNzaWduKHBvc2l0aW9uLCByZW5hbWVQb3NpdGlvbktleSh0YXJnZXRpbmcsIHBvc2l0aW9uKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBwb3NpdGlvblBhcmFtID0gT2JqZWN0LmFzc2lnbih0YXJnZXRpbmcsIHsgcG9zaXRpb24gfSk7XG4gICAgICAgIE9iamVjdC5hc3NpZ24ocGFyYW1zLCB7IHRhcmdldGluZzogcG9zaXRpb25QYXJhbSB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoKGlzTW9iaWxlLmFueSgpICYmIGRpc3BsYXkgPT09ICdtb2JpbGUnKSB8fCAoIWlzTW9iaWxlLmFueSgpICYmIGRpc3BsYXkgPT09ICdkZXNrdG9wJykgfHwgKGRpc3BsYXkgPT09ICdhbGwnKSkge1xuICAgICAgLy8gUmVnaXN0ZXJzIHRoZSBhZHZlcnRpc2VtZW50IHdpdGggUHJlYmlkLmpzIGlmIGVuYWJsZWQgb24gYm90aCB0aGUgdW5pdCBhbmQgd3JhcHBlci5cbiAgICAgIGlmICgoYmlkZGluZy5wcmViaWQgJiYgYmlkZGluZy5wcmViaWQuYmlkcykgJiYgKHRoaXMud3JhcHBlci5wcmViaWQgJiYgdGhpcy53cmFwcGVyLnByZWJpZC5lbmFibGVkKSAmJiBkaW1lbnNpb25zKSB7XG4gICAgICAgIHF1ZXVlUHJlYmlkQ29tbWFuZC5iaW5kKHRoaXMsIGFkZFVuaXQoaWQsIGRpbWVuc2lvbnMsIGJpZGRpbmcucHJlYmlkLmJpZHMsIHRoaXMud3JhcHBlci5wcmViaWQpKTtcbiAgICAgIH1cblxuICAgICAgcXVldWVHb29nbGV0YWdDb21tYW5kKHRoaXMuZGlzcGxheUFkLmJpbmQodGhpcywgcGFyYW1zKSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICogQGRlc2MgUmVnaXN0ZXJzIGEgY29sbGVjdGlvbiBvZiBhZHZlcnRpc2VtZW50cy5cbiAgKiBAcGFyYW0ge2FycmF5fSBjb2xsZWN0aW9uIC0gQW4gYXJyYXkgY29udGFpbmluZyBhIGxpc3Qgb2Ygb2JqZWN0cyBjb250YWluaW5nIGFkdmVydGlzZW1lbnQgZGF0YS5cbiAgKiovXG4gIHJlZ2lzdGVyQWRDb2xsZWN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICBjb2xsZWN0aW9uLmZvckVhY2goKGFkdmVydCkgPT4ge1xuICAgICAgdGhpcy5yZWdpc3RlckFkKGFkdmVydCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgKiBAZGVzYyBEaXNwbGF5cyBhbiBhZHZlcnRpc2VtZW50IGFuZCBzZXRzIHVwIGFueSBuZWNjZXJzYXJ5IGV2ZW50IGJpbmRpbmcuXG4gICogQHBhcmFtIHtvYmplY3R9IHBhcmFtcyAtIEFuIG9iamVjdCBjb250YWluaW5nIGFsbCBvZiB0aGUgZnVuY3Rpb24gYXJndW1lbnRzLlxuICAqIEBwYXJhbSB7c3RyaW5nfSBwYXJhbXMuaWQgLSBBIHN0cmluZyBjb250YWluaW5nIHRoZSBhZHZlcnRpc2VtZW50IGlkIGNvcnJlc3BvbmRpbmcgdG8gdGhlIGRpdiB0aGUgYWR2ZXJ0aXNlbWVudCB3aWxsIGxvYWQgaW50by5cbiAgKiBAcGFyYW0ge3N0cmluZ30gcGFyYW1zLnNsb3ROYW1lIC0gQSBzdHJpbmcgY29udGFpbmluZyB0aGUgc2xvdCBuYW1lIG9mIHRoZSBhZHZlcnRpc2VtZW50LCBmb3IgaW5zdGFuY2UgJzEyMzQvbmV3cy9ob21lcGFnZScuXG4gICogQHBhcmFtIHthcnJheX0gcGFyYW1zLmRpbWVuc2lvbnMgLSBBbiBhcnJheSBjb250YWluaW5nIGFsbCBvZiB0aGUgYXBwbGljYWJsZSBzaXplcyB0aGUgYWR2ZXJ0aXNlbWVudCBjYW4gdXNlLlxuICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJhbXMudGFyZ2V0aW5nIC0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgYWxsIG9mIHRoZSBhZHZlcnRpc2VtZW50cyB0YXJnZXRpbmcgZGF0YS5cbiAgKiBAcGFyYW0ge2FycmF5fSBwYXJhbXMuc2l6ZW1hcCAtIEFuIGFycmF5IGNvbnRhaW5pbmcgb3B0aW9uYWwgc2l6ZSBtYXBwaW5nIGluZm9ybWF0aW9uLlxuICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJhbXMuYmlkZGluZyAtIENvbnRhaW5zIGFsbCBvZiB0aGUgYXBwbGljYWJsZSBiaWQgZGF0YSwgc3VjaCBhcyB3aGljaCB2ZW5kb3JzIHRvIHVzZSBhbmQgdGhlaXIgcGxhY2VtZW50IGlkcy5cbiAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBwYXJhbXMucHJlcmVuZGVyIC0gQW4gb3B0aW9uYWwgZnVuY3Rpb24gdGhhdCB3aWxsIHJ1biBiZWZvcmUgdGhlIGFkdmVydGlzZW1lbnQgcmVuZGVycy5cbiAgKiovXG4gIGRpc3BsYXlBZCh7XG4gICAgaWQsXG4gICAgc2xvdE5hbWUsXG4gICAgZGltZW5zaW9ucyxcbiAgICB0YXJnZXRpbmcsXG4gICAgc2l6ZW1hcCA9IGZhbHNlLFxuICAgIGJpZGRpbmcgPSBmYWxzZSxcbiAgICBwcmVyZW5kZXIgPSBudWxsXG4gIH0pIHtcbiAgICBjb25zdCBmdWxsU2xvdE5hbWUgPSBkZXRlcm1pbmVTbG90TmFtZSh0aGlzLmRmcElkLCBzbG90TmFtZSk7XG4gICAgY29uc3QgcGFyc2VkRGltZW5zaW9ucyA9ICFkaW1lbnNpb25zLmxlbmd0aCA/IG51bGwgOiBKU09OLnBhcnNlKGRpbWVuc2lvbnMpO1xuICAgIGNvbnN0IGFkID0gIWRpbWVuc2lvbnMgPyB3aW5kb3cuZ29vZ2xldGFnLmRlZmluZU91dE9mUGFnZVNsb3QoZnVsbFNsb3ROYW1lLCBpZClcbiAgICAgIDogd2luZG93Lmdvb2dsZXRhZy5kZWZpbmVTbG90KGZ1bGxTbG90TmFtZSwgcGFyc2VkRGltZW5zaW9ucywgaWQpO1xuXG4gICAgaWYgKHNpemVtYXAgJiYgc2l6ZW1hcC5icmVha3BvaW50cyAmJiBkaW1lbnNpb25zKSB7XG4gICAgICBjb25zdCB7IG1hcHBpbmcsIGJyZWFrcG9pbnRzLCBjb3JyZWxhdG9ycyB9ID0gcHJlcGFyZVNpemVNYXBzKHBhcnNlZERpbWVuc2lvbnMsIHNpemVtYXAuYnJlYWtwb2ludHMpO1xuXG4gICAgICBhZC5kZWZpbmVTaXplTWFwcGluZyhtYXBwaW5nKTtcblxuICAgICAgaWYgKHNpemVtYXAucmVmcmVzaCkge1xuICAgICAgICBzZXRSZXNpemVMaXN0ZW5lcih7XG4gICAgICAgICAgYWQsXG4gICAgICAgICAgc2xvdE5hbWU6IGZ1bGxTbG90TmFtZSxcbiAgICAgICAgICBicmVha3BvaW50cyxcbiAgICAgICAgICBpZCxcbiAgICAgICAgICBtYXBwaW5nLFxuICAgICAgICAgIGNvcnJlbGF0b3JzLFxuICAgICAgICAgIGJpZGRpbmcsXG4gICAgICAgICAgd3JhcHBlcjogdGhpcy53cmFwcGVyLFxuICAgICAgICAgIHByZXJlbmRlclxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBhZC5hZGRTZXJ2aWNlKHdpbmRvdy5nb29nbGV0YWcucHViYWRzKCkpO1xuXG4gICAgc2V0VGFyZ2V0aW5nKGFkLCB0YXJnZXRpbmcpO1xuXG4gICAgaWYgKGJpZGRpbmcgJiYgZGltZW5zaW9ucykge1xuICAgICAgZmV0Y2hCaWRzKHtcbiAgICAgICAgYWQsXG4gICAgICAgIGlkLFxuICAgICAgICBzbG90TmFtZTogZnVsbFNsb3ROYW1lLFxuICAgICAgICBkaW1lbnNpb25zOiBwYXJzZWREaW1lbnNpb25zLFxuICAgICAgICB3cmFwcGVyOiB0aGlzLndyYXBwZXIsXG4gICAgICAgIHByZXJlbmRlcixcbiAgICAgICAgYmlkZGluZ1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlZnJlc2hTbG90KHtcbiAgICAgICAgYWQsXG4gICAgICAgIHByZXJlbmRlcixcbiAgICAgICAgaW5mbzoge1xuICAgICAgICAgIGFkVW5pdDogYWQsXG4gICAgICAgICAgYWRTbG90OiBmdWxsU2xvdE5hbWUsXG4gICAgICAgICAgYWREaW1lbnNpb25zOiBwYXJzZWREaW1lbnNpb25zLFxuICAgICAgICAgIGFkSWQ6IGlkXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2luZGV4LmpzIiwiaW1wb3J0IFByb21pc2UgZnJvbSAncHJvbWlzZS1wb2x5ZmlsbCc7XG5cbmlmICghd2luZG93LlByb21pc2UpIHtcbiAgd2luZG93LlByb21pc2UgPSBQcm9taXNlO1xufVxuXG4vKiBlc2xpbnQtZGlzYWJsZSAqL1xuXG4vLyBzb3VyY2U6IGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL09iamVjdC9hc3NpZ24jUG9seWZpbGxcbi8qIE9iamVjdC5hc3NpZ24oKSBmb3IgSUUxMSAob2J2aW91c2x5KSAqL1xuaWYgKHR5cGVvZiBPYmplY3QuYXNzaWduICE9ICdmdW5jdGlvbicpIHtcbiAgLy8gTXVzdCBiZSB3cml0YWJsZTogdHJ1ZSwgZW51bWVyYWJsZTogZmFsc2UsIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoT2JqZWN0LCBcImFzc2lnblwiLCB7XG4gICAgdmFsdWU6IGZ1bmN0aW9uIGFzc2lnbih0YXJnZXQsIHZhckFyZ3MpIHsgLy8gLmxlbmd0aCBvZiBmdW5jdGlvbiBpcyAyXG4gICAgICAndXNlIHN0cmljdCc7XG4gICAgICBpZiAodGFyZ2V0ID09IG51bGwpIHsgLy8gVHlwZUVycm9yIGlmIHVuZGVmaW5lZCBvciBudWxsXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjb252ZXJ0IHVuZGVmaW5lZCBvciBudWxsIHRvIG9iamVjdCcpO1xuICAgICAgfVxuXG4gICAgICB2YXIgdG8gPSBPYmplY3QodGFyZ2V0KTtcblxuICAgICAgZm9yICh2YXIgaW5kZXggPSAxOyBpbmRleCA8IGFyZ3VtZW50cy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgdmFyIG5leHRTb3VyY2UgPSBhcmd1bWVudHNbaW5kZXhdO1xuXG4gICAgICAgIGlmIChuZXh0U291cmNlICE9IG51bGwpIHsgLy8gU2tpcCBvdmVyIGlmIHVuZGVmaW5lZCBvciBudWxsXG4gICAgICAgICAgZm9yICh2YXIgbmV4dEtleSBpbiBuZXh0U291cmNlKSB7XG4gICAgICAgICAgICAvLyBBdm9pZCBidWdzIHdoZW4gaGFzT3duUHJvcGVydHkgaXMgc2hhZG93ZWRcbiAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobmV4dFNvdXJjZSwgbmV4dEtleSkpIHtcbiAgICAgICAgICAgICAgdG9bbmV4dEtleV0gPSBuZXh0U291cmNlW25leHRLZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRvO1xuICAgIH0sXG4gICAgd3JpdGFibGU6IHRydWUsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xufVxuXG4vKiBlc2xpbnQtZW5hYmxlICovXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvdXRpbC9wb2x5ZmlsbHMuanMiLCJpbXBvcnQgcHJvbWlzZUZpbmFsbHkgZnJvbSAnLi9maW5hbGx5JztcblxuLy8gU3RvcmUgc2V0VGltZW91dCByZWZlcmVuY2Ugc28gcHJvbWlzZS1wb2x5ZmlsbCB3aWxsIGJlIHVuYWZmZWN0ZWQgYnlcbi8vIG90aGVyIGNvZGUgbW9kaWZ5aW5nIHNldFRpbWVvdXQgKGxpa2Ugc2lub24udXNlRmFrZVRpbWVycygpKVxudmFyIHNldFRpbWVvdXRGdW5jID0gc2V0VGltZW91dDtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbi8vIFBvbHlmaWxsIGZvciBGdW5jdGlvbi5wcm90b3R5cGUuYmluZFxuZnVuY3Rpb24gYmluZChmbiwgdGhpc0FyZykge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgZm4uYXBwbHkodGhpc0FyZywgYXJndW1lbnRzKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gUHJvbWlzZShmbikge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgUHJvbWlzZSkpXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignUHJvbWlzZXMgbXVzdCBiZSBjb25zdHJ1Y3RlZCB2aWEgbmV3Jyk7XG4gIGlmICh0eXBlb2YgZm4gIT09ICdmdW5jdGlvbicpIHRocm93IG5ldyBUeXBlRXJyb3IoJ25vdCBhIGZ1bmN0aW9uJyk7XG4gIHRoaXMuX3N0YXRlID0gMDtcbiAgdGhpcy5faGFuZGxlZCA9IGZhbHNlO1xuICB0aGlzLl92YWx1ZSA9IHVuZGVmaW5lZDtcbiAgdGhpcy5fZGVmZXJyZWRzID0gW107XG5cbiAgZG9SZXNvbHZlKGZuLCB0aGlzKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlKHNlbGYsIGRlZmVycmVkKSB7XG4gIHdoaWxlIChzZWxmLl9zdGF0ZSA9PT0gMykge1xuICAgIHNlbGYgPSBzZWxmLl92YWx1ZTtcbiAgfVxuICBpZiAoc2VsZi5fc3RhdGUgPT09IDApIHtcbiAgICBzZWxmLl9kZWZlcnJlZHMucHVzaChkZWZlcnJlZCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIHNlbGYuX2hhbmRsZWQgPSB0cnVlO1xuICBQcm9taXNlLl9pbW1lZGlhdGVGbihmdW5jdGlvbigpIHtcbiAgICB2YXIgY2IgPSBzZWxmLl9zdGF0ZSA9PT0gMSA/IGRlZmVycmVkLm9uRnVsZmlsbGVkIDogZGVmZXJyZWQub25SZWplY3RlZDtcbiAgICBpZiAoY2IgPT09IG51bGwpIHtcbiAgICAgIChzZWxmLl9zdGF0ZSA9PT0gMSA/IHJlc29sdmUgOiByZWplY3QpKGRlZmVycmVkLnByb21pc2UsIHNlbGYuX3ZhbHVlKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHJldDtcbiAgICB0cnkge1xuICAgICAgcmV0ID0gY2Ioc2VsZi5fdmFsdWUpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJlamVjdChkZWZlcnJlZC5wcm9taXNlLCBlKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmVzb2x2ZShkZWZlcnJlZC5wcm9taXNlLCByZXQpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZShzZWxmLCBuZXdWYWx1ZSkge1xuICB0cnkge1xuICAgIC8vIFByb21pc2UgUmVzb2x1dGlvbiBQcm9jZWR1cmU6IGh0dHBzOi8vZ2l0aHViLmNvbS9wcm9taXNlcy1hcGx1cy9wcm9taXNlcy1zcGVjI3RoZS1wcm9taXNlLXJlc29sdXRpb24tcHJvY2VkdXJlXG4gICAgaWYgKG5ld1ZhbHVlID09PSBzZWxmKVxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQSBwcm9taXNlIGNhbm5vdCBiZSByZXNvbHZlZCB3aXRoIGl0c2VsZi4nKTtcbiAgICBpZiAoXG4gICAgICBuZXdWYWx1ZSAmJlxuICAgICAgKHR5cGVvZiBuZXdWYWx1ZSA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIG5ld1ZhbHVlID09PSAnZnVuY3Rpb24nKVxuICAgICkge1xuICAgICAgdmFyIHRoZW4gPSBuZXdWYWx1ZS50aGVuO1xuICAgICAgaWYgKG5ld1ZhbHVlIGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgICBzZWxmLl9zdGF0ZSA9IDM7XG4gICAgICAgIHNlbGYuX3ZhbHVlID0gbmV3VmFsdWU7XG4gICAgICAgIGZpbmFsZShzZWxmKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGhlbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBkb1Jlc29sdmUoYmluZCh0aGVuLCBuZXdWYWx1ZSksIHNlbGYpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICAgIHNlbGYuX3N0YXRlID0gMTtcbiAgICBzZWxmLl92YWx1ZSA9IG5ld1ZhbHVlO1xuICAgIGZpbmFsZShzZWxmKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJlamVjdChzZWxmLCBlKTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZWplY3Qoc2VsZiwgbmV3VmFsdWUpIHtcbiAgc2VsZi5fc3RhdGUgPSAyO1xuICBzZWxmLl92YWx1ZSA9IG5ld1ZhbHVlO1xuICBmaW5hbGUoc2VsZik7XG59XG5cbmZ1bmN0aW9uIGZpbmFsZShzZWxmKSB7XG4gIGlmIChzZWxmLl9zdGF0ZSA9PT0gMiAmJiBzZWxmLl9kZWZlcnJlZHMubGVuZ3RoID09PSAwKSB7XG4gICAgUHJvbWlzZS5faW1tZWRpYXRlRm4oZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoIXNlbGYuX2hhbmRsZWQpIHtcbiAgICAgICAgUHJvbWlzZS5fdW5oYW5kbGVkUmVqZWN0aW9uRm4oc2VsZi5fdmFsdWUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHNlbGYuX2RlZmVycmVkcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIGhhbmRsZShzZWxmLCBzZWxmLl9kZWZlcnJlZHNbaV0pO1xuICB9XG4gIHNlbGYuX2RlZmVycmVkcyA9IG51bGw7XG59XG5cbmZ1bmN0aW9uIEhhbmRsZXIob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQsIHByb21pc2UpIHtcbiAgdGhpcy5vbkZ1bGZpbGxlZCA9IHR5cGVvZiBvbkZ1bGZpbGxlZCA9PT0gJ2Z1bmN0aW9uJyA/IG9uRnVsZmlsbGVkIDogbnVsbDtcbiAgdGhpcy5vblJlamVjdGVkID0gdHlwZW9mIG9uUmVqZWN0ZWQgPT09ICdmdW5jdGlvbicgPyBvblJlamVjdGVkIDogbnVsbDtcbiAgdGhpcy5wcm9taXNlID0gcHJvbWlzZTtcbn1cblxuLyoqXG4gKiBUYWtlIGEgcG90ZW50aWFsbHkgbWlzYmVoYXZpbmcgcmVzb2x2ZXIgZnVuY3Rpb24gYW5kIG1ha2Ugc3VyZVxuICogb25GdWxmaWxsZWQgYW5kIG9uUmVqZWN0ZWQgYXJlIG9ubHkgY2FsbGVkIG9uY2UuXG4gKlxuICogTWFrZXMgbm8gZ3VhcmFudGVlcyBhYm91dCBhc3luY2hyb255LlxuICovXG5mdW5jdGlvbiBkb1Jlc29sdmUoZm4sIHNlbGYpIHtcbiAgdmFyIGRvbmUgPSBmYWxzZTtcbiAgdHJ5IHtcbiAgICBmbihcbiAgICAgIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIGlmIChkb25lKSByZXR1cm47XG4gICAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgICByZXNvbHZlKHNlbGYsIHZhbHVlKTtcbiAgICAgIH0sXG4gICAgICBmdW5jdGlvbihyZWFzb24pIHtcbiAgICAgICAgaWYgKGRvbmUpIHJldHVybjtcbiAgICAgICAgZG9uZSA9IHRydWU7XG4gICAgICAgIHJlamVjdChzZWxmLCByZWFzb24pO1xuICAgICAgfVxuICAgICk7XG4gIH0gY2F0Y2ggKGV4KSB7XG4gICAgaWYgKGRvbmUpIHJldHVybjtcbiAgICBkb25lID0gdHJ1ZTtcbiAgICByZWplY3Qoc2VsZiwgZXgpO1xuICB9XG59XG5cblByb21pc2UucHJvdG90eXBlWydjYXRjaCddID0gZnVuY3Rpb24ob25SZWplY3RlZCkge1xuICByZXR1cm4gdGhpcy50aGVuKG51bGwsIG9uUmVqZWN0ZWQpO1xufTtcblxuUHJvbWlzZS5wcm90b3R5cGUudGhlbiA9IGZ1bmN0aW9uKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKSB7XG4gIHZhciBwcm9tID0gbmV3IHRoaXMuY29uc3RydWN0b3Iobm9vcCk7XG5cbiAgaGFuZGxlKHRoaXMsIG5ldyBIYW5kbGVyKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkLCBwcm9tKSk7XG4gIHJldHVybiBwcm9tO1xufTtcblxuUHJvbWlzZS5wcm90b3R5cGVbJ2ZpbmFsbHknXSA9IHByb21pc2VGaW5hbGx5O1xuXG5Qcm9taXNlLmFsbCA9IGZ1bmN0aW9uKGFycikge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgaWYgKCFhcnIgfHwgdHlwZW9mIGFyci5sZW5ndGggPT09ICd1bmRlZmluZWQnKVxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignUHJvbWlzZS5hbGwgYWNjZXB0cyBhbiBhcnJheScpO1xuICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJyKTtcbiAgICBpZiAoYXJncy5sZW5ndGggPT09IDApIHJldHVybiByZXNvbHZlKFtdKTtcbiAgICB2YXIgcmVtYWluaW5nID0gYXJncy5sZW5ndGg7XG5cbiAgICBmdW5jdGlvbiByZXMoaSwgdmFsKSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAodmFsICYmICh0eXBlb2YgdmFsID09PSAnb2JqZWN0JyB8fCB0eXBlb2YgdmFsID09PSAnZnVuY3Rpb24nKSkge1xuICAgICAgICAgIHZhciB0aGVuID0gdmFsLnRoZW47XG4gICAgICAgICAgaWYgKHR5cGVvZiB0aGVuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aGVuLmNhbGwoXG4gICAgICAgICAgICAgIHZhbCxcbiAgICAgICAgICAgICAgZnVuY3Rpb24odmFsKSB7XG4gICAgICAgICAgICAgICAgcmVzKGksIHZhbCk7XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHJlamVjdFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYXJnc1tpXSA9IHZhbDtcbiAgICAgICAgaWYgKC0tcmVtYWluaW5nID09PSAwKSB7XG4gICAgICAgICAgcmVzb2x2ZShhcmdzKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgcmVqZWN0KGV4KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIHJlcyhpLCBhcmdzW2ldKTtcbiAgICB9XG4gIH0pO1xufTtcblxuUHJvbWlzZS5yZXNvbHZlID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgaWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUuY29uc3RydWN0b3IgPT09IFByb21pc2UpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgIHJlc29sdmUodmFsdWUpO1xuICB9KTtcbn07XG5cblByb21pc2UucmVqZWN0ID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgIHJlamVjdCh2YWx1ZSk7XG4gIH0pO1xufTtcblxuUHJvbWlzZS5yYWNlID0gZnVuY3Rpb24odmFsdWVzKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gdmFsdWVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICB2YWx1ZXNbaV0udGhlbihyZXNvbHZlLCByZWplY3QpO1xuICAgIH1cbiAgfSk7XG59O1xuXG4vLyBVc2UgcG9seWZpbGwgZm9yIHNldEltbWVkaWF0ZSBmb3IgcGVyZm9ybWFuY2UgZ2FpbnNcblByb21pc2UuX2ltbWVkaWF0ZUZuID1cbiAgKHR5cGVvZiBzZXRJbW1lZGlhdGUgPT09ICdmdW5jdGlvbicgJiZcbiAgICBmdW5jdGlvbihmbikge1xuICAgICAgc2V0SW1tZWRpYXRlKGZuKTtcbiAgICB9KSB8fFxuICBmdW5jdGlvbihmbikge1xuICAgIHNldFRpbWVvdXRGdW5jKGZuLCAwKTtcbiAgfTtcblxuUHJvbWlzZS5fdW5oYW5kbGVkUmVqZWN0aW9uRm4gPSBmdW5jdGlvbiBfdW5oYW5kbGVkUmVqZWN0aW9uRm4oZXJyKSB7XG4gIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiYgY29uc29sZSkge1xuICAgIGNvbnNvbGUud2FybignUG9zc2libGUgVW5oYW5kbGVkIFByb21pc2UgUmVqZWN0aW9uOicsIGVycik7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBQcm9taXNlO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvcHJvbWlzZS1wb2x5ZmlsbC9zcmMvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIHNjb3BlID0gKHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgJiYgZ2xvYmFsKSB8fFxuICAgICAgICAgICAgKHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiICYmIHNlbGYpIHx8XG4gICAgICAgICAgICB3aW5kb3c7XG52YXIgYXBwbHkgPSBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHk7XG5cbi8vIERPTSBBUElzLCBmb3IgY29tcGxldGVuZXNzXG5cbmV4cG9ydHMuc2V0VGltZW91dCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IFRpbWVvdXQoYXBwbHkuY2FsbChzZXRUaW1lb3V0LCBzY29wZSwgYXJndW1lbnRzKSwgY2xlYXJUaW1lb3V0KTtcbn07XG5leHBvcnRzLnNldEludGVydmFsID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgVGltZW91dChhcHBseS5jYWxsKHNldEludGVydmFsLCBzY29wZSwgYXJndW1lbnRzKSwgY2xlYXJJbnRlcnZhbCk7XG59O1xuZXhwb3J0cy5jbGVhclRpbWVvdXQgPVxuZXhwb3J0cy5jbGVhckludGVydmFsID0gZnVuY3Rpb24odGltZW91dCkge1xuICBpZiAodGltZW91dCkge1xuICAgIHRpbWVvdXQuY2xvc2UoKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gVGltZW91dChpZCwgY2xlYXJGbikge1xuICB0aGlzLl9pZCA9IGlkO1xuICB0aGlzLl9jbGVhckZuID0gY2xlYXJGbjtcbn1cblRpbWVvdXQucHJvdG90eXBlLnVucmVmID0gVGltZW91dC5wcm90b3R5cGUucmVmID0gZnVuY3Rpb24oKSB7fTtcblRpbWVvdXQucHJvdG90eXBlLmNsb3NlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuX2NsZWFyRm4uY2FsbChzY29wZSwgdGhpcy5faWQpO1xufTtcblxuLy8gRG9lcyBub3Qgc3RhcnQgdGhlIHRpbWUsIGp1c3Qgc2V0cyB1cCB0aGUgbWVtYmVycyBuZWVkZWQuXG5leHBvcnRzLmVucm9sbCA9IGZ1bmN0aW9uKGl0ZW0sIG1zZWNzKSB7XG4gIGNsZWFyVGltZW91dChpdGVtLl9pZGxlVGltZW91dElkKTtcbiAgaXRlbS5faWRsZVRpbWVvdXQgPSBtc2Vjcztcbn07XG5cbmV4cG9ydHMudW5lbnJvbGwgPSBmdW5jdGlvbihpdGVtKSB7XG4gIGNsZWFyVGltZW91dChpdGVtLl9pZGxlVGltZW91dElkKTtcbiAgaXRlbS5faWRsZVRpbWVvdXQgPSAtMTtcbn07XG5cbmV4cG9ydHMuX3VucmVmQWN0aXZlID0gZXhwb3J0cy5hY3RpdmUgPSBmdW5jdGlvbihpdGVtKSB7XG4gIGNsZWFyVGltZW91dChpdGVtLl9pZGxlVGltZW91dElkKTtcblxuICB2YXIgbXNlY3MgPSBpdGVtLl9pZGxlVGltZW91dDtcbiAgaWYgKG1zZWNzID49IDApIHtcbiAgICBpdGVtLl9pZGxlVGltZW91dElkID0gc2V0VGltZW91dChmdW5jdGlvbiBvblRpbWVvdXQoKSB7XG4gICAgICBpZiAoaXRlbS5fb25UaW1lb3V0KVxuICAgICAgICBpdGVtLl9vblRpbWVvdXQoKTtcbiAgICB9LCBtc2Vjcyk7XG4gIH1cbn07XG5cbi8vIHNldGltbWVkaWF0ZSBhdHRhY2hlcyBpdHNlbGYgdG8gdGhlIGdsb2JhbCBvYmplY3RcbnJlcXVpcmUoXCJzZXRpbW1lZGlhdGVcIik7XG4vLyBPbiBzb21lIGV4b3RpYyBlbnZpcm9ubWVudHMsIGl0J3Mgbm90IGNsZWFyIHdoaWNoIG9iamVjdCBgc2V0aW1tZWRpYXRlYCB3YXNcbi8vIGFibGUgdG8gaW5zdGFsbCBvbnRvLiAgU2VhcmNoIGVhY2ggcG9zc2liaWxpdHkgaW4gdGhlIHNhbWUgb3JkZXIgYXMgdGhlXG4vLyBgc2V0aW1tZWRpYXRlYCBsaWJyYXJ5LlxuZXhwb3J0cy5zZXRJbW1lZGlhdGUgPSAodHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgJiYgc2VsZi5zZXRJbW1lZGlhdGUpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICh0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiICYmIGdsb2JhbC5zZXRJbW1lZGlhdGUpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICh0aGlzICYmIHRoaXMuc2V0SW1tZWRpYXRlKTtcbmV4cG9ydHMuY2xlYXJJbW1lZGlhdGUgPSAodHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgJiYgc2VsZi5jbGVhckltbWVkaWF0ZSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAodHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBnbG9iYWwuY2xlYXJJbW1lZGlhdGUpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgKHRoaXMgJiYgdGhpcy5jbGVhckltbWVkaWF0ZSk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy90aW1lcnMtYnJvd3NlcmlmeS9tYWluLmpzXG4vLyBtb2R1bGUgaWQgPSA4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIihmdW5jdGlvbiAoZ2xvYmFsLCB1bmRlZmluZWQpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGlmIChnbG9iYWwuc2V0SW1tZWRpYXRlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgbmV4dEhhbmRsZSA9IDE7IC8vIFNwZWMgc2F5cyBncmVhdGVyIHRoYW4gemVyb1xuICAgIHZhciB0YXNrc0J5SGFuZGxlID0ge307XG4gICAgdmFyIGN1cnJlbnRseVJ1bm5pbmdBVGFzayA9IGZhbHNlO1xuICAgIHZhciBkb2MgPSBnbG9iYWwuZG9jdW1lbnQ7XG4gICAgdmFyIHJlZ2lzdGVySW1tZWRpYXRlO1xuXG4gICAgZnVuY3Rpb24gc2V0SW1tZWRpYXRlKGNhbGxiYWNrKSB7XG4gICAgICAvLyBDYWxsYmFjayBjYW4gZWl0aGVyIGJlIGEgZnVuY3Rpb24gb3IgYSBzdHJpbmdcbiAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBjYWxsYmFjayA9IG5ldyBGdW5jdGlvbihcIlwiICsgY2FsbGJhY2spO1xuICAgICAgfVxuICAgICAgLy8gQ29weSBmdW5jdGlvbiBhcmd1bWVudHNcbiAgICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGFyZ3NbaV0gPSBhcmd1bWVudHNbaSArIDFdO1xuICAgICAgfVxuICAgICAgLy8gU3RvcmUgYW5kIHJlZ2lzdGVyIHRoZSB0YXNrXG4gICAgICB2YXIgdGFzayA9IHsgY2FsbGJhY2s6IGNhbGxiYWNrLCBhcmdzOiBhcmdzIH07XG4gICAgICB0YXNrc0J5SGFuZGxlW25leHRIYW5kbGVdID0gdGFzaztcbiAgICAgIHJlZ2lzdGVySW1tZWRpYXRlKG5leHRIYW5kbGUpO1xuICAgICAgcmV0dXJuIG5leHRIYW5kbGUrKztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbGVhckltbWVkaWF0ZShoYW5kbGUpIHtcbiAgICAgICAgZGVsZXRlIHRhc2tzQnlIYW5kbGVbaGFuZGxlXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBydW4odGFzaykge1xuICAgICAgICB2YXIgY2FsbGJhY2sgPSB0YXNrLmNhbGxiYWNrO1xuICAgICAgICB2YXIgYXJncyA9IHRhc2suYXJncztcbiAgICAgICAgc3dpdGNoIChhcmdzLmxlbmd0aCkge1xuICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgIGNhbGxiYWNrKGFyZ3NbMF0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgIGNhbGxiYWNrKGFyZ3NbMF0sIGFyZ3NbMV0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgIGNhbGxiYWNrKGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBjYWxsYmFjay5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBydW5JZlByZXNlbnQoaGFuZGxlKSB7XG4gICAgICAgIC8vIEZyb20gdGhlIHNwZWM6IFwiV2FpdCB1bnRpbCBhbnkgaW52b2NhdGlvbnMgb2YgdGhpcyBhbGdvcml0aG0gc3RhcnRlZCBiZWZvcmUgdGhpcyBvbmUgaGF2ZSBjb21wbGV0ZWQuXCJcbiAgICAgICAgLy8gU28gaWYgd2UncmUgY3VycmVudGx5IHJ1bm5pbmcgYSB0YXNrLCB3ZSdsbCBuZWVkIHRvIGRlbGF5IHRoaXMgaW52b2NhdGlvbi5cbiAgICAgICAgaWYgKGN1cnJlbnRseVJ1bm5pbmdBVGFzaykge1xuICAgICAgICAgICAgLy8gRGVsYXkgYnkgZG9pbmcgYSBzZXRUaW1lb3V0LiBzZXRJbW1lZGlhdGUgd2FzIHRyaWVkIGluc3RlYWQsIGJ1dCBpbiBGaXJlZm94IDcgaXQgZ2VuZXJhdGVkIGFcbiAgICAgICAgICAgIC8vIFwidG9vIG11Y2ggcmVjdXJzaW9uXCIgZXJyb3IuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KHJ1bklmUHJlc2VudCwgMCwgaGFuZGxlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciB0YXNrID0gdGFza3NCeUhhbmRsZVtoYW5kbGVdO1xuICAgICAgICAgICAgaWYgKHRhc2spIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50bHlSdW5uaW5nQVRhc2sgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHJ1bih0YXNrKTtcbiAgICAgICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgICAgICBjbGVhckltbWVkaWF0ZShoYW5kbGUpO1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50bHlSdW5uaW5nQVRhc2sgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnN0YWxsTmV4dFRpY2tJbXBsZW1lbnRhdGlvbigpIHtcbiAgICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUgPSBmdW5jdGlvbihoYW5kbGUpIHtcbiAgICAgICAgICAgIHByb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24gKCkgeyBydW5JZlByZXNlbnQoaGFuZGxlKTsgfSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2FuVXNlUG9zdE1lc3NhZ2UoKSB7XG4gICAgICAgIC8vIFRoZSB0ZXN0IGFnYWluc3QgYGltcG9ydFNjcmlwdHNgIHByZXZlbnRzIHRoaXMgaW1wbGVtZW50YXRpb24gZnJvbSBiZWluZyBpbnN0YWxsZWQgaW5zaWRlIGEgd2ViIHdvcmtlcixcbiAgICAgICAgLy8gd2hlcmUgYGdsb2JhbC5wb3N0TWVzc2FnZWAgbWVhbnMgc29tZXRoaW5nIGNvbXBsZXRlbHkgZGlmZmVyZW50IGFuZCBjYW4ndCBiZSB1c2VkIGZvciB0aGlzIHB1cnBvc2UuXG4gICAgICAgIGlmIChnbG9iYWwucG9zdE1lc3NhZ2UgJiYgIWdsb2JhbC5pbXBvcnRTY3JpcHRzKSB7XG4gICAgICAgICAgICB2YXIgcG9zdE1lc3NhZ2VJc0FzeW5jaHJvbm91cyA9IHRydWU7XG4gICAgICAgICAgICB2YXIgb2xkT25NZXNzYWdlID0gZ2xvYmFsLm9ubWVzc2FnZTtcbiAgICAgICAgICAgIGdsb2JhbC5vbm1lc3NhZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBwb3N0TWVzc2FnZUlzQXN5bmNocm9ub3VzID0gZmFsc2U7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZ2xvYmFsLnBvc3RNZXNzYWdlKFwiXCIsIFwiKlwiKTtcbiAgICAgICAgICAgIGdsb2JhbC5vbm1lc3NhZ2UgPSBvbGRPbk1lc3NhZ2U7XG4gICAgICAgICAgICByZXR1cm4gcG9zdE1lc3NhZ2VJc0FzeW5jaHJvbm91cztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc3RhbGxQb3N0TWVzc2FnZUltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICAvLyBJbnN0YWxscyBhbiBldmVudCBoYW5kbGVyIG9uIGBnbG9iYWxgIGZvciB0aGUgYG1lc3NhZ2VgIGV2ZW50OiBzZWVcbiAgICAgICAgLy8gKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9ET00vd2luZG93LnBvc3RNZXNzYWdlXG4gICAgICAgIC8vICogaHR0cDovL3d3dy53aGF0d2cub3JnL3NwZWNzL3dlYi1hcHBzL2N1cnJlbnQtd29yay9tdWx0aXBhZ2UvY29tbXMuaHRtbCNjcm9zc0RvY3VtZW50TWVzc2FnZXNcblxuICAgICAgICB2YXIgbWVzc2FnZVByZWZpeCA9IFwic2V0SW1tZWRpYXRlJFwiICsgTWF0aC5yYW5kb20oKSArIFwiJFwiO1xuICAgICAgICB2YXIgb25HbG9iYWxNZXNzYWdlID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIGlmIChldmVudC5zb3VyY2UgPT09IGdsb2JhbCAmJlxuICAgICAgICAgICAgICAgIHR5cGVvZiBldmVudC5kYXRhID09PSBcInN0cmluZ1wiICYmXG4gICAgICAgICAgICAgICAgZXZlbnQuZGF0YS5pbmRleE9mKG1lc3NhZ2VQcmVmaXgpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcnVuSWZQcmVzZW50KCtldmVudC5kYXRhLnNsaWNlKG1lc3NhZ2VQcmVmaXgubGVuZ3RoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKGdsb2JhbC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgICAgICBnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgb25HbG9iYWxNZXNzYWdlLCBmYWxzZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBnbG9iYWwuYXR0YWNoRXZlbnQoXCJvbm1lc3NhZ2VcIiwgb25HbG9iYWxNZXNzYWdlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlZ2lzdGVySW1tZWRpYXRlID0gZnVuY3Rpb24oaGFuZGxlKSB7XG4gICAgICAgICAgICBnbG9iYWwucG9zdE1lc3NhZ2UobWVzc2FnZVByZWZpeCArIGhhbmRsZSwgXCIqXCIpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc3RhbGxNZXNzYWdlQ2hhbm5lbEltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICB2YXIgY2hhbm5lbCA9IG5ldyBNZXNzYWdlQ2hhbm5lbCgpO1xuICAgICAgICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgaGFuZGxlID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIHJ1bklmUHJlc2VudChoYW5kbGUpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJlZ2lzdGVySW1tZWRpYXRlID0gZnVuY3Rpb24oaGFuZGxlKSB7XG4gICAgICAgICAgICBjaGFubmVsLnBvcnQyLnBvc3RNZXNzYWdlKGhhbmRsZSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zdGFsbFJlYWR5U3RhdGVDaGFuZ2VJbXBsZW1lbnRhdGlvbigpIHtcbiAgICAgICAgdmFyIGh0bWwgPSBkb2MuZG9jdW1lbnRFbGVtZW50O1xuICAgICAgICByZWdpc3RlckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgICAgICAgICAgLy8gQ3JlYXRlIGEgPHNjcmlwdD4gZWxlbWVudDsgaXRzIHJlYWR5c3RhdGVjaGFuZ2UgZXZlbnQgd2lsbCBiZSBmaXJlZCBhc3luY2hyb25vdXNseSBvbmNlIGl0IGlzIGluc2VydGVkXG4gICAgICAgICAgICAvLyBpbnRvIHRoZSBkb2N1bWVudC4gRG8gc28sIHRodXMgcXVldWluZyB1cCB0aGUgdGFzay4gUmVtZW1iZXIgdG8gY2xlYW4gdXAgb25jZSBpdCdzIGJlZW4gY2FsbGVkLlxuICAgICAgICAgICAgdmFyIHNjcmlwdCA9IGRvYy5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xuICAgICAgICAgICAgc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBydW5JZlByZXNlbnQoaGFuZGxlKTtcbiAgICAgICAgICAgICAgICBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gbnVsbDtcbiAgICAgICAgICAgICAgICBodG1sLnJlbW92ZUNoaWxkKHNjcmlwdCk7XG4gICAgICAgICAgICAgICAgc2NyaXB0ID0gbnVsbDtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBodG1sLmFwcGVuZENoaWxkKHNjcmlwdCk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zdGFsbFNldFRpbWVvdXRJbXBsZW1lbnRhdGlvbigpIHtcbiAgICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUgPSBmdW5jdGlvbihoYW5kbGUpIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQocnVuSWZQcmVzZW50LCAwLCBoYW5kbGUpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vIElmIHN1cHBvcnRlZCwgd2Ugc2hvdWxkIGF0dGFjaCB0byB0aGUgcHJvdG90eXBlIG9mIGdsb2JhbCwgc2luY2UgdGhhdCBpcyB3aGVyZSBzZXRUaW1lb3V0IGV0IGFsLiBsaXZlLlxuICAgIHZhciBhdHRhY2hUbyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZiAmJiBPYmplY3QuZ2V0UHJvdG90eXBlT2YoZ2xvYmFsKTtcbiAgICBhdHRhY2hUbyA9IGF0dGFjaFRvICYmIGF0dGFjaFRvLnNldFRpbWVvdXQgPyBhdHRhY2hUbyA6IGdsb2JhbDtcblxuICAgIC8vIERvbid0IGdldCBmb29sZWQgYnkgZS5nLiBicm93c2VyaWZ5IGVudmlyb25tZW50cy5cbiAgICBpZiAoe30udG9TdHJpbmcuY2FsbChnbG9iYWwucHJvY2VzcykgPT09IFwiW29iamVjdCBwcm9jZXNzXVwiKSB7XG4gICAgICAgIC8vIEZvciBOb2RlLmpzIGJlZm9yZSAwLjlcbiAgICAgICAgaW5zdGFsbE5leHRUaWNrSW1wbGVtZW50YXRpb24oKTtcblxuICAgIH0gZWxzZSBpZiAoY2FuVXNlUG9zdE1lc3NhZ2UoKSkge1xuICAgICAgICAvLyBGb3Igbm9uLUlFMTAgbW9kZXJuIGJyb3dzZXJzXG4gICAgICAgIGluc3RhbGxQb3N0TWVzc2FnZUltcGxlbWVudGF0aW9uKCk7XG5cbiAgICB9IGVsc2UgaWYgKGdsb2JhbC5NZXNzYWdlQ2hhbm5lbCkge1xuICAgICAgICAvLyBGb3Igd2ViIHdvcmtlcnMsIHdoZXJlIHN1cHBvcnRlZFxuICAgICAgICBpbnN0YWxsTWVzc2FnZUNoYW5uZWxJbXBsZW1lbnRhdGlvbigpO1xuXG4gICAgfSBlbHNlIGlmIChkb2MgJiYgXCJvbnJlYWR5c3RhdGVjaGFuZ2VcIiBpbiBkb2MuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKSkge1xuICAgICAgICAvLyBGb3IgSUUgNuKAkzhcbiAgICAgICAgaW5zdGFsbFJlYWR5U3RhdGVDaGFuZ2VJbXBsZW1lbnRhdGlvbigpO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gRm9yIG9sZGVyIGJyb3dzZXJzXG4gICAgICAgIGluc3RhbGxTZXRUaW1lb3V0SW1wbGVtZW50YXRpb24oKTtcbiAgICB9XG5cbiAgICBhdHRhY2hUby5zZXRJbW1lZGlhdGUgPSBzZXRJbW1lZGlhdGU7XG4gICAgYXR0YWNoVG8uY2xlYXJJbW1lZGlhdGUgPSBjbGVhckltbWVkaWF0ZTtcbn0odHlwZW9mIHNlbGYgPT09IFwidW5kZWZpbmVkXCIgPyB0eXBlb2YgZ2xvYmFsID09PSBcInVuZGVmaW5lZFwiID8gdGhpcyA6IGdsb2JhbCA6IHNlbGYpKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3NldGltbWVkaWF0ZS9zZXRJbW1lZGlhdGUuanNcbi8vIG1vZHVsZSBpZCA9IDlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qc1xuLy8gbW9kdWxlIGlkID0gMTBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgdmFyIGNvbnN0cnVjdG9yID0gdGhpcy5jb25zdHJ1Y3RvcjtcbiAgcmV0dXJuIHRoaXMudGhlbihcbiAgICBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIGNvbnN0cnVjdG9yLnJlc29sdmUoY2FsbGJhY2soKSkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICBmdW5jdGlvbihyZWFzb24pIHtcbiAgICAgIHJldHVybiBjb25zdHJ1Y3Rvci5yZXNvbHZlKGNhbGxiYWNrKCkpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBjb25zdHJ1Y3Rvci5yZWplY3QocmVhc29uKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgKTtcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3Byb21pc2UtcG9seWZpbGwvc3JjL2ZpbmFsbHkuanNcbi8vIG1vZHVsZSBpZCA9IDExXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKiBAZGVzYyBVdGlsaXR5IGNsYXNzIHRoYXQgZGV0ZXJtaW5lcyB0aGUgZW5kIHVzZXIncyBicm93c2VyIHVzZXIgYWdlbnQuICoqL1xuZXhwb3J0IGNsYXNzIE1vYmlsZURldGVjdGlvbiB7XG4gIC8qKlxuICAqIEBkZXNjIERldGVybWluZXMgaWYgdGhlIHVzZXIgaXMgdXNpbmcgYW4gQW5kcm9pZCBkZXZpY2UuXG4gICoqL1xuICBzdGF0aWMgQW5kcm9pZCgpIHtcbiAgICByZXR1cm4gISFuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9BbmRyb2lkL2kpO1xuICB9XG5cbiAgLyoqXG4gICogQGRlc2MgRGV0ZXJtaW5lcyBpZiB0aGUgdXNlciBpcyB1c2luZyBhbiBvbGQgQW5kcm9pZCBkZXZpY2UuXG4gICoqL1xuICBzdGF0aWMgQW5kcm9pZE9sZCgpIHtcbiAgICByZXR1cm4gISFuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9BbmRyb2lkIDIuMy4zL2kpO1xuICB9XG5cbiAgLyoqXG4gICogQGRlc2MgRGV0ZXJtaW5lcyBpZiB0aGUgdXNlciBpcyB1c2luZyBhbiBBbmRyb2lkIHRhYmxldCBkZXZpY2UuXG4gICoqL1xuICBzdGF0aWMgQW5kcm9pZFRhYmxldCgpIHtcbiAgICByZXR1cm4gISEobmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvQW5kcm9pZC9pKSAmJiAhbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvTW9iaWxlL2kpKTtcbiAgfVxuXG4gIC8qKlxuICAqIEBkZXNjIERldGVybWluZXMgaWYgdGhlIHVzZXIgaXMgdXNpbmcgYSBLaW5kbGUuXG4gICoqL1xuICBzdGF0aWMgS2luZGxlKCkge1xuICAgIHJldHVybiAhIW5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL0tpbmRsZS9pKTtcbiAgfVxuXG4gIC8qKlxuICAqIEBkZXNjIERldGVybWluZXMgaWYgdGhlIHVzZXIgaXMgdXNpbmcgYSBLaW5kbGUgRmlyZS5cbiAgKiovXG4gIHN0YXRpYyBLaW5kbGVGaXJlKCkge1xuICAgIHJldHVybiAhIW5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL0tGT1QvaSk7XG4gIH1cblxuICAvKipcbiAgKiBAZGVzYyBEZXRlcm1pbmVzIGlmIHRoZSB1c2VyIGlzIHVzaW5nIFNpbGsuXG4gICoqL1xuICBzdGF0aWMgU2lsaygpIHtcbiAgICByZXR1cm4gISFuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9TaWxrL2kpO1xuICB9XG5cbiAgLyoqXG4gICogQGRlc2MgRGV0ZXJtaW5lcyBpZiB0aGUgdXNlciBpcyB1c2luZyBhIEJsYWNrQmVycnkgZGV2aWNlXG4gICoqL1xuICBzdGF0aWMgQmxhY2tCZXJyeSgpIHtcbiAgICByZXR1cm4gISFuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9CbGFja0JlcnJ5L2kpO1xuICB9XG5cbiAgLyoqXG4gICogQGRlc2MgRGV0ZXJtaW5lcyBpZiB0aGUgdXNlciBpcyB1c2luZyBhbiBpT1MgZGV2aWNlLlxuICAqKi9cbiAgc3RhdGljIGlPUygpIHtcbiAgICByZXR1cm4gISFuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9pUGhvbmV8aVBhZHxpUG9kL2kpO1xuICB9XG5cbiAgLyoqXG4gICogQGRlc2MgRGV0ZXJtaW5lcyBpZiB0aGUgdXNlciBpcyB1c2luZyBhbiBpUGhvbmUgb3IgaVBvZC5cbiAgKiovXG4gIHN0YXRpYyBpUGhvbmUoKSB7XG4gICAgcmV0dXJuICEhbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvaVBob25lfGlQb2QvaSk7XG4gIH1cblxuICAvKipcbiAgKiBAZGVzYyBEZXRlcm1pbmVzIGlmIHRoZSB1c2VyIGlzIHVzaW5nIGFuIGlQYWQuXG4gICoqL1xuICBzdGF0aWMgaVBhZCgpIHtcbiAgICByZXR1cm4gISFuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9pUGFkL2kpO1xuICB9XG5cbiAgLyoqXG4gICogQGRlc2MgRGV0ZXJtaW5lcyBpZiB0aGUgdXNlciBpcyB1c2luZyBhIFdpbmRvd3MgTW9iaWxlIGRldmljZS5cbiAgKiovXG4gIHN0YXRpYyBXaW5kb3dzKCkge1xuICAgIHJldHVybiAhIW5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL0lFTW9iaWxlL2kpO1xuICB9XG5cbiAgLyoqXG4gICogQGRlc2MgRGV0ZXJtaW5lcyBpZiB0aGUgdXNlciBpcyB1c2luZyBGaXJlRm94T1MuXG4gICoqL1xuICBzdGF0aWMgRmlyZWZveE9TKCkge1xuICAgIHJldHVybiAhIW5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL01vemlsbGEvaSkgJiYgISFuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9Nb2JpbGUvaSk7XG4gIH1cblxuICAvKipcbiAgKiBAZGVzYyBEZXRlcm1pbmVzIGlmIHRoZSB1c2VyIGlzIHVzaW5nIGEgUmV0aW5hIGRpc3BsYXkuXG4gICoqL1xuICBzdGF0aWMgUmV0aW5hKCkge1xuICAgIHJldHVybiAod2luZG93LnJldGluYSB8fCB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyA+IDEpO1xuICB9XG5cbiAgLyoqXG4gICogQGRlc2MgRGV0ZXJtaW5lcyBpZiB0aGUgdXNlciBpcyB1c2luZyBhbnkgdHlwZSBvZiBtb2JpbGUgZGV2aWNlLlxuICAqKi9cbiAgc3RhdGljIGFueSgpIHtcbiAgICByZXR1cm4gKHRoaXMuQW5kcm9pZCgpIHx8IHRoaXMuS2luZGxlKCkgfHwgdGhpcy5LaW5kbGVGaXJlKCkgfHwgdGhpcy5TaWxrKCkgfHwgdGhpcy5CbGFja0JlcnJ5KCkgfHwgdGhpcy5pT1MoKSB8fCB0aGlzLldpbmRvd3MoKSB8fCB0aGlzLkZpcmVmb3hPUygpKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBNb2JpbGVEZXRlY3Rpb247XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvdXRpbC9tb2JpbGUuanMiLCIvKipcbiogQGRlc2MgSWYgYSBkaWZmZXJlbnQga2V5IGlzIHJlcXVpcmVkIHRvIHNlcnZlIHBvc2l0aW9uIHRhcmdldGluZyBmb3Igb2xkZXIgY3JlYXRpdmVzLCByZW5hbWUgaXQgaGVyZS5cbiogQHBhcmFtIHtvYmplY3R9IHRhcmdldGluZyAtIFRhcmdldGluZyBvYmplY3QgcGFzc2VkIGluIGZyb20gdGhlIGFkIG9iamVjdC5cbiogQHBhcmFtIHtudW1iZXJ9IHBvc2l0aW9uVmFsdWUgLSBUaGUgbnRoIG51bWJlciBvZiBhZFR5cGUgaW5jbHVkZWQuXG4qIEByZXR1cm4gLSBSZXR1cm5zIHRoZSB0YXJnZXRpbmcgb2JqZWN0IHdpdGggdGhlIG9sZCBwb3NpdGlvbiB2YWx1ZSBzdHJpcHBlZCBvdXQsIGFuZCB0aGUgbmV3IG9uZSB3aXRoIHRoZSBkZXNpcmVkIGtleSBpbiBpdHMgcGxhY2UuXG4qKi9cbmV4cG9ydCBmdW5jdGlvbiByZW5hbWVQb3NpdGlvbktleSh0YXJnZXRpbmcsIHBvc2l0aW9uVmFsdWUpIHtcbiAgY29uc3QgbmV3VGFyZ2V0aW5nT2JqZWN0ID0gdGFyZ2V0aW5nO1xuICBjb25zdCBrZXlOYW1lID0gdGFyZ2V0aW5nLnBvc2l0aW9uLmFzO1xuICBkZWxldGUgbmV3VGFyZ2V0aW5nT2JqZWN0LnBvc2l0aW9uO1xuICBuZXdUYXJnZXRpbmdPYmplY3Rba2V5TmFtZV0gPSBwb3NpdGlvblZhbHVlO1xuICBPYmplY3QuYXNzaWduKHRhcmdldGluZywgbmV3VGFyZ2V0aW5nT2JqZWN0KTtcbiAgcmV0dXJuIHRhcmdldGluZztcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy91dGlsL2N1c3RvbVRhcmdldGluZy5qcyIsIi8qKlxuKiBAZGVzYyBBY2NlcHRzIGEga2V5IGFzIGEgc3RyaW5nIGFuZCByZXR1cm5zIHRoZSB2YWx1ZSBvZiBhIHF1ZXJ5IHBhcmFtZXRlciBvbiB0aGUgcGFnZSByZXF1ZXN0LlxuKiBAcGFyYW0ge3N0cmluZ30gcGFyYW0gLSBBIHN0cmluZyB0aGF0IHJlcHJlc2VudHMgdGhlIGtleSBvZiBhIHF1ZXJ5IHBhcmFtdGVyLCBmb3IgZXhhbXBsZSAnYWRzbG90JyB3aWxsIHJldHVybiAnaGVsbG8nIGlmIHRoZSB1cmwgaGFzICc/YWRzbG90PWhlbGxvJyBhdCB0aGUgZW5kIG9mIGl0LlxuKiBAcmV0dXJuIC0gUmV0dXJucyBhIHN0cmluZyBjb250YWluaW5nIHRoZSB2YWx1ZSBvZiBhIHF1ZXJ5IHBhcmFtdGVyLlxuKiovXG5leHBvcnQgZnVuY3Rpb24gZXhwYW5kUXVlcnlTdHJpbmcocGFyYW0pIHtcbiAgY29uc3QgdXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG4gIGNvbnN0IG5hbWUgPSBwYXJhbS5yZXBsYWNlKC9bW1xcXV0vZywgJ1xcXFwkJicpO1xuICBjb25zdCByZWdleCA9IG5ldyBSZWdFeHAoYFs/Jl0ke25hbWV9KD0oW14mI10qKXwmfCN8JClgKTtcbiAgY29uc3QgcmVzdWx0cyA9IHJlZ2V4LmV4ZWModXJsKTtcblxuICBpZiAoIXJlc3VsdHMpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGlmICghcmVzdWx0c1syXSkge1xuICAgIHJldHVybiAnJztcbiAgfVxuICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHJlc3VsdHNbMl0ucmVwbGFjZSgvXFwrL2csICcgJykpO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3V0aWwvcXVlcnkuanMiLCIvKipcbiogQGRlc2MgRmV0Y2hlcyBhIGJpZCBmb3IgYW4gYWR2ZXJ0aXNlbWVudCBiYXNlZCBvbiB3aGljaCBzZXJ2aWNlcyBhcmUgZW5hYmxlZCBvbiB1bml0IGFuZCB0aGUgd3JhcHBlci5cbiogQHBhcmFtIHtzdHJpbmd9IGlkIC0gQSBzdHJpbmcgY29udGFpbmluZyB0aGUgYWR2ZXJ0aXNlbWVudCBpZCBjb3JyZXNwb25kaW5nIHRvIHRoZSBkaXYgdGhlIGFkdmVydGlzZW1lbnQgd2lsbCBsb2FkIGludG8uXG4qIEBwYXJhbSB7c3RyaW5nfSBzbG90TmFtZSAtIEEgc3RyaW5nIGNvbnRhaW5pbmcgdGhlIHNsb3QgbmFtZSBvZiB0aGUgYWR2ZXJ0aXNlbWVudCwgZm9yIGluc3RhbmNlICcxMjM0L2Fkbi5jb20vaG9tZXBhZ2UnLlxuKiBAcGFyYW0ge2FycmF5fSBkaW1lbnNpb25zIC0gQW4gYXJyYXkgY29udGFpbmluZyBhbGwgb2YgdGhlIGFwcGxpY2FibGUgc2l6ZXMgdGhlIGFkdmVydGlzZW1lbnQgY2FuIHVzZS5cbiogQHBhcmFtIHtmdW5jdGlvbn0gY2IgLSBBbiBvcHRpb25hbCBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IHNob3VsZCBmaXJlIHdoZW5ldmVyIHRoZSBiaWRkaW5nIGhhcyBjb25jbHVkZWQuXG4qKi9cbmV4cG9ydCBmdW5jdGlvbiBmZXRjaEFtYXpvbkJpZHMoaWQsIHNsb3ROYW1lLCBkaW1lbnNpb25zLCBjYiA9IG51bGwpIHtcbiAgcXVldWVBbWF6b25Db21tYW5kKCgpID0+IHtcbiAgICBjb25zdCBzbG90ID0ge1xuICAgICAgc2xvdE5hbWUsXG4gICAgICBzbG90SUQ6IGlkLFxuICAgICAgc2l6ZXM6IGRpbWVuc2lvbnNcbiAgICB9O1xuXG4gICAgLy8gUmV0cmlldmVzIHRoZSBiaWQgZnJvbSBBbWF6b25cbiAgICB3aW5kb3cuYXBzdGFnLmZldGNoQmlkcyh7IHNsb3RzOiBbc2xvdF0gfSwgKCkgPT4ge1xuICAgICAgLy8gU2V0cyB0aGUgdGFyZ2V0aW5nIHZhbHVlcyBvbiB0aGUgZGlzcGxheSBiaWQgZnJvbSBhcHN0YWdcbiAgICAgIHdpbmRvdy5hcHN0YWcuc2V0RGlzcGxheUJpZHMoKTtcblxuICAgICAgaWYgKGNiKSB7XG4gICAgICAgIGNiKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufVxuXG4vKipcbiogQGRlc2MgQWRkcyBhbiBBbWF6b24gY29tbWFuZCB0byBhIGNhbGxiYWNrIHF1ZXVlIHdoaWNoIGF3YWl0cyBmb3Igd2luZG93LmFwc3RhZ1xuKiBAcGFyYW0ge3N0cmluZ30gY21kIC0gVGhlIGZ1bmN0aW9uIHRoYXQgc2hvdWxkIHdhaXQgZm9yIHdpbmRvdy5hcHN0YWcgdG8gYmUgcmVhZHkuXG4qKi9cbmV4cG9ydCBmdW5jdGlvbiBxdWV1ZUFtYXpvbkNvbW1hbmQoY21kKSB7XG4gIGlmICh3aW5kb3cuYXBzdGFnKSB7XG4gICAgY21kKCk7XG4gIH0gZWxzZSB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBxdWV1ZUFtYXpvbkNvbW1hbmQoY21kKTtcbiAgICB9LCAyMDApO1xuICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvc2VydmljZXMvYW1hem9uLmpzIiwiaW1wb3J0IHsgZGVib3VuY2UgfSBmcm9tICcuLi91dGlsL2RlYm91bmNlJztcbmltcG9ydCB7IGZldGNoQmlkcyB9IGZyb20gJy4vaGVhZGVyYmlkZGluZyc7XG5pbXBvcnQgeyByZWZyZXNoU2xvdCB9IGZyb20gJy4vZ3B0JztcblxuLyoqIEBkZXNjIEFuIG9iamVjdCBjb250YWluaW5nIGFsbCBvZiB0aGUgc2l6ZSBtYXAgcmVmcmVzaCBldmVudCBsaXN0ZW5lcnMgYW5kIGNvcnJlbGF0b3JzIGZvciBzaXplIG1hcHBpbmcuICoqL1xuZXhwb3J0IGNvbnN0IHNpemVtYXBMaXN0ZW5lcnMgPSB7fTtcblxuLyoqIEBkZXNjIEFuIG9iamVjdCBjb250YWluaW5nIGFsbCBvZiB0aGUgc2NyZWVuIHJlc2l6ZSBldmVudCBsaXN0ZW5lcnMgZm9yIHNpemUgbWFwcGluZy4gKiovXG5leHBvcnQgY29uc3QgcmVzaXplTGlzdGVuZXJzID0ge307XG5cbi8qKlxuKiBAZGVzYyBQcmVwYXJlcyBhIHNldCBvZiBkaW1lbnNpb25zIGFuZCB0aGVpciBjb3JyZXNwb25kaW5nIGJyZWFrcG9pbnRzIHRvIGNyZWF0ZSBhIHNpemVtYXAgd2hpY2ggaXMgcmVhZGFibGUgYnkgR1BULlxuKiBAcGFyYW0ge2FycmF5fSBkaW1lbnNpb25zIC0gQW4gYXJyYXkgY29udGFpbmluZyBhbGwgb2YgdGhlIGFwcGxpY2FibGUgc2l6ZXMgdGhlIGFkdmVydGlzZW1lbnQgY2FuIHVzZS5cbiogQHBhcmFtIHthcnJheX0gc2l6ZW1hcCAtIEFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIG9mIHRoZSBhcHBsaWNhYmxlIGJyZWFrcG9pbnRzIGZvciB0aGUgc2l6ZW1hcHBpbmcuXG4qKi9cbmV4cG9ydCBmdW5jdGlvbiBwcmVwYXJlU2l6ZU1hcHMoZGltZW5zaW9ucywgc2l6ZW1hcCkge1xuICBjb25zdCBtYXBwaW5nID0gW107XG4gIGNvbnN0IGJyZWFrcG9pbnRzID0gW107XG4gIGNvbnN0IGNvcnJlbGF0b3JzID0gW107XG4gIGNvbnN0IHBhcnNlZFNpemVtYXAgPSAhc2l6ZW1hcC5sZW5ndGggPyBudWxsIDogSlNPTi5wYXJzZShzaXplbWFwKTtcblxuICBwYXJzZWRTaXplbWFwLmZvckVhY2goKHZhbHVlLCBpbmRleCkgPT4ge1xuICAgIG1hcHBpbmcucHVzaChbdmFsdWUsIGRpbWVuc2lvbnNbaW5kZXhdXSk7XG5cbiAgICAvLyBGaWx0ZXJzIGR1cGxpY2F0ZXMgZnJvbSB0aGUgbWFwcGluZ1xuICAgIGlmIChicmVha3BvaW50cy5pbmRleE9mKHZhbHVlWzBdKSA9PT0gLTEpIHtcbiAgICAgIGJyZWFrcG9pbnRzLnB1c2godmFsdWVbMF0pO1xuICAgICAgY29ycmVsYXRvcnMucHVzaChmYWxzZSk7XG4gICAgfVxuICB9KTtcblxuICBicmVha3BvaW50cy5zb3J0KChhLCBiKSA9PiB7IHJldHVybiBhIC0gYjsgfSk7XG5cbiAgcmV0dXJuIHsgbWFwcGluZywgYnJlYWtwb2ludHMsIGNvcnJlbGF0b3JzIH07XG59XG5cbi8qKlxuKiBAZGVzYyBEZXRlcm1pbmVzIHdoaWNoIHNldCBvZiBhZCBzaXplcyBhcmUgYWJvdXQgdG8gZGlzcGxheSBiYXNlZCBvbiB0aGUgdXNlcnMgY3VycmVudCBzY3JlZW4gc2l6ZS5cbiogQHBhcmFtIHthcnJheX0gc2l6ZU1hcHBpbmdzIC0gQW4gYXJyYXkgY29udGFpbmluZyB0aGUgYWR2ZXJ0aXNlbWVudHMgR1BUIHJlYWRhYmxlIHNpemUgbWFwcGluZy5cbiogQHJldHVybiB7YXJyYXl9IC0gUmV0dXJucyBhbiBhcnJheSBjb250YWluaW5nIHRoZSBhZCBzaXplcyB3aGljaCByZWxhdGUgdG8gdGhlIHVzZXJzIGN1cnJlbnQgd2luZG93IHdpZHRoLlxuKiovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VTaXplTWFwcGluZ3Moc2l6ZU1hcHBpbmdzKSB7XG4gIHRyeSB7XG4gICAgY29uc3Qgd2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aCB8fFxuICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCB8fFxuICAgIGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGg7XG5cbiAgICBjb25zdCBoZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQgfHxcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0IHx8XG4gICAgZG9jdW1lbnQuYm9keS5jbGllbnRIZWlnaHQ7XG5cbiAgICBjb25zdCBzZCA9IFt3aWR0aCwgaGVpZ2h0XTtcblxuICAgIC8qIEZpbHRlcnMgbWFwcGluZ3MgdGhhdCBhcmUgdmFsaWQgYnkgY29uZmlybWluZyB0aGF0IHRoZSBjdXJyZW50IHNjcmVlbiBkaW1lbnNpb25zXG4gICAgICBhcmUgYm90aCBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gdGhlIGJyZWFrcG9pbnQgW3gsIHldIG1pbmltdW1zIHNwZWNpZmllZCBpbiB0aGUgZmlyc3QgcG9zaXRpb24gaW4gdGhlIG1hcHBpbmcuXG4gICAgICBSZXR1cm5zIHRoZSBsZWZ0bW9zdCBtYXBwaW5nJ3Mgc2l6ZXMgb3IgYW4gZW1wdHkgYXJyYXkuICovXG4gICAgY29uc3QgdmFsaWRNYXBwaW5ncyA9IHNpemVNYXBwaW5ncy5maWx0ZXIoKG1hcHBpbmcpID0+IHtcbiAgICAgIHJldHVybiBtYXBwaW5nWzBdWzBdIDw9IHNkWzBdICYmIG1hcHBpbmdbMF1bMV0gPD0gc2RbMV07XG4gICAgfSk7XG5cbiAgICBsZXQgcmVzdWx0ID0gdmFsaWRNYXBwaW5ncy5sZW5ndGggPiAwID8gdmFsaWRNYXBwaW5nc1swXVsxXSA6IFtdO1xuXG4gICAgaWYgKHJlc3VsdC5sZW5ndGggPiAwICYmIHJlc3VsdFswXS5jb25zdHJ1Y3RvciAhPT0gQXJyYXkpIHtcbiAgICAgIC8vIFdyYXBzIHRoZSAxRCBhcnJheSBpbiBhbm90aGVyIHNldCBvZiBicmFja2V0cyB0byBtYWtlIGl0IDJEXG4gICAgICByZXN1bHQgPSBbcmVzdWx0XTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9IGNhdGNoIChlKSB7XG4gICAgLy8gRmFsbGJhY2sgdG8gbGFzdCBzaXplIG1hcHBpbmcgc3VwcGxpZWQgaWYgdGhlcmUncyBhbiBpbnZhbGlkIG1hcHBpbmcgcHJvdmlkZWRcbiAgICByZXR1cm4gc2l6ZU1hcHBpbmdzW3NpemVNYXBwaW5ncy5sZW5ndGggLSAxXVsxXTtcbiAgfVxufVxuXG4vKipcbiogQGRlc2MgUmVzaXplIGV2ZW50IHRoYXQgY2hlY2tzIGlmIGEgdXNlciBoYXMgcmVzaXplZCBwYXN0IGEgYnJlYWtwb2ludCBpbmNsdWRlZCBpbiB0aGUgYWR2ZXJ0aXNlbWVudHMgc2l6ZW1hcC4gSWYgaXQgaGFzIHRoZSBHUFRcbiogcmVmcmVzaCBtZXRob2QgaXMgY2FsbGVkIHNvIHRoZSBzZXJ2aWNlIGNhbiBmZXRjaCBhIG1vcmUgYXByb3ByaWF0ZWx5IHNpemVkIGNyZWF0aXZlLlxuKiBAcGFyYW0ge29iamVjdH0gcGFyYW1zIC0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgYWxsIG9mIHRoZSBhZHZlcnRpc2VtZW50IGNvbmZpZ3VyYXRpb24gc2V0dGluZ3Mgc3VjaCBhcyBzbG90IG5hbWUsIGlkLCBhbmQgcG9zaXRpb24uXG4qKi9cbmV4cG9ydCBmdW5jdGlvbiBydW5SZXNpemVFdmVudHMocGFyYW1zKSB7XG4gIGxldCBsYXN0QnJlYWtwb2ludDtcbiAgbGV0IGluaXRpYWxMb2FkID0gZmFsc2U7XG5cbiAgcmV0dXJuICgpID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBhZCxcbiAgICAgIGJyZWFrcG9pbnRzLFxuICAgICAgaWQsXG4gICAgICBiaWRkaW5nLFxuICAgICAgbWFwcGluZyxcbiAgICAgIHNsb3ROYW1lLFxuICAgICAgd3JhcHBlcixcbiAgICAgIHByZXJlbmRlciB9ID0gcGFyYW1zO1xuXG4gICAgY29uc3Qgd2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICBsZXQgYnJlYWtwb2ludDtcbiAgICBsZXQgbmV4dEJyZWFrcG9pbnQ7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJyZWFrcG9pbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBicmVha3BvaW50ID0gYnJlYWtwb2ludHNbaV07XG4gICAgICBuZXh0QnJlYWtwb2ludCA9IGJyZWFrcG9pbnRzW2kgKyAxXTtcblxuICAgICAgaWYgKCh3aWR0aCA+IGJyZWFrcG9pbnQgJiYgKHdpZHRoIDwgbmV4dEJyZWFrcG9pbnQgfHwgIW5leHRCcmVha3BvaW50KSAmJiBsYXN0QnJlYWtwb2ludCAhPT0gYnJlYWtwb2ludCkgfHwgKHdpZHRoID09PSBicmVha3BvaW50ICYmICFpbml0aWFsTG9hZCkpIHtcbiAgICAgICAgbGFzdEJyZWFrcG9pbnQgPSBicmVha3BvaW50O1xuICAgICAgICBpbml0aWFsTG9hZCA9IHRydWU7XG5cbiAgICAgICAgLy8gRmV0Y2hlcyBhIHNldCBvZiBkaW1lbnNpb25zIGZvciB0aGUgYWQgd2hpY2ggaXMgYWJvdXQgdG8gZGlzcGxheS5cbiAgICAgICAgY29uc3QgcGFyc2VkU2l6ZU1hcHBpbmcgPSBwYXJzZVNpemVNYXBwaW5ncyhtYXBwaW5nKTtcblxuICAgICAgICBjb25zdCBhZEluZm8gPSB7XG4gICAgICAgICAgYWRVbml0OiBhZCxcbiAgICAgICAgICBhZFNsb3Q6IHNsb3ROYW1lLFxuICAgICAgICAgIGFkRGltZW5zaW9uczogcGFyc2VkU2l6ZU1hcHBpbmcsXG4gICAgICAgICAgYWRJZDogaWRcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBJZiBpdCdzIGluY2x1ZGVkIGluIGEgaGVhZGVyLWJpZGRpbmcgc2VydmljZSB3ZSByZS1mZXRjaCBiaWRzIGZvciB0aGUgZ2l2ZW4gc2xvdCwgb3RoZXJ3aXNlIGl0IHJlZnJlc2hlcyBhcyBub3JtYWwuXG4gICAgICAgIGlmICgoYmlkZGluZy5wcmViaWQgJiYgYmlkZGluZy5wcmViaWQuZW5hYmxlZCkgfHwgKGJpZGRpbmcuYW1hem9uICYmIGJpZGRpbmcuYW1hem9uLmVuYWJsZWQpKSB7XG4gICAgICAgICAgZmV0Y2hCaWRzKHtcbiAgICAgICAgICAgIGFkLFxuICAgICAgICAgICAgaWQsXG4gICAgICAgICAgICBzbG90TmFtZSxcbiAgICAgICAgICAgIGRpbWVuc2lvbnM6IHBhcnNlZFNpemVNYXBwaW5nLFxuICAgICAgICAgICAgYmlkZGluZyxcbiAgICAgICAgICAgIHdyYXBwZXIsXG4gICAgICAgICAgICBwcmVyZW5kZXIsXG4gICAgICAgICAgICBjb3JyZWxhdG9yOiBzaXplbWFwTGlzdGVuZXJzW2lkXS5jb3JyZWxhdG9yc1tpXVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlZnJlc2hTbG90KHtcbiAgICAgICAgICAgIGFkLFxuICAgICAgICAgICAgY29ycmVsYXRvcjogc2l6ZW1hcExpc3RlbmVyc1tpZF0uY29ycmVsYXRvcnNbaV0sXG4gICAgICAgICAgICBwcmVyZW5kZXIsXG4gICAgICAgICAgICBpbmZvOiBhZEluZm9cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBzaXplbWFwTGlzdGVuZXJzW2lkXS5jb3JyZWxhdG9yc1tpXSA9IHRydWU7XG4gICAgfVxuICB9O1xufVxuXG4vKipcbiogQGRlc2MgQXNzaWducyBhbiBldmVudCBsaXN0ZW5lciBmb3IgYSBzaXplIG1hcHBlZCBhZCB3aGljaCBkZXRlY3RzIHdoZW4gdGhlIHNjcmVlbiByZXNpemVzIHBhc3QgYSBicmVha3BvaW50IGluIHRoZSBzaXplbWFwLlxuKiBBbHNvIHN0b3JlcyB0aGUgZXZlbnQgbGlzdGVuZXIgaW4gYW4gb2JqZWN0IHNvcnRlZCBieSB0aGUgYWR2ZXJ0aXNlbWVudCBpZCBzbyBpdCBjYW4gYmUgdW5ib3VuZCBsYXRlciBpZiBuZWVkZWQuXG4qIEBwYXJhbSB7b2JqZWN0fSBwYXJhbXMgLSBBbiBvYmplY3QgY29udGFpbmluZyBhbGwgb2YgdGhlIGFkdmVydGlzZW1lbnQgY29uZmlndXJhdGlvbiBzZXR0aW5ncyBzdWNoIGFzIHNsb3QgbmFtZSwgaWQsIGFuZCBwb3NpdGlvbi5cbioqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldFJlc2l6ZUxpc3RlbmVyKHBhcmFtcykge1xuICBjb25zdCB7IGlkLCBjb3JyZWxhdG9ycyB9ID0gcGFyYW1zO1xuXG4gIHJlc2l6ZUxpc3RlbmVyc1tpZF0gPSBkZWJvdW5jZShydW5SZXNpemVFdmVudHMocGFyYW1zKSwgMjUwKTtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlc2l6ZUxpc3RlbmVyc1tpZF0pO1xuXG4gIC8vIEFkZHMgdGhlIGxpc3RlbmVyIHRvIGFuIG9iamVjdCB3aXRoIHRoZSBpZCBhcyB0aGUga2V5IHNvIHdlIGNhbiB1bmJpbmQgaXQgbGF0ZXIuXG4gIHNpemVtYXBMaXN0ZW5lcnNbaWRdID0geyBsaXN0ZW5lcjogcmVzaXplTGlzdGVuZXJzW2lkXSwgY29ycmVsYXRvcnMgfTtcbn1cblxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3NlcnZpY2VzL3NpemVtYXBwaW5nLmpzIiwiLyoqXG4qIEBkZXNjIERlYm91bmNlcyBhIGZ1bmN0aW9uIHByZXZlbnRpbmcgaXQgZnJvbSBydW5uaW5nIG1vcmUgdGhlbiBldmVyeSBzbyBtYW55IG1pbGxpc2Vjb25kcy4gVXNlZnVsIGZvciBzY3JvbGwgb3IgcmVzaXplIGhhbmRsZXJzLlxuKiBAcGFyYW0ge2Z1bmN0aW9ufSBmdW5jIC0gVGhlIGZ1bmN0aW9uIHRoYXQgc2hvdWxkIGJlIGRlYm91bmNlZC5cbiogQHBhcmFtIHtudW1iZXJ9IHdhaXQgLSBUaGUgYW1vdW50IG9mIHRpbWUgYSBmdW5jdGlvbiBzaG91bGQgd2FpdCBiZWZvcmUgaXQgZmlyZXMgYWdhaW4uXG4qIEByZXR1cm4gLSBSZXR1cm5zIGEgZnVuY3Rpb24gZXZlcnkgc28gbWFueSBtaWxsaXNlY29uZHMgYmFzZWQgb24gdGhlIHByb3ZpZGVkIHBhcmFtZXRlcnMuXG4qKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWJvdW5jZShmdW5jLCB3YWl0KSB7XG4gIGxldCB0aW1lb3V0O1xuICByZXR1cm4gZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgdGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICBmdW5jLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH0sIHdhaXQpO1xuICB9O1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3V0aWwvZGVib3VuY2UuanMiXSwic291cmNlUm9vdCI6IiJ9