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
      if (wrapper.prebid.slotSuffix) {
        adInfo.adSlot = '' + slotName + wrapper.prebid.slotSuffix;
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
      var targetedSlotName = wrapper.amazon.slotSuffix ? '' + slotName + wrapper.amazon.slotSuffix : slotName;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBlMWU1NGFjYmNkMmUwMWNkNGQ3MiIsIndlYnBhY2s6Ly8vLi9zcmMvc2VydmljZXMvZ3B0LmpzIiwid2VicGFjazovLy8od2VicGFjaykvYnVpbGRpbi9nbG9iYWwuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NlcnZpY2VzL2hlYWRlcmJpZGRpbmcuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWwvcmVzb3VyY2VzLmpzIiwid2VicGFjazovLy8uL3NyYy9zZXJ2aWNlcy9wcmViaWQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsL3BvbHlmaWxscy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHJvbWlzZS1wb2x5ZmlsbC9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RpbWVycy1icm93c2VyaWZ5L21haW4uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3NldGltbWVkaWF0ZS9zZXRJbW1lZGlhdGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHJvbWlzZS1wb2x5ZmlsbC9zcmMvZmluYWxseS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbC9tb2JpbGUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWwvY3VzdG9tVGFyZ2V0aW5nLmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsL3F1ZXJ5LmpzIiwid2VicGFjazovLy8uL3NyYy9zZXJ2aWNlcy9hbWF6b24uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NlcnZpY2VzL3NpemVtYXBwaW5nLmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsL2RlYm91bmNlLmpzIl0sIm5hbWVzIjpbImluaXRpYWxpemVHUFQiLCJyZWZyZXNoU2xvdCIsInF1ZXVlR29vZ2xldGFnQ29tbWFuZCIsInNldFRhcmdldGluZyIsImRmcFNldHRpbmdzIiwiZGV0ZXJtaW5lU2xvdE5hbWUiLCJ3aW5kb3ciLCJnb29nbGV0YWciLCJjbWQiLCJhZCIsImNvcnJlbGF0b3IiLCJwcmVyZW5kZXIiLCJpbmZvIiwiUHJvbWlzZSIsInJlc29sdmUiLCJ0aGVuIiwiZXJyb3IiLCJjb25zb2xlIiwid2FybiIsInJ1blJlZnJlc2hFdmVudCIsInB1YmFkc1JlYWR5IiwicHViYWRzIiwicmVmcmVzaCIsImNoYW5nZUNvcnJlbGF0b3IiLCJzZXRUaW1lb3V0IiwiZm4iLCJwdXNoIiwib3B0aW9ucyIsImtleSIsImhhc093blByb3BlcnR5IiwiaGFuZGxlU2xvdFJlbmRlckVuZGVkIiwiZGlzYWJsZUluaXRpYWxMb2FkIiwiZW5hYmxlU2luZ2xlUmVxdWVzdCIsImVuYWJsZUFzeW5jUmVuZGVyaW5nIiwiZW5hYmxlU2VydmljZXMiLCJhZGRFdmVudExpc3RlbmVyIiwiZGZwQ29kZSIsInNsb3ROYW1lIiwic2xvdE92ZXJyaWRlIiwiaW5pdGlhbGl6ZUJpZGRpbmdTZXJ2aWNlcyIsImZldGNoQmlkcyIsInByZWJpZCIsImFtYXpvbiIsImFyY0JpZGRpbmdSZWFkeSIsImVuYWJsZVByZWJpZCIsImVuYWJsZWQiLCJwYmpzIiwicXVlIiwiZW5hYmxlQW1hem9uIiwiaWQiLCJhcHN0YWciLCJpbml0IiwicHViSUQiLCJhZFNlcnZlciIsImFsbCIsImRpbWVuc2lvbnMiLCJ3cmFwcGVyIiwiYmlkZGluZyIsImFkSW5mbyIsImFkVW5pdCIsImFkU2xvdCIsImFkRGltZW5zaW9ucyIsImFkSWQiLCJwcmViaWRCaWRzIiwidGltZW91dCIsInNsb3RTdWZmaXgiLCJxdWV1ZVByZWJpZENvbW1hbmQiLCJiaW5kIiwiYW1hem9uQmlkcyIsInRhcmdldGVkU2xvdE5hbWUiLCJhcHBlbmRSZXNvdXJjZSIsInRhZ25hbWUiLCJ1cmwiLCJhc3luYyIsImRlZmVyIiwiY2IiLCJ0YWciLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJzcmMiLCJoZWFkIiwiZG9jdW1lbnRFbGVtZW50IiwiYXBwZW5kQ2hpbGQiLCJmZXRjaFByZWJpZEJpZHMiLCJhZGRVbml0IiwicmVxdWVzdEJpZHMiLCJhZFVuaXRDb2RlcyIsImJpZHNCYWNrSGFuZGxlciIsInNldFRhcmdldGluZ0ZvckdQVEFzeW5jIiwiY29kZSIsInNpemVzIiwiYmlkcyIsInNsb3QiLCJzaXplQ29uZmlnIiwiYWRkQWRVbml0cyIsInNldENvbmZpZyIsIkFyY0FkcyIsImhhbmRsZVNsb3RSZW5kZXJlZCIsImRmcElkIiwiZGZwIiwicG9zaXRpb25zIiwiaXNNb2JpbGUiLCJNb2JpbGVEZXRlY3Rpb24iLCJwYXJhbXMiLCJhZFR5cGUiLCJ0YXJnZXRpbmciLCJkaXNwbGF5IiwicG9zaXRpb24iLCJhcyIsIk9iamVjdCIsImFzc2lnbiIsInBvc2l0aW9uUGFyYW0iLCJhbnkiLCJkaXNwbGF5QWQiLCJjb2xsZWN0aW9uIiwiZm9yRWFjaCIsImFkdmVydCIsInJlZ2lzdGVyQWQiLCJzaXplbWFwIiwiZnVsbFNsb3ROYW1lIiwicGFyc2VkRGltZW5zaW9ucyIsImxlbmd0aCIsIkpTT04iLCJwYXJzZSIsImRlZmluZU91dE9mUGFnZVNsb3QiLCJkZWZpbmVTbG90IiwiYnJlYWtwb2ludHMiLCJtYXBwaW5nIiwiY29ycmVsYXRvcnMiLCJkZWZpbmVTaXplTWFwcGluZyIsImFkZFNlcnZpY2UiLCJkZWZpbmVQcm9wZXJ0eSIsInZhbHVlIiwidGFyZ2V0IiwidmFyQXJncyIsIlR5cGVFcnJvciIsInRvIiwiaW5kZXgiLCJhcmd1bWVudHMiLCJuZXh0U291cmNlIiwibmV4dEtleSIsInByb3RvdHlwZSIsImNhbGwiLCJ3cml0YWJsZSIsImNvbmZpZ3VyYWJsZSIsIm5hdmlnYXRvciIsInVzZXJBZ2VudCIsIm1hdGNoIiwicmV0aW5hIiwiZGV2aWNlUGl4ZWxSYXRpbyIsIkFuZHJvaWQiLCJLaW5kbGUiLCJLaW5kbGVGaXJlIiwiU2lsayIsIkJsYWNrQmVycnkiLCJpT1MiLCJXaW5kb3dzIiwiRmlyZWZveE9TIiwicmVuYW1lUG9zaXRpb25LZXkiLCJwb3NpdGlvblZhbHVlIiwibmV3VGFyZ2V0aW5nT2JqZWN0Iiwia2V5TmFtZSIsImV4cGFuZFF1ZXJ5U3RyaW5nIiwicGFyYW0iLCJsb2NhdGlvbiIsImhyZWYiLCJuYW1lIiwicmVwbGFjZSIsInJlZ2V4IiwiUmVnRXhwIiwicmVzdWx0cyIsImV4ZWMiLCJkZWNvZGVVUklDb21wb25lbnQiLCJmZXRjaEFtYXpvbkJpZHMiLCJxdWV1ZUFtYXpvbkNvbW1hbmQiLCJzbG90SUQiLCJzbG90cyIsInNldERpc3BsYXlCaWRzIiwicHJlcGFyZVNpemVNYXBzIiwicGFyc2VTaXplTWFwcGluZ3MiLCJydW5SZXNpemVFdmVudHMiLCJzZXRSZXNpemVMaXN0ZW5lciIsInNpemVtYXBMaXN0ZW5lcnMiLCJyZXNpemVMaXN0ZW5lcnMiLCJwYXJzZWRTaXplbWFwIiwiaW5kZXhPZiIsInNvcnQiLCJhIiwiYiIsInNpemVNYXBwaW5ncyIsIndpZHRoIiwiaW5uZXJXaWR0aCIsImNsaWVudFdpZHRoIiwiYm9keSIsImhlaWdodCIsImlubmVySGVpZ2h0IiwiY2xpZW50SGVpZ2h0Iiwic2QiLCJ2YWxpZE1hcHBpbmdzIiwiZmlsdGVyIiwicmVzdWx0IiwiY29uc3RydWN0b3IiLCJBcnJheSIsImUiLCJsYXN0QnJlYWtwb2ludCIsImluaXRpYWxMb2FkIiwiYnJlYWtwb2ludCIsIm5leHRCcmVha3BvaW50IiwiaSIsInBhcnNlZFNpemVNYXBwaW5nIiwibGlzdGVuZXIiLCJkZWJvdW5jZSIsImZ1bmMiLCJ3YWl0IiwiYXJncyIsImNsZWFyVGltZW91dCIsImFwcGx5Il0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTztBQ1ZBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtB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QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHlDQUF5QztBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7O0FBRUEsS0FBSztBQUNMO0FBQ0E7O0FBRUEsS0FBSztBQUNMO0FBQ0E7O0FBRUEsS0FBSztBQUNMO0FBQ0E7O0FBRUEsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsQ0FBQzs7Ozs7Ozs7QUN6TEQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtB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QixDQUFpQ2dGLENBQWpDLENBRkY7QUFHVnJNLGdDQUhVO0FBSVZDLGtCQUFNOEM7QUFKSSxXQUFaO0FBTUQ7QUFDRjs7QUFFRDRILHVCQUFpQnJJLEVBQWpCLEVBQXFCK0UsV0FBckIsQ0FBaUNnRixDQUFqQyxJQUFzQyxJQUF0QztBQUNEO0FBQ0YsR0F6REQ7QUEwREQ7O0FBRUQ7Ozs7O0FBS08sU0FBUzNCLGlCQUFULENBQTJCOUUsTUFBM0IsRUFBbUM7QUFBQSxNQUNoQ3RELEVBRGdDLEdBQ1pzRCxNQURZLENBQ2hDdEQsRUFEZ0M7QUFBQSxNQUM1QitFLFdBRDRCLEdBQ1p6QixNQURZLENBQzVCeUIsV0FENEI7OztBQUd4Q3VELGtCQUFnQnRJLEVBQWhCLElBQXNCLHdCQUFTbUksZ0JBQWdCN0UsTUFBaEIsQ0FBVCxFQUFrQyxHQUFsQyxDQUF0QjtBQUNBakcsU0FBTzZCLGdCQUFQLENBQXdCLFFBQXhCLEVBQWtDb0osZ0JBQWdCdEksRUFBaEIsQ0FBbEM7O0FBRUE7QUFDQXFJLG1CQUFpQnJJLEVBQWpCLElBQXVCLEVBQUVpSyxVQUFVM0IsZ0JBQWdCdEksRUFBaEIsQ0FBWixFQUFpQytFLHdCQUFqQyxFQUF2QjtBQUNELEM7Ozs7Ozs7Ozs7OztRQ3RKZW1GLFEsR0FBQUEsUTtBQU5oQjs7Ozs7O0FBTU8sU0FBU0EsUUFBVCxDQUFrQkMsSUFBbEIsRUFBd0JDLElBQXhCLEVBQThCO0FBQ25DLE1BQUlySixnQkFBSjtBQUNBLFNBQU8sWUFBbUI7QUFBQTs7QUFBQSxzQ0FBTnNKLElBQU07QUFBTkEsVUFBTTtBQUFBOztBQUN4QkMsaUJBQWF2SixPQUFiO0FBQ0FBLGNBQVV4QyxXQUFXLFlBQU07QUFDekJ3QyxnQkFBVSxJQUFWO0FBQ0FvSixXQUFLSSxLQUFMLFFBQWlCRixJQUFqQjtBQUNELEtBSFMsRUFHUEQsSUFITyxDQUFWO0FBSUQsR0FORDtBQU9ELEMiLCJmaWxlIjoiYXJjYWRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIHtcblx0XHR2YXIgYSA9IGZhY3RvcnkoKTtcblx0XHRmb3IodmFyIGkgaW4gYSkgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyA/IGV4cG9ydHMgOiByb290KVtpXSA9IGFbaV07XG5cdH1cbn0pKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyA/IHNlbGYgOiB0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiBcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gNSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgZTFlNTRhY2JjZDJlMDFjZDRkNzIiLCJpbXBvcnQgeyBhcHBlbmRSZXNvdXJjZSB9IGZyb20gJy4uL3V0aWwvcmVzb3VyY2VzJztcbmltcG9ydCB7IGV4cGFuZFF1ZXJ5U3RyaW5nIH0gZnJvbSAnLi4vdXRpbC9xdWVyeSc7XG5cbi8qKlxuKiBAZGVzYyBJbml0aWFsaXplcyB0aGUgR29vZ2xlIFB1Ymxpc2hlciB0YWcgc2NyaXB0cy5cbioqL1xuZXhwb3J0IGZ1bmN0aW9uIGluaXRpYWxpemVHUFQoKSB7XG4gIHdpbmRvdy5nb29nbGV0YWcgPSB3aW5kb3cuZ29vZ2xldGFnIHx8IHt9O1xuICB3aW5kb3cuZ29vZ2xldGFnLmNtZCA9IHdpbmRvdy5nb29nbGV0YWcuY21kIHx8IFtdO1xuXG4gIGFwcGVuZFJlc291cmNlKCdzY3JpcHQnLCAnLy93d3cuZ29vZ2xldGFnc2VydmljZXMuY29tL3RhZy9qcy9ncHQuanMnLCB0cnVlLCB0cnVlKTtcbn1cblxuLyoqXG4qIEBkZXNjIFJlZnJlc2hlcyBhbiBhZHZlcnRpc2VtZW50IHZpYSB0aGUgR1BUIHJlZnJlc2ggbWV0aG9kLiBJZiBhIHByZXJlbmRlciBmdW5jdGlvbiBpcyBwcm92aWRlZCBpdCBpcyBleGVjdXRlZCBwcmlvciB0byB0aGUgcmVmcmVzaC5cbiogQHBhcmFtIHtvYmplY3R9IG9iaiAtIEFuIG9iamVjdCBjb250YWluaW5nIGFsbCBvZiB0aGUgZnVuY3Rpb24gYXJndW1lbnRzLlxuKiBAcGFyYW0ge09iamVjdH0gb2JqLmFkIC0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIEdQVCBhZCBzbG90LlxuKiBAcGFyYW0ge2Jvb2xlYW59IG9iai5jb3JyZWxhdG9yIC0gQW4gb3B0aW9uYWwgYm9vbGVhbiB0aGF0IGRlc2NyaWJlcyBpZiB0aGUgY29ycmVsYXRvciB2YWx1ZSBzaG91bGQgdXBkYXRlIG9yIG5vdC5cbiogQHBhcmFtIHtmdW5jdGlvbn0gb2JqLnByZXJlbmRlciAtIEFuIG9wdGlvbmFsIGZ1bmN0aW9uIHRoYXQgd2lsbCBydW4gYmVmb3JlIHRoZSBhZHZlcnRpc2VtZW50IHJlbmRlcnMuXG4qIEBwYXJhbSB7b2JqZWN0fSBvYmouaW5mbyAtIEFuIG9iamVjdCBjb250YWluaW5nIGluZm9ybWF0aW9uIGFib3V0IHRoZSBhZHZlcnRpc2VtZW50IHRoYXQgaXMgYWJvdXQgdG8gbG9hZC5cbioqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlZnJlc2hTbG90KHtcbiAgYWQsXG4gIGNvcnJlbGF0b3IgPSBmYWxzZSxcbiAgcHJlcmVuZGVyID0gbnVsbCxcbiAgaW5mbyA9IHt9XG59KSB7XG4gIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgaWYgKHByZXJlbmRlcikge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcHJlcmVuZGVyKGluZm8pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHJlc29sdmUoJ1ByZXJlbmRlciBmdW5jdGlvbiBoYXMgY29tcGxldGVkLicpO1xuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihgQXJjQWRzOiBQcmVyZW5kZXIgZnVuY3Rpb24gZGlkIG5vdCByZXR1cm4gYSBwcm9taXNlIG9yIHRoZXJlIHdhcyBhbiBlcnJvci5cbiAgICAgICAgICBEb2N1bWVudGF0aW9uOiBodHRwczovL2dpdGh1Yi5jb20vd2Fwb3BhcnRuZXJzL2FyYy1hZHMvd2lraS9VdGlsaXppbmctYS1QcmVyZW5kZXItSG9va2ApO1xuICAgICAgICByZXNvbHZlKCdQcmVyZW5kZXIgZnVuY3Rpb24gZGlkIG5vdCByZXR1cm4gYSBwcm9taXNlIG9yIHRoZXJlIHdhcyBhbiBlcnJvciwgaWdub3JpbmcuJyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc29sdmUoJ05vIFByZXJlbmRlciBmdW5jdGlvbiB3YXMgcHJvdmlkZWQuJyk7XG4gICAgfVxuICB9KS50aGVuKCgpID0+IHtcbiAgICBydW5SZWZyZXNoRXZlbnQoKTtcbiAgfSk7XG5cbiAgZnVuY3Rpb24gcnVuUmVmcmVzaEV2ZW50KCkge1xuICAgIGlmICh3aW5kb3cuZ29vZ2xldGFnICYmIGdvb2dsZXRhZy5wdWJhZHNSZWFkeSkge1xuICAgICAgd2luZG93Lmdvb2dsZXRhZy5wdWJhZHMoKS5yZWZyZXNoKFthZF0sIHsgY2hhbmdlQ29ycmVsYXRvcjogY29ycmVsYXRvciB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHJ1blJlZnJlc2hFdmVudCgpO1xuICAgICAgfSwgMjAwKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4qIEBkZXNjIFF1ZXVlcyBhIGNvbW1hbmQgaW5zaWRlIG9mIEdQVC5cbiogQHBhcmFtIHtmdW5jdGlvbn0gZm4gLSBBY2NlcHRzIGEgZnVuY3Rpb24gdG8gcHVzaCBpbnRvIHRoZSBQcmViaWQgY29tbWFuZCBxdWV1ZS5cbioqL1xuZXhwb3J0IGZ1bmN0aW9uIHF1ZXVlR29vZ2xldGFnQ29tbWFuZChmbikge1xuICB3aW5kb3cuZ29vZ2xldGFnLmNtZC5wdXNoKGZuKTtcbn1cblxuLyoqXG4qIEBkZXNjIEFzc2lnbnMga2V5L3ZhbHVlIHRhcmdldGluZyB0byBhIHNwZWNpZmljIGFkdmVydGlzZW1lbnQuXG4qIEBwYXJhbSB7T2JqZWN0fSBhZCAtIEFuIG9iamVjdCBjb250YWluaW5nIHRoZSBHUFQgYWQgc2xvdC5cbiogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBBbiBvYmplY3QgY29udGFpbmluZyBhbGwgb2YgdGhlIGtleS92YWx1ZSB0YXJnZXRpbmcgcGFpcnMgdG8gYXNzaWduIHRvIHRoZSBhZHZlcnRpc2VtZW50LlxuKiovXG5leHBvcnQgZnVuY3Rpb24gc2V0VGFyZ2V0aW5nKGFkLCBvcHRpb25zKSB7XG4gIGZvciAoY29uc3Qga2V5IGluIG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIG9wdGlvbnNba2V5XSkge1xuICAgICAgYWQuc2V0VGFyZ2V0aW5nKGtleSwgb3B0aW9uc1trZXldKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4qIEBkZXNjIENvbmZpZ3VyZXMgdGhlIEdQVCBjb25maWd1cmF0aW9uIG9wdGlvbnMuXG4qIEBwYXJhbSB7ZnVuY3Rpb259IGhhbmRsZVNsb3RSZW5kZXJFbmRlZCAtIENhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgZ2V0cyBmaXJlZCB3aGVuZXZlciBhIEdQVCBhZCBzbG90IGhhcyBmaW5pc2hlZCByZW5kZXJpbmcuXG4qKi9cbmV4cG9ydCBmdW5jdGlvbiBkZnBTZXR0aW5ncyhoYW5kbGVTbG90UmVuZGVyRW5kZWQpIHtcbiAgd2luZG93Lmdvb2dsZXRhZy5wdWJhZHMoKS5kaXNhYmxlSW5pdGlhbExvYWQoKTtcbiAgd2luZG93Lmdvb2dsZXRhZy5wdWJhZHMoKS5lbmFibGVTaW5nbGVSZXF1ZXN0KCk7XG4gIHdpbmRvdy5nb29nbGV0YWcucHViYWRzKCkuZW5hYmxlQXN5bmNSZW5kZXJpbmcoKTtcbiAgd2luZG93Lmdvb2dsZXRhZy5lbmFibGVTZXJ2aWNlcygpO1xuXG4gIGlmIChoYW5kbGVTbG90UmVuZGVyRW5kZWQpIHtcbiAgICB3aW5kb3cuZ29vZ2xldGFnLnB1YmFkcygpLmFkZEV2ZW50TGlzdGVuZXIoJ3Nsb3RSZW5kZXJFbmRlZCcsIGhhbmRsZVNsb3RSZW5kZXJFbmRlZCk7XG4gIH1cbn1cblxuLyoqXG4qIEBkZXNjIERldGVybWluZXMgdGhlIGZ1bGwgc2xvdCBuYW1lIG9mIHRoZSBhZCB1bml0LiBJZiBhIHVzZXIgYXBwZW5kcyBhbiAnYWRzbG90JyBxdWVyeSBwYXJhbWV0ZXIgdG8gdGhlIHBhZ2UgVVJMIHRoZSBzbG90IG5hbWUgd2lsbCBiZSB2ZXJyaWRkZW4uXG4qIEBwYXJhbSB7c3RyaW5nfSBkZnBDb2RlIC0gQSBzdHJpbmcgY29udGFpbmluZyB0aGUgcHVibGlzaGVycyBERlAgaWQgY29kZS5cbiogQHBhcmFtIHtzdHJpbmd9IHNsb3ROYW1lIC0gQSBzdHJpbmcgY29udGFpbmluZyB0aGUgc2xvdCBuYW1lIG9mIHRoZSBhZHZlcnRpc2VtZW50LCBmb3IgZXhhbXBsZSAnaG9tZXBhZ2UnLlxuKiBAcmV0dXJuIC0gUmV0dXJucyBhIHN0cmluZyBjb21iaW5pbmcgdGhlIERGUCBpZCBjb2RlIGFuZCB0aGUgc2xvdCBuYW1lLCBmb3IgZXhhbXBsZSAnMTIzL2hvbWVwYWdlJy5cbioqL1xuZXhwb3J0IGZ1bmN0aW9uIGRldGVybWluZVNsb3ROYW1lKGRmcENvZGUsIHNsb3ROYW1lKSB7XG4gIGNvbnN0IHNsb3RPdmVycmlkZSA9IGV4cGFuZFF1ZXJ5U3RyaW5nKCdhZHNsb3QnKTtcbiAgaWYgKHNsb3RPdmVycmlkZSAmJiAoc2xvdE92ZXJyaWRlICE9PSAnJyB8fCBzbG90T3ZlcnJpZGUgIT09IG51bGwpKSB7XG4gICAgcmV0dXJuIGAke2RmcENvZGV9LyR7c2xvdE92ZXJyaWRlfWA7XG4gIH1cbiAgcmV0dXJuIGAke2RmcENvZGV9LyR7c2xvdE5hbWV9YDtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9zZXJ2aWNlcy9ncHQuanMiLCJ2YXIgZztcclxuXHJcbi8vIFRoaXMgd29ya3MgaW4gbm9uLXN0cmljdCBtb2RlXHJcbmcgPSAoZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIHRoaXM7XHJcbn0pKCk7XHJcblxyXG50cnkge1xyXG5cdC8vIFRoaXMgd29ya3MgaWYgZXZhbCBpcyBhbGxvd2VkIChzZWUgQ1NQKVxyXG5cdGcgPSBnIHx8IEZ1bmN0aW9uKFwicmV0dXJuIHRoaXNcIikoKSB8fCAoMSxldmFsKShcInRoaXNcIik7XHJcbn0gY2F0Y2goZSkge1xyXG5cdC8vIFRoaXMgd29ya3MgaWYgdGhlIHdpbmRvdyByZWZlcmVuY2UgaXMgYXZhaWxhYmxlXHJcblx0aWYodHlwZW9mIHdpbmRvdyA9PT0gXCJvYmplY3RcIilcclxuXHRcdGcgPSB3aW5kb3c7XHJcbn1cclxuXHJcbi8vIGcgY2FuIHN0aWxsIGJlIHVuZGVmaW5lZCwgYnV0IG5vdGhpbmcgdG8gZG8gYWJvdXQgaXQuLi5cclxuLy8gV2UgcmV0dXJuIHVuZGVmaW5lZCwgaW5zdGVhZCBvZiBub3RoaW5nIGhlcmUsIHNvIGl0J3NcclxuLy8gZWFzaWVyIHRvIGhhbmRsZSB0aGlzIGNhc2UuIGlmKCFnbG9iYWwpIHsgLi4ufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBnO1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAod2VicGFjaykvYnVpbGRpbi9nbG9iYWwuanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgYXBwZW5kUmVzb3VyY2UgfSBmcm9tICcuLi91dGlsL3Jlc291cmNlcyc7XG5pbXBvcnQgeyBmZXRjaFByZWJpZEJpZHMsIHF1ZXVlUHJlYmlkQ29tbWFuZCB9IGZyb20gJy4vcHJlYmlkJztcbmltcG9ydCB7IGZldGNoQW1hem9uQmlkcywgcXVldWVBbWF6b25Db21tYW5kIH0gZnJvbSAnLi9hbWF6b24nO1xuaW1wb3J0IHsgcmVmcmVzaFNsb3QgfSBmcm9tICcuL2dwdCc7XG5cbi8qKlxuKiBAZGVzYyBJbml0aWFsaXplcyBhbGwgaGVhZGVyIGJpZGRpbmcgc2VydmljZXMgYW5kIGFwcGVuZHMgdGhlIGFwcGxpY2FibGUgc2NyaXB0cyB0byB0aGUgcGFnZS5cbiogQHBhcmFtIHtvYmplY3R9IG9iaiAtIEFuIG9iamVjdCBjb250YWluaW5nIGFsbCBvZiB0aGUgZnVuY3Rpb24gYXJndW1lbnRzLlxuKiBAcGFyYW0ge29iamVjdH0gb2JqLnByZWJpZCAtIEFuIG9iamVjdCBjb250YWluaW5nIGNvbmZpZ3VyYXRpb24gZGF0YSBmb3IgUHJlYmlkLmpzLlxuKiBAcGFyYW0ge29iamVjdH0gb2JqLmFtYXpvbiAtIEFuIG9iamVjdCBjb250YWluaW5nIGNvbmZpZ3VyYXRpb24gZGF0YSBmb3IgQW1hem9uIEE5IGFuZCBUQU0uXG4qKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0aWFsaXplQmlkZGluZ1NlcnZpY2VzKHtcbiAgcHJlYmlkID0gZmFsc2UsXG4gIGFtYXpvbiA9IGZhbHNlXG59KSB7XG4gIHdpbmRvdy5hcmNCaWRkaW5nUmVhZHkgPSBmYWxzZTtcblxuICBjb25zdCBlbmFibGVQcmViaWQgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIGlmIChwcmViaWQgJiYgcHJlYmlkLmVuYWJsZWQpIHtcbiAgICAgIGNvbnN0IHBianMgPSBwYmpzIHx8IHt9O1xuICAgICAgcGJqcy5xdWUgPSBwYmpzLnF1ZSB8fCBbXTtcblxuICAgICAgcmVzb2x2ZSgnUHJlYmlkIGhhcyBiZWVuIGluaXRpYWxpemVkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc29sdmUoJ1ByZWJpZCBpcyBub3QgZW5hYmxlZCBvbiB0aGUgd3JhcHBlci4uLicpO1xuICAgIH1cbiAgfSk7XG5cbiAgY29uc3QgZW5hYmxlQW1hem9uID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBpZiAoYW1hem9uICYmIGFtYXpvbi5lbmFibGVkKSB7XG4gICAgICBhcHBlbmRSZXNvdXJjZSgnc2NyaXB0JywgJy8vYy5hbWF6b24tYWRzeXN0ZW0uY29tL2FheDIvYXBzdGFnLmpzJywgdHJ1ZSwgdHJ1ZSwgKCkgPT4ge1xuICAgICAgICBpZiAoYW1hem9uLmlkICYmIGFtYXpvbi5pZCAhPT0gJycpIHtcbiAgICAgICAgICBxdWV1ZUFtYXpvbkNvbW1hbmQoKCkgPT4ge1xuICAgICAgICAgICAgLy8gSW5pdGlhbGl6ZXMgdGhlIEFtYXpvbiBBUFMgdGFnIHNjcmlwdC5cbiAgICAgICAgICAgIHdpbmRvdy5hcHN0YWcuaW5pdCh7XG4gICAgICAgICAgICAgIHB1YklEOiBhbWF6b24uaWQsXG4gICAgICAgICAgICAgIGFkU2VydmVyOiAnZ29vZ2xldGFnJ1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJlc29sdmUoJ0FtYXpvbiBzY3JpcHRzIGhhdmUgYmVlbiBhZGRlZCBvbnRvIHRoZSBwYWdlIScpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUud2FybihgQXJjQWRzOiBNaXNzaW5nIEFtYXpvbiBhY2NvdW50IGlkLiBcbiAgICAgICAgICAgIERvY3VtZW50YXRpb246IGh0dHBzOi8vZ2l0aHViLmNvbS93YXBvcGFydG5lcnMvYXJjLWFkcyNhbWF6b24tdGFtYTlgKTtcbiAgICAgICAgICByZXNvbHZlKCdBbWF6b24gaXMgbm90IGVuYWJsZWQgb24gdGhlIHdyYXBwZXIuLi4nKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc29sdmUoJ0FtYXpvbiBpcyBub3QgZW5hYmxlZCBvbiB0aGUgd3JhcHBlci4uLicpO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gV2FpdHMgZm9yIGFsbCBoZWFkZXIgYmlkZGluZyBzZXJ2aWNlcyB0byBiZSBpbml0aWFsaXplZCBiZWZvcmUgdGVsbGluZyB0aGUgc2VydmljZSBpdCdzIHJlYWR5IHRvIHJldHJpZXZlIGJpZHMuXG4gIFByb21pc2UuYWxsKFtlbmFibGVQcmViaWQsIGVuYWJsZUFtYXpvbl0pXG4gICAgLnRoZW4oKCkgPT4ge1xuICAgICAgd2luZG93LmFyY0JpZGRpbmdSZWFkeSA9IHRydWU7XG4gICAgfSk7XG59XG5cbi8qKlxuKiBAZGVzYyBGZXRjaGVzIGEgYmlkIGZvciBhbiBhZHZlcnRpc2VtZW50IGJhc2VkIG9uIHdoaWNoIHNlcnZpY2VzIGFyZSBlbmFibGVkIG9uIHVuaXQgYW5kIHRoZSB3cmFwcGVyLlxuKiBAcGFyYW0ge29iamVjdH0gb2JqIC0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgYWxsIG9mIHRoZSBmdW5jdGlvbiBhcmd1bWVudHMuXG4qIEBwYXJhbSB7T2JqZWN0fSBvYmouYWQgLSBBbiBvYmplY3QgY29udGFpbmluZyB0aGUgR1BUIGFkIHNsb3QuXG4qIEBwYXJhbSB7c3RyaW5nfSBvYmouaWQgLSBBIHN0cmluZyBjb250YWluaW5nIHRoZSBhZHZlcnRpc2VtZW50IGlkIGNvcnJlc3BvbmRpbmcgdG8gdGhlIGRpdiB0aGUgYWR2ZXJ0aXNlbWVudCB3aWxsIGxvYWQgaW50by5cbiogQHBhcmFtIHtzdHJpbmd9IG9iai5zbG90TmFtZSAtIEEgc3RyaW5nIGNvbnRhaW5pbmcgdGhlIHNsb3QgbmFtZSBvZiB0aGUgYWR2ZXJ0aXNlbWVudCwgZm9yIGluc3RhbmNlICcxMjM0L2Fkbi5jb20vaG9tZXBhZ2UnLlxuKiBAcGFyYW0ge0FycmF5fSBvYmouZGltZW5zaW9ucyAtIEFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIG9mIHRoZSBhcHBsaWNhYmxlIHNpemVzIHRoZSBhZHZlcnRpc2VtZW50IGNhbiB1c2UuXG4qIEBwYXJhbSB7T2JqZWN0fSBvYmoud3JhcHBlciAtIEFuIG9iamVjdCBjb250YWluaW5nIGFsbCBvZiB0aGUgd3JhcHBlciBzZXR0aW5ncy5cbiogQHBhcmFtIHtBcnJheX0gb2JqLmJpZGRpbmcgLSBDb250YWlucyBhbGwgb2YgdGhlIGFwcGxpY2FibGUgYmlkIGRhdGEsIHN1Y2ggYXMgd2hpY2ggdmVuZG9ycyB0byB1c2UgYW5kIHRoZWlyIHBsYWNlbWVudCBpZHMuXG4qIEBwYXJhbSB7Ym9vbGVhbn0gb2JqLmNvcnJlbGF0b3IgLSBBbiBvcHRpb25hbCBib29sZWFuIHRoYXQgZGVzY3JpYmVzIGlmIHRoZSBjb3JyZWxhdG9yIHZhbHVlIHNob3VsZCB1cGRhdGUgb3Igbm90LlxuKiBAcGFyYW0ge2Z1bmN0aW9ufSBvYmoucHJlcmVuZGVyIC0gQW4gb3B0aW9uYWwgZnVuY3Rpb24gdGhhdCB3aWxsIHJ1biBiZWZvcmUgdGhlIGFkdmVydGlzZW1lbnQgcmVuZGVycy5cbioqL1xuZXhwb3J0IGZ1bmN0aW9uIGZldGNoQmlkcyh7XG4gIGFkLFxuICBpZCxcbiAgc2xvdE5hbWUsXG4gIGRpbWVuc2lvbnMsXG4gIHdyYXBwZXIsXG4gIGJpZGRpbmcsXG4gIGNvcnJlbGF0b3IgPSBmYWxzZSxcbiAgcHJlcmVuZGVyLFxufSkge1xuICBjb25zdCBhZEluZm8gPSB7XG4gICAgYWRVbml0OiBhZCxcbiAgICBhZFNsb3Q6IHNsb3ROYW1lLFxuICAgIGFkRGltZW5zaW9uczogZGltZW5zaW9ucyxcbiAgICBhZElkOiBpZFxuICB9O1xuXG4gIGNvbnN0IHByZWJpZEJpZHMgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIGlmICh3cmFwcGVyLnByZWJpZCAmJiB3cmFwcGVyLnByZWJpZC5lbmFibGVkKSB7XG4gICAgICBjb25zdCB0aW1lb3V0ID0gd3JhcHBlci5wcmViaWQudGltZW91dCB8fCA3MDA7XG4gICAgICBpZiAod3JhcHBlci5wcmViaWQuc2xvdFN1ZmZpeCkge1xuICAgICAgICBhZEluZm8uYWRTbG90ID0gYCR7c2xvdE5hbWV9JHt3cmFwcGVyLnByZWJpZC5zbG90U3VmZml4fWA7XG4gICAgICB9XG5cbiAgICAgIHF1ZXVlUHJlYmlkQ29tbWFuZC5iaW5kKHRoaXMsIGZldGNoUHJlYmlkQmlkcyhhZCwgaWQsIHRpbWVvdXQsIGFkSW5mbywgcHJlcmVuZGVyLCAoKSA9PiB7XG4gICAgICAgIHJlc29sdmUoJ0ZldGNoZWQgUHJlYmlkIGFkcyEnKTtcbiAgICAgIH0pKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzb2x2ZSgnUHJlYmlkIGlzIG5vdCBlbmFibGVkIG9uIHRoZSB3cmFwcGVyLi4uJyk7XG4gICAgfVxuICB9KTtcblxuICBjb25zdCBhbWF6b25CaWRzID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBpZiAod3JhcHBlci5hbWF6b24gJiYgd3JhcHBlci5hbWF6b24uZW5hYmxlZCkge1xuICAgICAgY29uc3QgdGFyZ2V0ZWRTbG90TmFtZSA9IHdyYXBwZXIuYW1hem9uLnNsb3RTdWZmaXggPyBgJHtzbG90TmFtZX0ke3dyYXBwZXIuYW1hem9uLnNsb3RTdWZmaXh9YCA6IHNsb3ROYW1lO1xuXG4gICAgICBmZXRjaEFtYXpvbkJpZHMoaWQsIHRhcmdldGVkU2xvdE5hbWUsIGRpbWVuc2lvbnMsICgpID0+IHtcbiAgICAgICAgcmVzb2x2ZSgnRmV0Y2hlZCBBbWF6b24gYWRzIScpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc29sdmUoJ0FtYXpvbiBpcyBub3QgZW5hYmxlZCBvbiB0aGUgd3JhcHBlci4uLicpO1xuICAgIH1cbiAgfSk7XG5cbiAgaWYgKHdpbmRvdy5hcmNCaWRkaW5nUmVhZHkpIHtcbiAgICBQcm9taXNlLmFsbChbcHJlYmlkQmlkcywgYW1hem9uQmlkc10pXG4gICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgIHJlZnJlc2hTbG90KHtcbiAgICAgICAgICBhZCxcbiAgICAgICAgICBjb3JyZWxhdG9yLFxuICAgICAgICAgIHByZXJlbmRlcixcbiAgICAgICAgICBpbmZvOiBhZEluZm9cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGZldGNoQmlkcyh7XG4gICAgICAgIGFkLFxuICAgICAgICBpZCxcbiAgICAgICAgc2xvdE5hbWUsXG4gICAgICAgIGRpbWVuc2lvbnMsXG4gICAgICAgIHdyYXBwZXIsXG4gICAgICAgIGJpZGRpbmcsXG4gICAgICAgIGNvcnJlbGF0b3IsXG4gICAgICAgIHByZXJlbmRlclxuICAgICAgfSk7XG4gICAgfSwgMjAwKTtcbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3NlcnZpY2VzL2hlYWRlcmJpZGRpbmcuanMiLCIvKipcbiogQGRlc2MgQXBwZW5kcyBhIHJlbW90ZSByZXNvdXJjZSB0byB0aGUgcGFnZSB3aXRoaW4gYSBIVE1MIHRhZy5cbiogQHBhcmFtIHtzdHJpbmd9IHRhZ25hbWUgLSBBIHN0cmluZyBjb250YWluaW5nIHRoZSB0eXBlIG9mIEhUTUwgdGFnIHRoYXQgc2hvdWxkIGJlIGFwcGVuZGVkLlxuKiBAcGFyYW0ge3N0cmluZ30gdXJsIC0gQSBzdHJpbmcgY29udGFpbmluZyB0aGUgcGF0aCBvZiB0aGUgcmVzb3VyY2UuXG4qIEBwYXJhbSB7Ym9vbGVhbn0gYXN5bmMgLSBBIGJvb2xlYW4gcmVwcmVzZW50aW5nIGlmIHRoZSByZXNvdXJjZSBzaG91bGQgYmUgbG9hZGVkIGFzeW5jaHJvbm91c2x5IG9yIG5vdC5cbiogQHBhcmFtIHtib29sZWFufSBkZWZlciAtIEEgYm9vbGVhbiByZXByZXNlbnRpbmcgaWYgdGhlIHJlc291cmNlIHNob3VsZCBiZSBkZWZlcnJlZCBvciBub3QuXG4qIEBwYXJhbSB7ZnVuY3Rpb259IGNiIC0gQW4gb3B0aW9uYWwgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBzaG91bGQgZmlyZSB3aGVuZXZlciB0aGUgcmVzb3VyY2UgaGFzIGJlZW4gYXBwZW5kZWQuXG4qKi9cbmV4cG9ydCBmdW5jdGlvbiBhcHBlbmRSZXNvdXJjZSh0YWduYW1lLCB1cmwsIGFzeW5jLCBkZWZlciwgY2IpIHtcbiAgY29uc3QgdGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWduYW1lKTtcbiAgaWYgKHRhZ25hbWUgPT09ICdzY3JpcHQnKSB7XG4gICAgdGFnLnNyYyA9IHVybDtcbiAgICB0YWcuYXN5bmMgPSBhc3luYyB8fCBmYWxzZTtcbiAgICB0YWcuZGVmZXIgPSBhc3luYyB8fCBkZWZlciB8fCBmYWxzZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm47XG4gIH1cbiAgKGRvY3VtZW50LmhlYWQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KS5hcHBlbmRDaGlsZCh0YWcpO1xuXG4gIGlmIChjYikge1xuICAgIGNiKCk7XG4gIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy91dGlsL3Jlc291cmNlcy5qcyIsImltcG9ydCB7IHJlZnJlc2hTbG90IH0gZnJvbSAnLi9ncHQnO1xuXG4vKipcbiogQGRlc2MgUXVldWVzIGEgY29tbWFuZCBpbnNpZGUgb2YgUHJlYmlkLmpzXG4qIEBwYXJhbSB7ZnVuY3Rpb259IGZuIC0gQWNjZXB0cyBhIGZ1bmN0aW9uIHRvIHB1c2ggaW50byB0aGUgUHJlYmlkIGNvbW1hbmQgcXVldWUuXG4qKi9cbmV4cG9ydCBmdW5jdGlvbiBxdWV1ZVByZWJpZENvbW1hbmQoZm4pIHtcbiAgcGJqcy5xdWUucHVzaChmbik7XG59XG5cbi8qKlxuKiBAZGVzYyBDYWxscyB0aGUgUHJlYmlkIHJlcXVlc3QgbWV0aG9kIGZvciBmZXRjaGluZyBiaWRzLCBvbmNlIGZldGNoZWQgdGhlIGFkdmVydGlzZW1lbnQgaXMgcmVmcmVzaGVkIHVubGVzcyBhIGNhbGxiYWNrIGlzIGRlZmluZWQuXG4qIEBwYXJhbSB7b2JqZWN0fSBhZCAtIEFuIG9iamVjdCBjb250YWluaW5nIHRoZSBHUFQgYWQgc2xvdC5cbiogQHBhcmFtIHtzdHJpbmd9IGlkIC0gQSBzdHJpbmcgY29udGFpbmluZyB0aGUgYWR2ZXJ0aXNlbWVudCBpZCBjb3JyZXNwb25kaW5nIHRvIHRoZSBkaXYgdGhlIGFkdmVydGlzZW1lbnQgd2lsbCBsb2FkIGludG8uXG4qIEBwYXJhbSB7bnVtYmVyfSB0aW1lb3V0IC0gQW4gaW50ZWdlciBjb21tdW5pY2F0aW5nIGhvdyBsb25nIGluIG1zIHRoZSBQcmViaWQuanMgc2VydmljZSBzaG91bGQgd2FpdCBiZWZvcmUgaXQgY2xvc2VzIHRoZSBhdWN0aW9uIGZvciBhIGxvdC5cbiogQHBhcmFtIHtvYmplY3R9IGluZm8gLSBBbiBvYmplY3QgY29udGFpbmluZyBpbmZvcm1hdGlvbiBhYm91dCB0aGUgYWR2ZXJ0aXNlbWVudCB0aGF0IGlzIGFib3V0IHRvIGxvYWQuXG4qIEBwYXJhbSB7ZnVuY3Rpb259IHByZXJlbmRlciAtIEFuIG9wdGlvbmFsIGZ1bmN0aW9uIHRoYXQgd2lsbCBydW4gYmVmb3JlIHRoZSBhZHZlcnRpc2VtZW50IHJlbmRlcnMuXG4qIEBwYXJhbSB7ZnVuY3Rpb259IGNiIC0gQW4gb3B0aW9uYWwgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBzaG91bGQgZmlyZSB3aGVuZXZlciB0aGUgYmlkZGluZyBoYXMgY29uY2x1ZGVkLlxuKiovXG5leHBvcnQgZnVuY3Rpb24gZmV0Y2hQcmViaWRCaWRzKGFkLCBpZCwgdGltZW91dCwgaW5mbywgcHJlcmVuZGVyLCBjYiA9IG51bGwpIHtcbiAgcGJqcy5yZXF1ZXN0Qmlkcyh7XG4gICAgdGltZW91dCxcbiAgICBhZFVuaXRDb2RlczogW2lkXSxcbiAgICBiaWRzQmFja0hhbmRsZXI6ICgpID0+IHtcbiAgICAgIHBianMuc2V0VGFyZ2V0aW5nRm9yR1BUQXN5bmMoW2lkXSk7XG4gICAgICBpZiAoY2IpIHtcbiAgICAgICAgY2IoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlZnJlc2hTbG90KHsgYWQsIGluZm8sIHByZXJlbmRlciB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufVxuXG4vKipcbiogQGRlc2MgUmVnaXN0ZXJzIGFuIGFkdmVydGlzZW1lbnQgd2l0aCBQcmViaWQuanMgc28gaXQncyBwcmVwYXJlZCB0byBmZXRjaCBiaWRzIGZvciBpdC5cbiogQHBhcmFtIHtzdHJpbmd9IGNvZGUgLSBDb250YWlucyB0aGUgZGl2IGlkIHVzZWQgZm9yIHRoZSBhZHZlcnRpc2VtZW50XG4qIEBwYXJhbSB7YXJyYXl9IHNpemVzIC0gQW4gYXJyYXkgb2YgYXBwbGljYWJsZSBhZCBzaXplcyB0aGF0IGFyZSBhdmFpbGFibGUgZm9yIGJpZGRpbmcuXG4qIEBwYXJhbSB7b2JqZWN0fSBiaWRzIC0gQ29udGFpbnMgYWxsIG9mIHRoZSBhcHBsaWNhYmxlIGJpZCBkYXRhLCBzdWNoIGFzIHdoaWNoIHZlbmRvcnMgdG8gdXNlIGFuZCB0aGVpciBwbGFjZW1lbnQgaWRzLlxuKiBAcGFyYW0ge29iamVjdH0gd3JhcHBlciAtIEFuIG9iamVjdCBjb250YWluaW5nIGFsbCBlbmFibGVkIHNlcnZpY2VzIG9uIHRoZSBBcmMgQWRzLlxuKiovXG5leHBvcnQgZnVuY3Rpb24gYWRkVW5pdChjb2RlLCBzaXplcywgYmlkcywgd3JhcHBlciA9IHt9KSB7XG4gIC8vIEZvcm1hdHMgdGhlIGFkZCB1bml0IGZvciBwcmViaWQuLlxuICBjb25zdCBzbG90ID0geyBjb2RlLCBzaXplcywgYmlkcyB9O1xuICBjb25zdCB7IHNpemVDb25maWcgfSA9IHdyYXBwZXI7XG5cbiAgcGJqcy5hZGRBZFVuaXRzKHNsb3QpO1xuXG4gIGlmIChzaXplQ29uZmlnKSB7XG4gICAgcGJqcy5zZXRDb25maWcoeyBzaXplQ29uZmlnOiBbc2l6ZUNvbmZpZ10gfSk7XG4gIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9zZXJ2aWNlcy9wcmViaWQuanMiLCJpbXBvcnQgJy4vdXRpbC9wb2x5ZmlsbHMnO1xuaW1wb3J0IHsgTW9iaWxlRGV0ZWN0aW9uIH0gZnJvbSAnLi91dGlsL21vYmlsZSc7XG5pbXBvcnQgeyByZW5hbWVQb3NpdGlvbktleSB9IGZyb20gJy4vdXRpbC9jdXN0b21UYXJnZXRpbmcnO1xuaW1wb3J0IHsgZmV0Y2hCaWRzLCBpbml0aWFsaXplQmlkZGluZ1NlcnZpY2VzIH0gZnJvbSAnLi9zZXJ2aWNlcy9oZWFkZXJiaWRkaW5nJztcbmltcG9ydCB7IGluaXRpYWxpemVHUFQsIHF1ZXVlR29vZ2xldGFnQ29tbWFuZCwgcmVmcmVzaFNsb3QsIGRmcFNldHRpbmdzLCBzZXRUYXJnZXRpbmcsIGRldGVybWluZVNsb3ROYW1lIH0gZnJvbSAnLi9zZXJ2aWNlcy9ncHQnO1xuaW1wb3J0IHsgcXVldWVQcmViaWRDb21tYW5kLCBhZGRVbml0IH0gZnJvbSAnLi9zZXJ2aWNlcy9wcmViaWQnO1xuaW1wb3J0IHsgcHJlcGFyZVNpemVNYXBzLCBzZXRSZXNpemVMaXN0ZW5lciB9IGZyb20gJy4vc2VydmljZXMvc2l6ZW1hcHBpbmcnO1xuXG4vKiogQGRlc2MgRGlzcGxheXMgYW4gYWR2ZXJ0aXNlbWVudCBmcm9tIEdvb2dsZSBERlAgd2l0aCBvcHRpb25hbCBzdXBwb3J0IGZvciBQcmViaWQuanMgYW5kIEFtYXpvbiBUQU0vQTkuICoqL1xuZXhwb3J0IGNsYXNzIEFyY0FkcyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMsIGhhbmRsZVNsb3RSZW5kZXJlZCA9IG51bGwpIHtcbiAgICB0aGlzLmRmcElkID0gb3B0aW9ucy5kZnAuaWQgfHwgJyc7XG4gICAgdGhpcy53cmFwcGVyID0gb3B0aW9ucy5iaWRkaW5nIHx8IHt9O1xuICAgIHRoaXMucG9zaXRpb25zID0gW107XG5cbiAgICB3aW5kb3cuaXNNb2JpbGUgPSBNb2JpbGVEZXRlY3Rpb247XG5cbiAgICBpZiAodGhpcy5kZnBJZCA9PT0gJycpIHtcbiAgICAgIGNvbnNvbGUud2FybihgQXJjQWRzOiBERlAgaWQgaXMgbWlzc2luZyBmcm9tIHRoZSBhcmNhZHMgaW5pdGlhbGl6YXRpb24gc2NyaXB0LlxuICAgICAgICBEb2N1bWVudGF0aW9uOiBodHRwczovL2dpdGh1Yi5jb20vd2Fwb3BhcnRuZXJzL2FyYy1hZHMjZ2V0dGluZy1zdGFydGVkYCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGluaXRpYWxpemVHUFQoKTtcbiAgICAgIHF1ZXVlR29vZ2xldGFnQ29tbWFuZChkZnBTZXR0aW5ncy5iaW5kKHRoaXMsIGhhbmRsZVNsb3RSZW5kZXJlZCkpO1xuICAgICAgaW5pdGlhbGl6ZUJpZGRpbmdTZXJ2aWNlcyh0aGlzLndyYXBwZXIpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAqIEBkZXNjIFJlZ2lzdGVycyBhbiBhZHZlcnRpc2VtZW50IGluIHRoZSBzZXJ2aWNlLlxuICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJhbXMgLSBBbiBvYmplY3QgY29udGFpbmluZyBhbGwgb2YgdGhlIGFkdmVydGlzZW1lbnQgY29uZmlndXJhdGlvbiBzZXR0aW5ncyBzdWNoIGFzIHNsb3QgbmFtZSwgaWQsIGFuZCBwb3NpdGlvbi5cbiAgKiovXG4gIHJlZ2lzdGVyQWQocGFyYW1zKSB7XG4gICAgY29uc3QgeyBpZCwgZGltZW5zaW9ucywgYWRUeXBlID0gZmFsc2UsIHRhcmdldGluZyA9IHt9LCBkaXNwbGF5ID0gJ2FsbCcsIGJpZGRpbmcgPSBmYWxzZSB9ID0gcGFyYW1zO1xuXG4gICAgLyogSWYgcG9zaXRpb25hbCB0YXJnZXRpbmcgZG9lc24ndCBleGlzdCBpdCBnZXRzIGFzc2lnbmVkIGEgbnVtZXJpYyB2YWx1ZVxuICAgICAgYmFzZWQgb24gdGhlIG9yZGVyIGFuZCB0eXBlIG9mIHRoZSBhZHZlcnRpc2VtZW50LiBUaGlzIGxvZ2ljIGlzIHNraXBwZWQgaWYgYWRUeXBlIGlzIG5vdCBkZWZpbmVkLiAqL1xuXG4gICAgaWYgKCghdGFyZ2V0aW5nLmhhc093blByb3BlcnR5KCdwb3NpdGlvbicpIHx8IHR5cGVvZiB0YXJnZXRpbmcucG9zaXRpb24gPT09ICdvYmplY3QnKSAmJiBhZFR5cGUgIT09IGZhbHNlKSB7XG4gICAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMucG9zaXRpb25zW2FkVHlwZV0gKyAxIHx8IDE7XG4gICAgICB0aGlzLnBvc2l0aW9uc1thZFR5cGVdID0gcG9zaXRpb247XG5cbiAgICAgIGlmICh0eXBlb2YgdGFyZ2V0aW5nLnBvc2l0aW9uID09PSAnb2JqZWN0JyAmJiB0YXJnZXRpbmcucG9zaXRpb24uYXMpIHtcbiAgICAgICAgT2JqZWN0LmFzc2lnbihwb3NpdGlvbiwgcmVuYW1lUG9zaXRpb25LZXkodGFyZ2V0aW5nLCBwb3NpdGlvbikpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgcG9zaXRpb25QYXJhbSA9IE9iamVjdC5hc3NpZ24odGFyZ2V0aW5nLCB7IHBvc2l0aW9uIH0pO1xuICAgICAgICBPYmplY3QuYXNzaWduKHBhcmFtcywgeyB0YXJnZXRpbmc6IHBvc2l0aW9uUGFyYW0gfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKChpc01vYmlsZS5hbnkoKSAmJiBkaXNwbGF5ID09PSAnbW9iaWxlJykgfHwgKCFpc01vYmlsZS5hbnkoKSAmJiBkaXNwbGF5ID09PSAnZGVza3RvcCcpIHx8IChkaXNwbGF5ID09PSAnYWxsJykpIHtcbiAgICAgIC8vIFJlZ2lzdGVycyB0aGUgYWR2ZXJ0aXNlbWVudCB3aXRoIFByZWJpZC5qcyBpZiBlbmFibGVkIG9uIGJvdGggdGhlIHVuaXQgYW5kIHdyYXBwZXIuXG4gICAgICBpZiAoKGJpZGRpbmcucHJlYmlkICYmIGJpZGRpbmcucHJlYmlkLmJpZHMpICYmICh0aGlzLndyYXBwZXIucHJlYmlkICYmIHRoaXMud3JhcHBlci5wcmViaWQuZW5hYmxlZCkgJiYgZGltZW5zaW9ucykge1xuICAgICAgICBxdWV1ZVByZWJpZENvbW1hbmQuYmluZCh0aGlzLCBhZGRVbml0KGlkLCBkaW1lbnNpb25zLCBiaWRkaW5nLnByZWJpZC5iaWRzLCB0aGlzLndyYXBwZXIucHJlYmlkKSk7XG4gICAgICB9XG5cbiAgICAgIHF1ZXVlR29vZ2xldGFnQ29tbWFuZCh0aGlzLmRpc3BsYXlBZC5iaW5kKHRoaXMsIHBhcmFtcykpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAqIEBkZXNjIFJlZ2lzdGVycyBhIGNvbGxlY3Rpb24gb2YgYWR2ZXJ0aXNlbWVudHMuXG4gICogQHBhcmFtIHthcnJheX0gY29sbGVjdGlvbiAtIEFuIGFycmF5IGNvbnRhaW5pbmcgYSBsaXN0IG9mIG9iamVjdHMgY29udGFpbmluZyBhZHZlcnRpc2VtZW50IGRhdGEuXG4gICoqL1xuICByZWdpc3RlckFkQ29sbGVjdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgY29sbGVjdGlvbi5mb3JFYWNoKChhZHZlcnQpID0+IHtcbiAgICAgIHRoaXMucmVnaXN0ZXJBZChhZHZlcnQpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICogQGRlc2MgRGlzcGxheXMgYW4gYWR2ZXJ0aXNlbWVudCBhbmQgc2V0cyB1cCBhbnkgbmVjY2Vyc2FyeSBldmVudCBiaW5kaW5nLlxuICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJhbXMgLSBBbiBvYmplY3QgY29udGFpbmluZyBhbGwgb2YgdGhlIGZ1bmN0aW9uIGFyZ3VtZW50cy5cbiAgKiBAcGFyYW0ge3N0cmluZ30gcGFyYW1zLmlkIC0gQSBzdHJpbmcgY29udGFpbmluZyB0aGUgYWR2ZXJ0aXNlbWVudCBpZCBjb3JyZXNwb25kaW5nIHRvIHRoZSBkaXYgdGhlIGFkdmVydGlzZW1lbnQgd2lsbCBsb2FkIGludG8uXG4gICogQHBhcmFtIHtzdHJpbmd9IHBhcmFtcy5zbG90TmFtZSAtIEEgc3RyaW5nIGNvbnRhaW5pbmcgdGhlIHNsb3QgbmFtZSBvZiB0aGUgYWR2ZXJ0aXNlbWVudCwgZm9yIGluc3RhbmNlICcxMjM0L25ld3MvaG9tZXBhZ2UnLlxuICAqIEBwYXJhbSB7YXJyYXl9IHBhcmFtcy5kaW1lbnNpb25zIC0gQW4gYXJyYXkgY29udGFpbmluZyBhbGwgb2YgdGhlIGFwcGxpY2FibGUgc2l6ZXMgdGhlIGFkdmVydGlzZW1lbnQgY2FuIHVzZS5cbiAgKiBAcGFyYW0ge29iamVjdH0gcGFyYW1zLnRhcmdldGluZyAtIEFuIG9iamVjdCBjb250YWluaW5nIGFsbCBvZiB0aGUgYWR2ZXJ0aXNlbWVudHMgdGFyZ2V0aW5nIGRhdGEuXG4gICogQHBhcmFtIHthcnJheX0gcGFyYW1zLnNpemVtYXAgLSBBbiBhcnJheSBjb250YWluaW5nIG9wdGlvbmFsIHNpemUgbWFwcGluZyBpbmZvcm1hdGlvbi5cbiAgKiBAcGFyYW0ge29iamVjdH0gcGFyYW1zLmJpZGRpbmcgLSBDb250YWlucyBhbGwgb2YgdGhlIGFwcGxpY2FibGUgYmlkIGRhdGEsIHN1Y2ggYXMgd2hpY2ggdmVuZG9ycyB0byB1c2UgYW5kIHRoZWlyIHBsYWNlbWVudCBpZHMuXG4gICogQHBhcmFtIHtmdW5jdGlvbn0gcGFyYW1zLnByZXJlbmRlciAtIEFuIG9wdGlvbmFsIGZ1bmN0aW9uIHRoYXQgd2lsbCBydW4gYmVmb3JlIHRoZSBhZHZlcnRpc2VtZW50IHJlbmRlcnMuXG4gICoqL1xuICBkaXNwbGF5QWQoe1xuICAgIGlkLFxuICAgIHNsb3ROYW1lLFxuICAgIGRpbWVuc2lvbnMsXG4gICAgdGFyZ2V0aW5nLFxuICAgIHNpemVtYXAgPSBmYWxzZSxcbiAgICBiaWRkaW5nID0gZmFsc2UsXG4gICAgcHJlcmVuZGVyID0gbnVsbFxuICB9KSB7XG4gICAgY29uc3QgZnVsbFNsb3ROYW1lID0gZGV0ZXJtaW5lU2xvdE5hbWUodGhpcy5kZnBJZCwgc2xvdE5hbWUpO1xuICAgIGNvbnN0IHBhcnNlZERpbWVuc2lvbnMgPSAhZGltZW5zaW9ucy5sZW5ndGggPyBudWxsIDogSlNPTi5wYXJzZShkaW1lbnNpb25zKTtcbiAgICBjb25zdCBhZCA9ICFkaW1lbnNpb25zID8gd2luZG93Lmdvb2dsZXRhZy5kZWZpbmVPdXRPZlBhZ2VTbG90KGZ1bGxTbG90TmFtZSwgaWQpXG4gICAgICA6IHdpbmRvdy5nb29nbGV0YWcuZGVmaW5lU2xvdChmdWxsU2xvdE5hbWUsIHBhcnNlZERpbWVuc2lvbnMsIGlkKTtcblxuICAgIGlmIChzaXplbWFwICYmIHNpemVtYXAuYnJlYWtwb2ludHMgJiYgZGltZW5zaW9ucykge1xuICAgICAgY29uc3QgeyBtYXBwaW5nLCBicmVha3BvaW50cywgY29ycmVsYXRvcnMgfSA9IHByZXBhcmVTaXplTWFwcyhwYXJzZWREaW1lbnNpb25zLCBzaXplbWFwLmJyZWFrcG9pbnRzKTtcblxuICAgICAgYWQuZGVmaW5lU2l6ZU1hcHBpbmcobWFwcGluZyk7XG5cbiAgICAgIGlmIChzaXplbWFwLnJlZnJlc2gpIHtcbiAgICAgICAgc2V0UmVzaXplTGlzdGVuZXIoe1xuICAgICAgICAgIGFkLFxuICAgICAgICAgIHNsb3ROYW1lOiBmdWxsU2xvdE5hbWUsXG4gICAgICAgICAgYnJlYWtwb2ludHMsXG4gICAgICAgICAgaWQsXG4gICAgICAgICAgbWFwcGluZyxcbiAgICAgICAgICBjb3JyZWxhdG9ycyxcbiAgICAgICAgICBiaWRkaW5nLFxuICAgICAgICAgIHdyYXBwZXI6IHRoaXMud3JhcHBlcixcbiAgICAgICAgICBwcmVyZW5kZXJcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgYWQuYWRkU2VydmljZSh3aW5kb3cuZ29vZ2xldGFnLnB1YmFkcygpKTtcblxuICAgIHNldFRhcmdldGluZyhhZCwgdGFyZ2V0aW5nKTtcblxuICAgIGlmIChiaWRkaW5nICYmIGRpbWVuc2lvbnMpIHtcbiAgICAgIGZldGNoQmlkcyh7XG4gICAgICAgIGFkLFxuICAgICAgICBpZCxcbiAgICAgICAgc2xvdE5hbWU6IGZ1bGxTbG90TmFtZSxcbiAgICAgICAgZGltZW5zaW9uczogcGFyc2VkRGltZW5zaW9ucyxcbiAgICAgICAgd3JhcHBlcjogdGhpcy53cmFwcGVyLFxuICAgICAgICBwcmVyZW5kZXIsXG4gICAgICAgIGJpZGRpbmdcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZWZyZXNoU2xvdCh7XG4gICAgICAgIGFkLFxuICAgICAgICBwcmVyZW5kZXIsXG4gICAgICAgIGluZm86IHtcbiAgICAgICAgICBhZFVuaXQ6IGFkLFxuICAgICAgICAgIGFkU2xvdDogZnVsbFNsb3ROYW1lLFxuICAgICAgICAgIGFkRGltZW5zaW9uczogcGFyc2VkRGltZW5zaW9ucyxcbiAgICAgICAgICBhZElkOiBpZFxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9pbmRleC5qcyIsImltcG9ydCBQcm9taXNlIGZyb20gJ3Byb21pc2UtcG9seWZpbGwnO1xuXG5pZiAoIXdpbmRvdy5Qcm9taXNlKSB7XG4gIHdpbmRvdy5Qcm9taXNlID0gUHJvbWlzZTtcbn1cblxuLyogZXNsaW50LWRpc2FibGUgKi9cblxuLy8gc291cmNlOiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9PYmplY3QvYXNzaWduI1BvbHlmaWxsXG4vKiBPYmplY3QuYXNzaWduKCkgZm9yIElFMTEgKG9idmlvdXNseSkgKi9cbmlmICh0eXBlb2YgT2JqZWN0LmFzc2lnbiAhPSAnZnVuY3Rpb24nKSB7XG4gIC8vIE11c3QgYmUgd3JpdGFibGU6IHRydWUsIGVudW1lcmFibGU6IGZhbHNlLCBjb25maWd1cmFibGU6IHRydWVcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE9iamVjdCwgXCJhc3NpZ25cIiwge1xuICAgIHZhbHVlOiBmdW5jdGlvbiBhc3NpZ24odGFyZ2V0LCB2YXJBcmdzKSB7IC8vIC5sZW5ndGggb2YgZnVuY3Rpb24gaXMgMlxuICAgICAgJ3VzZSBzdHJpY3QnO1xuICAgICAgaWYgKHRhcmdldCA9PSBudWxsKSB7IC8vIFR5cGVFcnJvciBpZiB1bmRlZmluZWQgb3IgbnVsbFxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdDYW5ub3QgY29udmVydCB1bmRlZmluZWQgb3IgbnVsbCB0byBvYmplY3QnKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHRvID0gT2JqZWN0KHRhcmdldCk7XG5cbiAgICAgIGZvciAodmFyIGluZGV4ID0gMTsgaW5kZXggPCBhcmd1bWVudHMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgIHZhciBuZXh0U291cmNlID0gYXJndW1lbnRzW2luZGV4XTtcblxuICAgICAgICBpZiAobmV4dFNvdXJjZSAhPSBudWxsKSB7IC8vIFNraXAgb3ZlciBpZiB1bmRlZmluZWQgb3IgbnVsbFxuICAgICAgICAgIGZvciAodmFyIG5leHRLZXkgaW4gbmV4dFNvdXJjZSkge1xuICAgICAgICAgICAgLy8gQXZvaWQgYnVncyB3aGVuIGhhc093blByb3BlcnR5IGlzIHNoYWRvd2VkXG4gICAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG5leHRTb3VyY2UsIG5leHRLZXkpKSB7XG4gICAgICAgICAgICAgIHRvW25leHRLZXldID0gbmV4dFNvdXJjZVtuZXh0S2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0bztcbiAgICB9LFxuICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbn1cblxuLyogZXNsaW50LWVuYWJsZSAqL1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3V0aWwvcG9seWZpbGxzLmpzIiwiaW1wb3J0IHByb21pc2VGaW5hbGx5IGZyb20gJy4vZmluYWxseSc7XG5cbi8vIFN0b3JlIHNldFRpbWVvdXQgcmVmZXJlbmNlIHNvIHByb21pc2UtcG9seWZpbGwgd2lsbCBiZSB1bmFmZmVjdGVkIGJ5XG4vLyBvdGhlciBjb2RlIG1vZGlmeWluZyBzZXRUaW1lb3V0IChsaWtlIHNpbm9uLnVzZUZha2VUaW1lcnMoKSlcbnZhciBzZXRUaW1lb3V0RnVuYyA9IHNldFRpbWVvdXQ7XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG4vLyBQb2x5ZmlsbCBmb3IgRnVuY3Rpb24ucHJvdG90eXBlLmJpbmRcbmZ1bmN0aW9uIGJpbmQoZm4sIHRoaXNBcmcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIGZuLmFwcGx5KHRoaXNBcmcsIGFyZ3VtZW50cyk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIFByb21pc2UoZm4pIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFByb21pc2UpKVxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Byb21pc2VzIG11c3QgYmUgY29uc3RydWN0ZWQgdmlhIG5ldycpO1xuICBpZiAodHlwZW9mIGZuICE9PSAnZnVuY3Rpb24nKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdub3QgYSBmdW5jdGlvbicpO1xuICB0aGlzLl9zdGF0ZSA9IDA7XG4gIHRoaXMuX2hhbmRsZWQgPSBmYWxzZTtcbiAgdGhpcy5fdmFsdWUgPSB1bmRlZmluZWQ7XG4gIHRoaXMuX2RlZmVycmVkcyA9IFtdO1xuXG4gIGRvUmVzb2x2ZShmbiwgdGhpcyk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZShzZWxmLCBkZWZlcnJlZCkge1xuICB3aGlsZSAoc2VsZi5fc3RhdGUgPT09IDMpIHtcbiAgICBzZWxmID0gc2VsZi5fdmFsdWU7XG4gIH1cbiAgaWYgKHNlbGYuX3N0YXRlID09PSAwKSB7XG4gICAgc2VsZi5fZGVmZXJyZWRzLnB1c2goZGVmZXJyZWQpO1xuICAgIHJldHVybjtcbiAgfVxuICBzZWxmLl9oYW5kbGVkID0gdHJ1ZTtcbiAgUHJvbWlzZS5faW1tZWRpYXRlRm4oZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNiID0gc2VsZi5fc3RhdGUgPT09IDEgPyBkZWZlcnJlZC5vbkZ1bGZpbGxlZCA6IGRlZmVycmVkLm9uUmVqZWN0ZWQ7XG4gICAgaWYgKGNiID09PSBudWxsKSB7XG4gICAgICAoc2VsZi5fc3RhdGUgPT09IDEgPyByZXNvbHZlIDogcmVqZWN0KShkZWZlcnJlZC5wcm9taXNlLCBzZWxmLl92YWx1ZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciByZXQ7XG4gICAgdHJ5IHtcbiAgICAgIHJldCA9IGNiKHNlbGYuX3ZhbHVlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZWplY3QoZGVmZXJyZWQucHJvbWlzZSwgZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJlc29sdmUoZGVmZXJyZWQucHJvbWlzZSwgcmV0KTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHJlc29sdmUoc2VsZiwgbmV3VmFsdWUpIHtcbiAgdHJ5IHtcbiAgICAvLyBQcm9taXNlIFJlc29sdXRpb24gUHJvY2VkdXJlOiBodHRwczovL2dpdGh1Yi5jb20vcHJvbWlzZXMtYXBsdXMvcHJvbWlzZXMtc3BlYyN0aGUtcHJvbWlzZS1yZXNvbHV0aW9uLXByb2NlZHVyZVxuICAgIGlmIChuZXdWYWx1ZSA9PT0gc2VsZilcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0EgcHJvbWlzZSBjYW5ub3QgYmUgcmVzb2x2ZWQgd2l0aCBpdHNlbGYuJyk7XG4gICAgaWYgKFxuICAgICAgbmV3VmFsdWUgJiZcbiAgICAgICh0eXBlb2YgbmV3VmFsdWUgPT09ICdvYmplY3QnIHx8IHR5cGVvZiBuZXdWYWx1ZSA9PT0gJ2Z1bmN0aW9uJylcbiAgICApIHtcbiAgICAgIHZhciB0aGVuID0gbmV3VmFsdWUudGhlbjtcbiAgICAgIGlmIChuZXdWYWx1ZSBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgc2VsZi5fc3RhdGUgPSAzO1xuICAgICAgICBzZWxmLl92YWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgICBmaW5hbGUoc2VsZik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoZW4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgZG9SZXNvbHZlKGJpbmQodGhlbiwgbmV3VmFsdWUpLCBzZWxmKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgICBzZWxmLl9zdGF0ZSA9IDE7XG4gICAgc2VsZi5fdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICBmaW5hbGUoc2VsZik7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZWplY3Qoc2VsZiwgZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVqZWN0KHNlbGYsIG5ld1ZhbHVlKSB7XG4gIHNlbGYuX3N0YXRlID0gMjtcbiAgc2VsZi5fdmFsdWUgPSBuZXdWYWx1ZTtcbiAgZmluYWxlKHNlbGYpO1xufVxuXG5mdW5jdGlvbiBmaW5hbGUoc2VsZikge1xuICBpZiAoc2VsZi5fc3RhdGUgPT09IDIgJiYgc2VsZi5fZGVmZXJyZWRzLmxlbmd0aCA9PT0gMCkge1xuICAgIFByb21pc2UuX2ltbWVkaWF0ZUZuKGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCFzZWxmLl9oYW5kbGVkKSB7XG4gICAgICAgIFByb21pc2UuX3VuaGFuZGxlZFJlamVjdGlvbkZuKHNlbGYuX3ZhbHVlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBzZWxmLl9kZWZlcnJlZHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBoYW5kbGUoc2VsZiwgc2VsZi5fZGVmZXJyZWRzW2ldKTtcbiAgfVxuICBzZWxmLl9kZWZlcnJlZHMgPSBudWxsO1xufVxuXG5mdW5jdGlvbiBIYW5kbGVyKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkLCBwcm9taXNlKSB7XG4gIHRoaXMub25GdWxmaWxsZWQgPSB0eXBlb2Ygb25GdWxmaWxsZWQgPT09ICdmdW5jdGlvbicgPyBvbkZ1bGZpbGxlZCA6IG51bGw7XG4gIHRoaXMub25SZWplY3RlZCA9IHR5cGVvZiBvblJlamVjdGVkID09PSAnZnVuY3Rpb24nID8gb25SZWplY3RlZCA6IG51bGw7XG4gIHRoaXMucHJvbWlzZSA9IHByb21pc2U7XG59XG5cbi8qKlxuICogVGFrZSBhIHBvdGVudGlhbGx5IG1pc2JlaGF2aW5nIHJlc29sdmVyIGZ1bmN0aW9uIGFuZCBtYWtlIHN1cmVcbiAqIG9uRnVsZmlsbGVkIGFuZCBvblJlamVjdGVkIGFyZSBvbmx5IGNhbGxlZCBvbmNlLlxuICpcbiAqIE1ha2VzIG5vIGd1YXJhbnRlZXMgYWJvdXQgYXN5bmNocm9ueS5cbiAqL1xuZnVuY3Rpb24gZG9SZXNvbHZlKGZuLCBzZWxmKSB7XG4gIHZhciBkb25lID0gZmFsc2U7XG4gIHRyeSB7XG4gICAgZm4oXG4gICAgICBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICBpZiAoZG9uZSkgcmV0dXJuO1xuICAgICAgICBkb25lID0gdHJ1ZTtcbiAgICAgICAgcmVzb2x2ZShzZWxmLCB2YWx1ZSk7XG4gICAgICB9LFxuICAgICAgZnVuY3Rpb24ocmVhc29uKSB7XG4gICAgICAgIGlmIChkb25lKSByZXR1cm47XG4gICAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgICByZWplY3Qoc2VsZiwgcmVhc29uKTtcbiAgICAgIH1cbiAgICApO1xuICB9IGNhdGNoIChleCkge1xuICAgIGlmIChkb25lKSByZXR1cm47XG4gICAgZG9uZSA9IHRydWU7XG4gICAgcmVqZWN0KHNlbGYsIGV4KTtcbiAgfVxufVxuXG5Qcm9taXNlLnByb3RvdHlwZVsnY2F0Y2gnXSA9IGZ1bmN0aW9uKG9uUmVqZWN0ZWQpIHtcbiAgcmV0dXJuIHRoaXMudGhlbihudWxsLCBvblJlamVjdGVkKTtcbn07XG5cblByb21pc2UucHJvdG90eXBlLnRoZW4gPSBmdW5jdGlvbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCkge1xuICB2YXIgcHJvbSA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKG5vb3ApO1xuXG4gIGhhbmRsZSh0aGlzLCBuZXcgSGFuZGxlcihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCwgcHJvbSkpO1xuICByZXR1cm4gcHJvbTtcbn07XG5cblByb21pc2UucHJvdG90eXBlWydmaW5hbGx5J10gPSBwcm9taXNlRmluYWxseTtcblxuUHJvbWlzZS5hbGwgPSBmdW5jdGlvbihhcnIpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgIGlmICghYXJyIHx8IHR5cGVvZiBhcnIubGVuZ3RoID09PSAndW5kZWZpbmVkJylcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Byb21pc2UuYWxsIGFjY2VwdHMgYW4gYXJyYXknKTtcbiAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFycik7XG4gICAgaWYgKGFyZ3MubGVuZ3RoID09PSAwKSByZXR1cm4gcmVzb2x2ZShbXSk7XG4gICAgdmFyIHJlbWFpbmluZyA9IGFyZ3MubGVuZ3RoO1xuXG4gICAgZnVuY3Rpb24gcmVzKGksIHZhbCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKHZhbCAmJiAodHlwZW9mIHZhbCA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIHZhbCA9PT0gJ2Z1bmN0aW9uJykpIHtcbiAgICAgICAgICB2YXIgdGhlbiA9IHZhbC50aGVuO1xuICAgICAgICAgIGlmICh0eXBlb2YgdGhlbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhlbi5jYWxsKFxuICAgICAgICAgICAgICB2YWwsXG4gICAgICAgICAgICAgIGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgICAgICAgIHJlcyhpLCB2YWwpO1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICByZWplY3RcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGFyZ3NbaV0gPSB2YWw7XG4gICAgICAgIGlmICgtLXJlbWFpbmluZyA9PT0gMCkge1xuICAgICAgICAgIHJlc29sdmUoYXJncyk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgIHJlamVjdChleCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICByZXMoaSwgYXJnc1tpXSk7XG4gICAgfVxuICB9KTtcbn07XG5cblByb21pc2UucmVzb2x2ZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlLmNvbnN0cnVjdG9yID09PSBQcm9taXNlKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcbiAgICByZXNvbHZlKHZhbHVlKTtcbiAgfSk7XG59O1xuXG5Qcm9taXNlLnJlamVjdCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICByZWplY3QodmFsdWUpO1xuICB9KTtcbn07XG5cblByb21pc2UucmFjZSA9IGZ1bmN0aW9uKHZhbHVlcykge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHZhbHVlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgdmFsdWVzW2ldLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcbiAgICB9XG4gIH0pO1xufTtcblxuLy8gVXNlIHBvbHlmaWxsIGZvciBzZXRJbW1lZGlhdGUgZm9yIHBlcmZvcm1hbmNlIGdhaW5zXG5Qcm9taXNlLl9pbW1lZGlhdGVGbiA9XG4gICh0eXBlb2Ygc2V0SW1tZWRpYXRlID09PSAnZnVuY3Rpb24nICYmXG4gICAgZnVuY3Rpb24oZm4pIHtcbiAgICAgIHNldEltbWVkaWF0ZShmbik7XG4gICAgfSkgfHxcbiAgZnVuY3Rpb24oZm4pIHtcbiAgICBzZXRUaW1lb3V0RnVuYyhmbiwgMCk7XG4gIH07XG5cblByb21pc2UuX3VuaGFuZGxlZFJlamVjdGlvbkZuID0gZnVuY3Rpb24gX3VuaGFuZGxlZFJlamVjdGlvbkZuKGVycikge1xuICBpZiAodHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnICYmIGNvbnNvbGUpIHtcbiAgICBjb25zb2xlLndhcm4oJ1Bvc3NpYmxlIFVuaGFuZGxlZCBQcm9taXNlIFJlamVjdGlvbjonLCBlcnIpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGVcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgUHJvbWlzZTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3Byb21pc2UtcG9seWZpbGwvc3JjL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSA3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBzY29wZSA9ICh0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiICYmIGdsb2JhbCkgfHxcbiAgICAgICAgICAgICh0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiAmJiBzZWxmKSB8fFxuICAgICAgICAgICAgd2luZG93O1xudmFyIGFwcGx5ID0gRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5O1xuXG4vLyBET00gQVBJcywgZm9yIGNvbXBsZXRlbmVzc1xuXG5leHBvcnRzLnNldFRpbWVvdXQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBUaW1lb3V0KGFwcGx5LmNhbGwoc2V0VGltZW91dCwgc2NvcGUsIGFyZ3VtZW50cyksIGNsZWFyVGltZW91dCk7XG59O1xuZXhwb3J0cy5zZXRJbnRlcnZhbCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IFRpbWVvdXQoYXBwbHkuY2FsbChzZXRJbnRlcnZhbCwgc2NvcGUsIGFyZ3VtZW50cyksIGNsZWFySW50ZXJ2YWwpO1xufTtcbmV4cG9ydHMuY2xlYXJUaW1lb3V0ID1cbmV4cG9ydHMuY2xlYXJJbnRlcnZhbCA9IGZ1bmN0aW9uKHRpbWVvdXQpIHtcbiAgaWYgKHRpbWVvdXQpIHtcbiAgICB0aW1lb3V0LmNsb3NlKCk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIFRpbWVvdXQoaWQsIGNsZWFyRm4pIHtcbiAgdGhpcy5faWQgPSBpZDtcbiAgdGhpcy5fY2xlYXJGbiA9IGNsZWFyRm47XG59XG5UaW1lb3V0LnByb3RvdHlwZS51bnJlZiA9IFRpbWVvdXQucHJvdG90eXBlLnJlZiA9IGZ1bmN0aW9uKCkge307XG5UaW1lb3V0LnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLl9jbGVhckZuLmNhbGwoc2NvcGUsIHRoaXMuX2lkKTtcbn07XG5cbi8vIERvZXMgbm90IHN0YXJ0IHRoZSB0aW1lLCBqdXN0IHNldHMgdXAgdGhlIG1lbWJlcnMgbmVlZGVkLlxuZXhwb3J0cy5lbnJvbGwgPSBmdW5jdGlvbihpdGVtLCBtc2Vjcykge1xuICBjbGVhclRpbWVvdXQoaXRlbS5faWRsZVRpbWVvdXRJZCk7XG4gIGl0ZW0uX2lkbGVUaW1lb3V0ID0gbXNlY3M7XG59O1xuXG5leHBvcnRzLnVuZW5yb2xsID0gZnVuY3Rpb24oaXRlbSkge1xuICBjbGVhclRpbWVvdXQoaXRlbS5faWRsZVRpbWVvdXRJZCk7XG4gIGl0ZW0uX2lkbGVUaW1lb3V0ID0gLTE7XG59O1xuXG5leHBvcnRzLl91bnJlZkFjdGl2ZSA9IGV4cG9ydHMuYWN0aXZlID0gZnVuY3Rpb24oaXRlbSkge1xuICBjbGVhclRpbWVvdXQoaXRlbS5faWRsZVRpbWVvdXRJZCk7XG5cbiAgdmFyIG1zZWNzID0gaXRlbS5faWRsZVRpbWVvdXQ7XG4gIGlmIChtc2VjcyA+PSAwKSB7XG4gICAgaXRlbS5faWRsZVRpbWVvdXRJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gb25UaW1lb3V0KCkge1xuICAgICAgaWYgKGl0ZW0uX29uVGltZW91dClcbiAgICAgICAgaXRlbS5fb25UaW1lb3V0KCk7XG4gICAgfSwgbXNlY3MpO1xuICB9XG59O1xuXG4vLyBzZXRpbW1lZGlhdGUgYXR0YWNoZXMgaXRzZWxmIHRvIHRoZSBnbG9iYWwgb2JqZWN0XG5yZXF1aXJlKFwic2V0aW1tZWRpYXRlXCIpO1xuLy8gT24gc29tZSBleG90aWMgZW52aXJvbm1lbnRzLCBpdCdzIG5vdCBjbGVhciB3aGljaCBvYmplY3QgYHNldGltbWVkaWF0ZWAgd2FzXG4vLyBhYmxlIHRvIGluc3RhbGwgb250by4gIFNlYXJjaCBlYWNoIHBvc3NpYmlsaXR5IGluIHRoZSBzYW1lIG9yZGVyIGFzIHRoZVxuLy8gYHNldGltbWVkaWF0ZWAgbGlicmFyeS5cbmV4cG9ydHMuc2V0SW1tZWRpYXRlID0gKHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiICYmIHNlbGYuc2V0SW1tZWRpYXRlKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAodHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBnbG9iYWwuc2V0SW1tZWRpYXRlKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAodGhpcyAmJiB0aGlzLnNldEltbWVkaWF0ZSk7XG5leHBvcnRzLmNsZWFySW1tZWRpYXRlID0gKHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiICYmIHNlbGYuY2xlYXJJbW1lZGlhdGUpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgKHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgJiYgZ2xvYmFsLmNsZWFySW1tZWRpYXRlKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICh0aGlzICYmIHRoaXMuY2xlYXJJbW1lZGlhdGUpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvdGltZXJzLWJyb3dzZXJpZnkvbWFpbi5qc1xuLy8gbW9kdWxlIGlkID0gOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIoZnVuY3Rpb24gKGdsb2JhbCwgdW5kZWZpbmVkKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBpZiAoZ2xvYmFsLnNldEltbWVkaWF0ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIG5leHRIYW5kbGUgPSAxOyAvLyBTcGVjIHNheXMgZ3JlYXRlciB0aGFuIHplcm9cbiAgICB2YXIgdGFza3NCeUhhbmRsZSA9IHt9O1xuICAgIHZhciBjdXJyZW50bHlSdW5uaW5nQVRhc2sgPSBmYWxzZTtcbiAgICB2YXIgZG9jID0gZ2xvYmFsLmRvY3VtZW50O1xuICAgIHZhciByZWdpc3RlckltbWVkaWF0ZTtcblxuICAgIGZ1bmN0aW9uIHNldEltbWVkaWF0ZShjYWxsYmFjaykge1xuICAgICAgLy8gQ2FsbGJhY2sgY2FuIGVpdGhlciBiZSBhIGZ1bmN0aW9uIG9yIGEgc3RyaW5nXG4gICAgICBpZiAodHlwZW9mIGNhbGxiYWNrICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgY2FsbGJhY2sgPSBuZXcgRnVuY3Rpb24oXCJcIiArIGNhbGxiYWNrKTtcbiAgICAgIH1cbiAgICAgIC8vIENvcHkgZnVuY3Rpb24gYXJndW1lbnRzXG4gICAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBhcmdzW2ldID0gYXJndW1lbnRzW2kgKyAxXTtcbiAgICAgIH1cbiAgICAgIC8vIFN0b3JlIGFuZCByZWdpc3RlciB0aGUgdGFza1xuICAgICAgdmFyIHRhc2sgPSB7IGNhbGxiYWNrOiBjYWxsYmFjaywgYXJnczogYXJncyB9O1xuICAgICAgdGFza3NCeUhhbmRsZVtuZXh0SGFuZGxlXSA9IHRhc2s7XG4gICAgICByZWdpc3RlckltbWVkaWF0ZShuZXh0SGFuZGxlKTtcbiAgICAgIHJldHVybiBuZXh0SGFuZGxlKys7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xlYXJJbW1lZGlhdGUoaGFuZGxlKSB7XG4gICAgICAgIGRlbGV0ZSB0YXNrc0J5SGFuZGxlW2hhbmRsZV07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcnVuKHRhc2spIHtcbiAgICAgICAgdmFyIGNhbGxiYWNrID0gdGFzay5jYWxsYmFjaztcbiAgICAgICAgdmFyIGFyZ3MgPSB0YXNrLmFyZ3M7XG4gICAgICAgIHN3aXRjaCAoYXJncy5sZW5ndGgpIHtcbiAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICBjYWxsYmFjayhhcmdzWzBdKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICBjYWxsYmFjayhhcmdzWzBdLCBhcmdzWzFdKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICBjYWxsYmFjayhhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgY2FsbGJhY2suYXBwbHkodW5kZWZpbmVkLCBhcmdzKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcnVuSWZQcmVzZW50KGhhbmRsZSkge1xuICAgICAgICAvLyBGcm9tIHRoZSBzcGVjOiBcIldhaXQgdW50aWwgYW55IGludm9jYXRpb25zIG9mIHRoaXMgYWxnb3JpdGhtIHN0YXJ0ZWQgYmVmb3JlIHRoaXMgb25lIGhhdmUgY29tcGxldGVkLlwiXG4gICAgICAgIC8vIFNvIGlmIHdlJ3JlIGN1cnJlbnRseSBydW5uaW5nIGEgdGFzaywgd2UnbGwgbmVlZCB0byBkZWxheSB0aGlzIGludm9jYXRpb24uXG4gICAgICAgIGlmIChjdXJyZW50bHlSdW5uaW5nQVRhc2spIHtcbiAgICAgICAgICAgIC8vIERlbGF5IGJ5IGRvaW5nIGEgc2V0VGltZW91dC4gc2V0SW1tZWRpYXRlIHdhcyB0cmllZCBpbnN0ZWFkLCBidXQgaW4gRmlyZWZveCA3IGl0IGdlbmVyYXRlZCBhXG4gICAgICAgICAgICAvLyBcInRvbyBtdWNoIHJlY3Vyc2lvblwiIGVycm9yLlxuICAgICAgICAgICAgc2V0VGltZW91dChydW5JZlByZXNlbnQsIDAsIGhhbmRsZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgdGFzayA9IHRhc2tzQnlIYW5kbGVbaGFuZGxlXTtcbiAgICAgICAgICAgIGlmICh0YXNrKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudGx5UnVubmluZ0FUYXNrID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBydW4odGFzayk7XG4gICAgICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJJbW1lZGlhdGUoaGFuZGxlKTtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudGx5UnVubmluZ0FUYXNrID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zdGFsbE5leHRUaWNrSW1wbGVtZW50YXRpb24oKSB7XG4gICAgICAgIHJlZ2lzdGVySW1tZWRpYXRlID0gZnVuY3Rpb24oaGFuZGxlKSB7XG4gICAgICAgICAgICBwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uICgpIHsgcnVuSWZQcmVzZW50KGhhbmRsZSk7IH0pO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNhblVzZVBvc3RNZXNzYWdlKCkge1xuICAgICAgICAvLyBUaGUgdGVzdCBhZ2FpbnN0IGBpbXBvcnRTY3JpcHRzYCBwcmV2ZW50cyB0aGlzIGltcGxlbWVudGF0aW9uIGZyb20gYmVpbmcgaW5zdGFsbGVkIGluc2lkZSBhIHdlYiB3b3JrZXIsXG4gICAgICAgIC8vIHdoZXJlIGBnbG9iYWwucG9zdE1lc3NhZ2VgIG1lYW5zIHNvbWV0aGluZyBjb21wbGV0ZWx5IGRpZmZlcmVudCBhbmQgY2FuJ3QgYmUgdXNlZCBmb3IgdGhpcyBwdXJwb3NlLlxuICAgICAgICBpZiAoZ2xvYmFsLnBvc3RNZXNzYWdlICYmICFnbG9iYWwuaW1wb3J0U2NyaXB0cykge1xuICAgICAgICAgICAgdmFyIHBvc3RNZXNzYWdlSXNBc3luY2hyb25vdXMgPSB0cnVlO1xuICAgICAgICAgICAgdmFyIG9sZE9uTWVzc2FnZSA9IGdsb2JhbC5vbm1lc3NhZ2U7XG4gICAgICAgICAgICBnbG9iYWwub25tZXNzYWdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcG9zdE1lc3NhZ2VJc0FzeW5jaHJvbm91cyA9IGZhbHNlO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGdsb2JhbC5wb3N0TWVzc2FnZShcIlwiLCBcIipcIik7XG4gICAgICAgICAgICBnbG9iYWwub25tZXNzYWdlID0gb2xkT25NZXNzYWdlO1xuICAgICAgICAgICAgcmV0dXJuIHBvc3RNZXNzYWdlSXNBc3luY2hyb25vdXM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnN0YWxsUG9zdE1lc3NhZ2VJbXBsZW1lbnRhdGlvbigpIHtcbiAgICAgICAgLy8gSW5zdGFsbHMgYW4gZXZlbnQgaGFuZGxlciBvbiBgZ2xvYmFsYCBmb3IgdGhlIGBtZXNzYWdlYCBldmVudDogc2VlXG4gICAgICAgIC8vICogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vRE9NL3dpbmRvdy5wb3N0TWVzc2FnZVxuICAgICAgICAvLyAqIGh0dHA6Ly93d3cud2hhdHdnLm9yZy9zcGVjcy93ZWItYXBwcy9jdXJyZW50LXdvcmsvbXVsdGlwYWdlL2NvbW1zLmh0bWwjY3Jvc3NEb2N1bWVudE1lc3NhZ2VzXG5cbiAgICAgICAgdmFyIG1lc3NhZ2VQcmVmaXggPSBcInNldEltbWVkaWF0ZSRcIiArIE1hdGgucmFuZG9tKCkgKyBcIiRcIjtcbiAgICAgICAgdmFyIG9uR2xvYmFsTWVzc2FnZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQuc291cmNlID09PSBnbG9iYWwgJiZcbiAgICAgICAgICAgICAgICB0eXBlb2YgZXZlbnQuZGF0YSA9PT0gXCJzdHJpbmdcIiAmJlxuICAgICAgICAgICAgICAgIGV2ZW50LmRhdGEuaW5kZXhPZihtZXNzYWdlUHJlZml4KSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJ1bklmUHJlc2VudCgrZXZlbnQuZGF0YS5zbGljZShtZXNzYWdlUHJlZml4Lmxlbmd0aCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICAgICAgZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIG9uR2xvYmFsTWVzc2FnZSwgZmFsc2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZ2xvYmFsLmF0dGFjaEV2ZW50KFwib25tZXNzYWdlXCIsIG9uR2xvYmFsTWVzc2FnZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZWdpc3RlckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgICAgICAgICAgZ2xvYmFsLnBvc3RNZXNzYWdlKG1lc3NhZ2VQcmVmaXggKyBoYW5kbGUsIFwiKlwiKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnN0YWxsTWVzc2FnZUNoYW5uZWxJbXBsZW1lbnRhdGlvbigpIHtcbiAgICAgICAgdmFyIGNoYW5uZWwgPSBuZXcgTWVzc2FnZUNoYW5uZWwoKTtcbiAgICAgICAgY2hhbm5lbC5wb3J0MS5vbm1lc3NhZ2UgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgdmFyIGhhbmRsZSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBydW5JZlByZXNlbnQoaGFuZGxlKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZWdpc3RlckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgICAgICAgICAgY2hhbm5lbC5wb3J0Mi5wb3N0TWVzc2FnZShoYW5kbGUpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc3RhbGxSZWFkeVN0YXRlQ2hhbmdlSW1wbGVtZW50YXRpb24oKSB7XG4gICAgICAgIHZhciBodG1sID0gZG9jLmRvY3VtZW50RWxlbWVudDtcbiAgICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUgPSBmdW5jdGlvbihoYW5kbGUpIHtcbiAgICAgICAgICAgIC8vIENyZWF0ZSBhIDxzY3JpcHQ+IGVsZW1lbnQ7IGl0cyByZWFkeXN0YXRlY2hhbmdlIGV2ZW50IHdpbGwgYmUgZmlyZWQgYXN5bmNocm9ub3VzbHkgb25jZSBpdCBpcyBpbnNlcnRlZFxuICAgICAgICAgICAgLy8gaW50byB0aGUgZG9jdW1lbnQuIERvIHNvLCB0aHVzIHF1ZXVpbmcgdXAgdGhlIHRhc2suIFJlbWVtYmVyIHRvIGNsZWFuIHVwIG9uY2UgaXQncyBiZWVuIGNhbGxlZC5cbiAgICAgICAgICAgIHZhciBzY3JpcHQgPSBkb2MuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcbiAgICAgICAgICAgIHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcnVuSWZQcmVzZW50KGhhbmRsZSk7XG4gICAgICAgICAgICAgICAgc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgaHRtbC5yZW1vdmVDaGlsZChzY3JpcHQpO1xuICAgICAgICAgICAgICAgIHNjcmlwdCA9IG51bGw7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaHRtbC5hcHBlbmRDaGlsZChzY3JpcHQpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc3RhbGxTZXRUaW1lb3V0SW1wbGVtZW50YXRpb24oKSB7XG4gICAgICAgIHJlZ2lzdGVySW1tZWRpYXRlID0gZnVuY3Rpb24oaGFuZGxlKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KHJ1bklmUHJlc2VudCwgMCwgaGFuZGxlKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBJZiBzdXBwb3J0ZWQsIHdlIHNob3VsZCBhdHRhY2ggdG8gdGhlIHByb3RvdHlwZSBvZiBnbG9iYWwsIHNpbmNlIHRoYXQgaXMgd2hlcmUgc2V0VGltZW91dCBldCBhbC4gbGl2ZS5cbiAgICB2YXIgYXR0YWNoVG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YgJiYgT2JqZWN0LmdldFByb3RvdHlwZU9mKGdsb2JhbCk7XG4gICAgYXR0YWNoVG8gPSBhdHRhY2hUbyAmJiBhdHRhY2hUby5zZXRUaW1lb3V0ID8gYXR0YWNoVG8gOiBnbG9iYWw7XG5cbiAgICAvLyBEb24ndCBnZXQgZm9vbGVkIGJ5IGUuZy4gYnJvd3NlcmlmeSBlbnZpcm9ubWVudHMuXG4gICAgaWYgKHt9LnRvU3RyaW5nLmNhbGwoZ2xvYmFsLnByb2Nlc3MpID09PSBcIltvYmplY3QgcHJvY2Vzc11cIikge1xuICAgICAgICAvLyBGb3IgTm9kZS5qcyBiZWZvcmUgMC45XG4gICAgICAgIGluc3RhbGxOZXh0VGlja0ltcGxlbWVudGF0aW9uKCk7XG5cbiAgICB9IGVsc2UgaWYgKGNhblVzZVBvc3RNZXNzYWdlKCkpIHtcbiAgICAgICAgLy8gRm9yIG5vbi1JRTEwIG1vZGVybiBicm93c2Vyc1xuICAgICAgICBpbnN0YWxsUG9zdE1lc3NhZ2VJbXBsZW1lbnRhdGlvbigpO1xuXG4gICAgfSBlbHNlIGlmIChnbG9iYWwuTWVzc2FnZUNoYW5uZWwpIHtcbiAgICAgICAgLy8gRm9yIHdlYiB3b3JrZXJzLCB3aGVyZSBzdXBwb3J0ZWRcbiAgICAgICAgaW5zdGFsbE1lc3NhZ2VDaGFubmVsSW1wbGVtZW50YXRpb24oKTtcblxuICAgIH0gZWxzZSBpZiAoZG9jICYmIFwib25yZWFkeXN0YXRlY2hhbmdlXCIgaW4gZG9jLmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIikpIHtcbiAgICAgICAgLy8gRm9yIElFIDbigJM4XG4gICAgICAgIGluc3RhbGxSZWFkeVN0YXRlQ2hhbmdlSW1wbGVtZW50YXRpb24oKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEZvciBvbGRlciBicm93c2Vyc1xuICAgICAgICBpbnN0YWxsU2V0VGltZW91dEltcGxlbWVudGF0aW9uKCk7XG4gICAgfVxuXG4gICAgYXR0YWNoVG8uc2V0SW1tZWRpYXRlID0gc2V0SW1tZWRpYXRlO1xuICAgIGF0dGFjaFRvLmNsZWFySW1tZWRpYXRlID0gY2xlYXJJbW1lZGlhdGU7XG59KHR5cGVvZiBzZWxmID09PSBcInVuZGVmaW5lZFwiID8gdHlwZW9mIGdsb2JhbCA9PT0gXCJ1bmRlZmluZWRcIiA/IHRoaXMgOiBnbG9iYWwgOiBzZWxmKSk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9zZXRpbW1lZGlhdGUvc2V0SW1tZWRpYXRlLmpzXG4vLyBtb2R1bGUgaWQgPSA5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanNcbi8vIG1vZHVsZSBpZCA9IDEwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gIHZhciBjb25zdHJ1Y3RvciA9IHRoaXMuY29uc3RydWN0b3I7XG4gIHJldHVybiB0aGlzLnRoZW4oXG4gICAgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiBjb25zdHJ1Y3Rvci5yZXNvbHZlKGNhbGxiYWNrKCkpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgZnVuY3Rpb24ocmVhc29uKSB7XG4gICAgICByZXR1cm4gY29uc3RydWN0b3IucmVzb2x2ZShjYWxsYmFjaygpKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gY29uc3RydWN0b3IucmVqZWN0KHJlYXNvbik7XG4gICAgICB9KTtcbiAgICB9XG4gICk7XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9wcm9taXNlLXBvbHlmaWxsL3NyYy9maW5hbGx5LmpzXG4vLyBtb2R1bGUgaWQgPSAxMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKiogQGRlc2MgVXRpbGl0eSBjbGFzcyB0aGF0IGRldGVybWluZXMgdGhlIGVuZCB1c2VyJ3MgYnJvd3NlciB1c2VyIGFnZW50LiAqKi9cbmV4cG9ydCBjbGFzcyBNb2JpbGVEZXRlY3Rpb24ge1xuICAvKipcbiAgKiBAZGVzYyBEZXRlcm1pbmVzIGlmIHRoZSB1c2VyIGlzIHVzaW5nIGFuIEFuZHJvaWQgZGV2aWNlLlxuICAqKi9cbiAgc3RhdGljIEFuZHJvaWQoKSB7XG4gICAgcmV0dXJuICEhbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvQW5kcm9pZC9pKTtcbiAgfVxuXG4gIC8qKlxuICAqIEBkZXNjIERldGVybWluZXMgaWYgdGhlIHVzZXIgaXMgdXNpbmcgYW4gb2xkIEFuZHJvaWQgZGV2aWNlLlxuICAqKi9cbiAgc3RhdGljIEFuZHJvaWRPbGQoKSB7XG4gICAgcmV0dXJuICEhbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvQW5kcm9pZCAyLjMuMy9pKTtcbiAgfVxuXG4gIC8qKlxuICAqIEBkZXNjIERldGVybWluZXMgaWYgdGhlIHVzZXIgaXMgdXNpbmcgYW4gQW5kcm9pZCB0YWJsZXQgZGV2aWNlLlxuICAqKi9cbiAgc3RhdGljIEFuZHJvaWRUYWJsZXQoKSB7XG4gICAgcmV0dXJuICEhKG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL0FuZHJvaWQvaSkgJiYgIW5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL01vYmlsZS9pKSk7XG4gIH1cblxuICAvKipcbiAgKiBAZGVzYyBEZXRlcm1pbmVzIGlmIHRoZSB1c2VyIGlzIHVzaW5nIGEgS2luZGxlLlxuICAqKi9cbiAgc3RhdGljIEtpbmRsZSgpIHtcbiAgICByZXR1cm4gISFuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9LaW5kbGUvaSk7XG4gIH1cblxuICAvKipcbiAgKiBAZGVzYyBEZXRlcm1pbmVzIGlmIHRoZSB1c2VyIGlzIHVzaW5nIGEgS2luZGxlIEZpcmUuXG4gICoqL1xuICBzdGF0aWMgS2luZGxlRmlyZSgpIHtcbiAgICByZXR1cm4gISFuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9LRk9UL2kpO1xuICB9XG5cbiAgLyoqXG4gICogQGRlc2MgRGV0ZXJtaW5lcyBpZiB0aGUgdXNlciBpcyB1c2luZyBTaWxrLlxuICAqKi9cbiAgc3RhdGljIFNpbGsoKSB7XG4gICAgcmV0dXJuICEhbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvU2lsay9pKTtcbiAgfVxuXG4gIC8qKlxuICAqIEBkZXNjIERldGVybWluZXMgaWYgdGhlIHVzZXIgaXMgdXNpbmcgYSBCbGFja0JlcnJ5IGRldmljZVxuICAqKi9cbiAgc3RhdGljIEJsYWNrQmVycnkoKSB7XG4gICAgcmV0dXJuICEhbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvQmxhY2tCZXJyeS9pKTtcbiAgfVxuXG4gIC8qKlxuICAqIEBkZXNjIERldGVybWluZXMgaWYgdGhlIHVzZXIgaXMgdXNpbmcgYW4gaU9TIGRldmljZS5cbiAgKiovXG4gIHN0YXRpYyBpT1MoKSB7XG4gICAgcmV0dXJuICEhbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvaVBob25lfGlQYWR8aVBvZC9pKTtcbiAgfVxuXG4gIC8qKlxuICAqIEBkZXNjIERldGVybWluZXMgaWYgdGhlIHVzZXIgaXMgdXNpbmcgYW4gaVBob25lIG9yIGlQb2QuXG4gICoqL1xuICBzdGF0aWMgaVBob25lKCkge1xuICAgIHJldHVybiAhIW5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL2lQaG9uZXxpUG9kL2kpO1xuICB9XG5cbiAgLyoqXG4gICogQGRlc2MgRGV0ZXJtaW5lcyBpZiB0aGUgdXNlciBpcyB1c2luZyBhbiBpUGFkLlxuICAqKi9cbiAgc3RhdGljIGlQYWQoKSB7XG4gICAgcmV0dXJuICEhbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvaVBhZC9pKTtcbiAgfVxuXG4gIC8qKlxuICAqIEBkZXNjIERldGVybWluZXMgaWYgdGhlIHVzZXIgaXMgdXNpbmcgYSBXaW5kb3dzIE1vYmlsZSBkZXZpY2UuXG4gICoqL1xuICBzdGF0aWMgV2luZG93cygpIHtcbiAgICByZXR1cm4gISFuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9JRU1vYmlsZS9pKTtcbiAgfVxuXG4gIC8qKlxuICAqIEBkZXNjIERldGVybWluZXMgaWYgdGhlIHVzZXIgaXMgdXNpbmcgRmlyZUZveE9TLlxuICAqKi9cbiAgc3RhdGljIEZpcmVmb3hPUygpIHtcbiAgICByZXR1cm4gISFuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9Nb3ppbGxhL2kpICYmICEhbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvTW9iaWxlL2kpO1xuICB9XG5cbiAgLyoqXG4gICogQGRlc2MgRGV0ZXJtaW5lcyBpZiB0aGUgdXNlciBpcyB1c2luZyBhIFJldGluYSBkaXNwbGF5LlxuICAqKi9cbiAgc3RhdGljIFJldGluYSgpIHtcbiAgICByZXR1cm4gKHdpbmRvdy5yZXRpbmEgfHwgd2luZG93LmRldmljZVBpeGVsUmF0aW8gPiAxKTtcbiAgfVxuXG4gIC8qKlxuICAqIEBkZXNjIERldGVybWluZXMgaWYgdGhlIHVzZXIgaXMgdXNpbmcgYW55IHR5cGUgb2YgbW9iaWxlIGRldmljZS5cbiAgKiovXG4gIHN0YXRpYyBhbnkoKSB7XG4gICAgcmV0dXJuICh0aGlzLkFuZHJvaWQoKSB8fCB0aGlzLktpbmRsZSgpIHx8IHRoaXMuS2luZGxlRmlyZSgpIHx8IHRoaXMuU2lsaygpIHx8IHRoaXMuQmxhY2tCZXJyeSgpIHx8IHRoaXMuaU9TKCkgfHwgdGhpcy5XaW5kb3dzKCkgfHwgdGhpcy5GaXJlZm94T1MoKSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTW9iaWxlRGV0ZWN0aW9uO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3V0aWwvbW9iaWxlLmpzIiwiLyoqXG4qIEBkZXNjIElmIGEgZGlmZmVyZW50IGtleSBpcyByZXF1aXJlZCB0byBzZXJ2ZSBwb3NpdGlvbiB0YXJnZXRpbmcgZm9yIG9sZGVyIGNyZWF0aXZlcywgcmVuYW1lIGl0IGhlcmUuXG4qIEBwYXJhbSB7b2JqZWN0fSB0YXJnZXRpbmcgLSBUYXJnZXRpbmcgb2JqZWN0IHBhc3NlZCBpbiBmcm9tIHRoZSBhZCBvYmplY3QuXG4qIEBwYXJhbSB7bnVtYmVyfSBwb3NpdGlvblZhbHVlIC0gVGhlIG50aCBudW1iZXIgb2YgYWRUeXBlIGluY2x1ZGVkLlxuKiBAcmV0dXJuIC0gUmV0dXJucyB0aGUgdGFyZ2V0aW5nIG9iamVjdCB3aXRoIHRoZSBvbGQgcG9zaXRpb24gdmFsdWUgc3RyaXBwZWQgb3V0LCBhbmQgdGhlIG5ldyBvbmUgd2l0aCB0aGUgZGVzaXJlZCBrZXkgaW4gaXRzIHBsYWNlLlxuKiovXG5leHBvcnQgZnVuY3Rpb24gcmVuYW1lUG9zaXRpb25LZXkodGFyZ2V0aW5nLCBwb3NpdGlvblZhbHVlKSB7XG4gIGNvbnN0IG5ld1RhcmdldGluZ09iamVjdCA9IHRhcmdldGluZztcbiAgY29uc3Qga2V5TmFtZSA9IHRhcmdldGluZy5wb3NpdGlvbi5hcztcbiAgZGVsZXRlIG5ld1RhcmdldGluZ09iamVjdC5wb3NpdGlvbjtcbiAgbmV3VGFyZ2V0aW5nT2JqZWN0W2tleU5hbWVdID0gcG9zaXRpb25WYWx1ZTtcbiAgT2JqZWN0LmFzc2lnbih0YXJnZXRpbmcsIG5ld1RhcmdldGluZ09iamVjdCk7XG4gIHJldHVybiB0YXJnZXRpbmc7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvdXRpbC9jdXN0b21UYXJnZXRpbmcuanMiLCIvKipcbiogQGRlc2MgQWNjZXB0cyBhIGtleSBhcyBhIHN0cmluZyBhbmQgcmV0dXJucyB0aGUgdmFsdWUgb2YgYSBxdWVyeSBwYXJhbWV0ZXIgb24gdGhlIHBhZ2UgcmVxdWVzdC5cbiogQHBhcmFtIHtzdHJpbmd9IHBhcmFtIC0gQSBzdHJpbmcgdGhhdCByZXByZXNlbnRzIHRoZSBrZXkgb2YgYSBxdWVyeSBwYXJhbXRlciwgZm9yIGV4YW1wbGUgJ2Fkc2xvdCcgd2lsbCByZXR1cm4gJ2hlbGxvJyBpZiB0aGUgdXJsIGhhcyAnP2Fkc2xvdD1oZWxsbycgYXQgdGhlIGVuZCBvZiBpdC5cbiogQHJldHVybiAtIFJldHVybnMgYSBzdHJpbmcgY29udGFpbmluZyB0aGUgdmFsdWUgb2YgYSBxdWVyeSBwYXJhbXRlci5cbioqL1xuZXhwb3J0IGZ1bmN0aW9uIGV4cGFuZFF1ZXJ5U3RyaW5nKHBhcmFtKSB7XG4gIGNvbnN0IHVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICBjb25zdCBuYW1lID0gcGFyYW0ucmVwbGFjZSgvW1tcXF1dL2csICdcXFxcJCYnKTtcbiAgY29uc3QgcmVnZXggPSBuZXcgUmVnRXhwKGBbPyZdJHtuYW1lfSg9KFteJiNdKil8JnwjfCQpYCk7XG4gIGNvbnN0IHJlc3VsdHMgPSByZWdleC5leGVjKHVybCk7XG5cbiAgaWYgKCFyZXN1bHRzKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBpZiAoIXJlc3VsdHNbMl0pIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbiAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChyZXN1bHRzWzJdLnJlcGxhY2UoL1xcKy9nLCAnICcpKTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy91dGlsL3F1ZXJ5LmpzIiwiLyoqXG4qIEBkZXNjIEZldGNoZXMgYSBiaWQgZm9yIGFuIGFkdmVydGlzZW1lbnQgYmFzZWQgb24gd2hpY2ggc2VydmljZXMgYXJlIGVuYWJsZWQgb24gdW5pdCBhbmQgdGhlIHdyYXBwZXIuXG4qIEBwYXJhbSB7c3RyaW5nfSBpZCAtIEEgc3RyaW5nIGNvbnRhaW5pbmcgdGhlIGFkdmVydGlzZW1lbnQgaWQgY29ycmVzcG9uZGluZyB0byB0aGUgZGl2IHRoZSBhZHZlcnRpc2VtZW50IHdpbGwgbG9hZCBpbnRvLlxuKiBAcGFyYW0ge3N0cmluZ30gc2xvdE5hbWUgLSBBIHN0cmluZyBjb250YWluaW5nIHRoZSBzbG90IG5hbWUgb2YgdGhlIGFkdmVydGlzZW1lbnQsIGZvciBpbnN0YW5jZSAnMTIzNC9hZG4uY29tL2hvbWVwYWdlJy5cbiogQHBhcmFtIHthcnJheX0gZGltZW5zaW9ucyAtIEFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIG9mIHRoZSBhcHBsaWNhYmxlIHNpemVzIHRoZSBhZHZlcnRpc2VtZW50IGNhbiB1c2UuXG4qIEBwYXJhbSB7ZnVuY3Rpb259IGNiIC0gQW4gb3B0aW9uYWwgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBzaG91bGQgZmlyZSB3aGVuZXZlciB0aGUgYmlkZGluZyBoYXMgY29uY2x1ZGVkLlxuKiovXG5leHBvcnQgZnVuY3Rpb24gZmV0Y2hBbWF6b25CaWRzKGlkLCBzbG90TmFtZSwgZGltZW5zaW9ucywgY2IgPSBudWxsKSB7XG4gIHF1ZXVlQW1hem9uQ29tbWFuZCgoKSA9PiB7XG4gICAgY29uc3Qgc2xvdCA9IHtcbiAgICAgIHNsb3ROYW1lLFxuICAgICAgc2xvdElEOiBpZCxcbiAgICAgIHNpemVzOiBkaW1lbnNpb25zXG4gICAgfTtcblxuICAgIC8vIFJldHJpZXZlcyB0aGUgYmlkIGZyb20gQW1hem9uXG4gICAgd2luZG93LmFwc3RhZy5mZXRjaEJpZHMoeyBzbG90czogW3Nsb3RdIH0sICgpID0+IHtcbiAgICAgIC8vIFNldHMgdGhlIHRhcmdldGluZyB2YWx1ZXMgb24gdGhlIGRpc3BsYXkgYmlkIGZyb20gYXBzdGFnXG4gICAgICB3aW5kb3cuYXBzdGFnLnNldERpc3BsYXlCaWRzKCk7XG5cbiAgICAgIGlmIChjYikge1xuICAgICAgICBjYigpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbn1cblxuLyoqXG4qIEBkZXNjIEFkZHMgYW4gQW1hem9uIGNvbW1hbmQgdG8gYSBjYWxsYmFjayBxdWV1ZSB3aGljaCBhd2FpdHMgZm9yIHdpbmRvdy5hcHN0YWdcbiogQHBhcmFtIHtzdHJpbmd9IGNtZCAtIFRoZSBmdW5jdGlvbiB0aGF0IHNob3VsZCB3YWl0IGZvciB3aW5kb3cuYXBzdGFnIHRvIGJlIHJlYWR5LlxuKiovXG5leHBvcnQgZnVuY3Rpb24gcXVldWVBbWF6b25Db21tYW5kKGNtZCkge1xuICBpZiAod2luZG93LmFwc3RhZykge1xuICAgIGNtZCgpO1xuICB9IGVsc2Uge1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgcXVldWVBbWF6b25Db21tYW5kKGNtZCk7XG4gICAgfSwgMjAwKTtcbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3NlcnZpY2VzL2FtYXpvbi5qcyIsImltcG9ydCB7IGRlYm91bmNlIH0gZnJvbSAnLi4vdXRpbC9kZWJvdW5jZSc7XG5pbXBvcnQgeyBmZXRjaEJpZHMgfSBmcm9tICcuL2hlYWRlcmJpZGRpbmcnO1xuaW1wb3J0IHsgcmVmcmVzaFNsb3QgfSBmcm9tICcuL2dwdCc7XG5cbi8qKiBAZGVzYyBBbiBvYmplY3QgY29udGFpbmluZyBhbGwgb2YgdGhlIHNpemUgbWFwIHJlZnJlc2ggZXZlbnQgbGlzdGVuZXJzIGFuZCBjb3JyZWxhdG9ycyBmb3Igc2l6ZSBtYXBwaW5nLiAqKi9cbmV4cG9ydCBjb25zdCBzaXplbWFwTGlzdGVuZXJzID0ge307XG5cbi8qKiBAZGVzYyBBbiBvYmplY3QgY29udGFpbmluZyBhbGwgb2YgdGhlIHNjcmVlbiByZXNpemUgZXZlbnQgbGlzdGVuZXJzIGZvciBzaXplIG1hcHBpbmcuICoqL1xuZXhwb3J0IGNvbnN0IHJlc2l6ZUxpc3RlbmVycyA9IHt9O1xuXG4vKipcbiogQGRlc2MgUHJlcGFyZXMgYSBzZXQgb2YgZGltZW5zaW9ucyBhbmQgdGhlaXIgY29ycmVzcG9uZGluZyBicmVha3BvaW50cyB0byBjcmVhdGUgYSBzaXplbWFwIHdoaWNoIGlzIHJlYWRhYmxlIGJ5IEdQVC5cbiogQHBhcmFtIHthcnJheX0gZGltZW5zaW9ucyAtIEFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIG9mIHRoZSBhcHBsaWNhYmxlIHNpemVzIHRoZSBhZHZlcnRpc2VtZW50IGNhbiB1c2UuXG4qIEBwYXJhbSB7YXJyYXl9IHNpemVtYXAgLSBBbiBhcnJheSBjb250YWluaW5nIGFsbCBvZiB0aGUgYXBwbGljYWJsZSBicmVha3BvaW50cyBmb3IgdGhlIHNpemVtYXBwaW5nLlxuKiovXG5leHBvcnQgZnVuY3Rpb24gcHJlcGFyZVNpemVNYXBzKGRpbWVuc2lvbnMsIHNpemVtYXApIHtcbiAgY29uc3QgbWFwcGluZyA9IFtdO1xuICBjb25zdCBicmVha3BvaW50cyA9IFtdO1xuICBjb25zdCBjb3JyZWxhdG9ycyA9IFtdO1xuICBjb25zdCBwYXJzZWRTaXplbWFwID0gIXNpemVtYXAubGVuZ3RoID8gbnVsbCA6IEpTT04ucGFyc2Uoc2l6ZW1hcCk7XG5cbiAgcGFyc2VkU2l6ZW1hcC5mb3JFYWNoKCh2YWx1ZSwgaW5kZXgpID0+IHtcbiAgICBtYXBwaW5nLnB1c2goW3ZhbHVlLCBkaW1lbnNpb25zW2luZGV4XV0pO1xuXG4gICAgLy8gRmlsdGVycyBkdXBsaWNhdGVzIGZyb20gdGhlIG1hcHBpbmdcbiAgICBpZiAoYnJlYWtwb2ludHMuaW5kZXhPZih2YWx1ZVswXSkgPT09IC0xKSB7XG4gICAgICBicmVha3BvaW50cy5wdXNoKHZhbHVlWzBdKTtcbiAgICAgIGNvcnJlbGF0b3JzLnB1c2goZmFsc2UpO1xuICAgIH1cbiAgfSk7XG5cbiAgYnJlYWtwb2ludHMuc29ydCgoYSwgYikgPT4geyByZXR1cm4gYSAtIGI7IH0pO1xuXG4gIHJldHVybiB7IG1hcHBpbmcsIGJyZWFrcG9pbnRzLCBjb3JyZWxhdG9ycyB9O1xufVxuXG4vKipcbiogQGRlc2MgRGV0ZXJtaW5lcyB3aGljaCBzZXQgb2YgYWQgc2l6ZXMgYXJlIGFib3V0IHRvIGRpc3BsYXkgYmFzZWQgb24gdGhlIHVzZXJzIGN1cnJlbnQgc2NyZWVuIHNpemUuXG4qIEBwYXJhbSB7YXJyYXl9IHNpemVNYXBwaW5ncyAtIEFuIGFycmF5IGNvbnRhaW5pbmcgdGhlIGFkdmVydGlzZW1lbnRzIEdQVCByZWFkYWJsZSBzaXplIG1hcHBpbmcuXG4qIEByZXR1cm4ge2FycmF5fSAtIFJldHVybnMgYW4gYXJyYXkgY29udGFpbmluZyB0aGUgYWQgc2l6ZXMgd2hpY2ggcmVsYXRlIHRvIHRoZSB1c2VycyBjdXJyZW50IHdpbmRvdyB3aWR0aC5cbioqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlU2l6ZU1hcHBpbmdzKHNpemVNYXBwaW5ncykge1xuICB0cnkge1xuICAgIGNvbnN0IHdpZHRoID0gd2luZG93LmlubmVyV2lkdGggfHxcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGggfHxcbiAgICBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoO1xuXG4gICAgY29uc3QgaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0IHx8XG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCB8fFxuICAgIGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0O1xuXG4gICAgY29uc3Qgc2QgPSBbd2lkdGgsIGhlaWdodF07XG5cbiAgICAvKiBGaWx0ZXJzIG1hcHBpbmdzIHRoYXQgYXJlIHZhbGlkIGJ5IGNvbmZpcm1pbmcgdGhhdCB0aGUgY3VycmVudCBzY3JlZW4gZGltZW5zaW9uc1xuICAgICAgYXJlIGJvdGggZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIHRoZSBicmVha3BvaW50IFt4LCB5XSBtaW5pbXVtcyBzcGVjaWZpZWQgaW4gdGhlIGZpcnN0IHBvc2l0aW9uIGluIHRoZSBtYXBwaW5nLlxuICAgICAgUmV0dXJucyB0aGUgbGVmdG1vc3QgbWFwcGluZydzIHNpemVzIG9yIGFuIGVtcHR5IGFycmF5LiAqL1xuICAgIGNvbnN0IHZhbGlkTWFwcGluZ3MgPSBzaXplTWFwcGluZ3MuZmlsdGVyKChtYXBwaW5nKSA9PiB7XG4gICAgICByZXR1cm4gbWFwcGluZ1swXVswXSA8PSBzZFswXSAmJiBtYXBwaW5nWzBdWzFdIDw9IHNkWzFdO1xuICAgIH0pO1xuXG4gICAgbGV0IHJlc3VsdCA9IHZhbGlkTWFwcGluZ3MubGVuZ3RoID4gMCA/IHZhbGlkTWFwcGluZ3NbMF1bMV0gOiBbXTtcblxuICAgIGlmIChyZXN1bHQubGVuZ3RoID4gMCAmJiByZXN1bHRbMF0uY29uc3RydWN0b3IgIT09IEFycmF5KSB7XG4gICAgICAvLyBXcmFwcyB0aGUgMUQgYXJyYXkgaW4gYW5vdGhlciBzZXQgb2YgYnJhY2tldHMgdG8gbWFrZSBpdCAyRFxuICAgICAgcmVzdWx0ID0gW3Jlc3VsdF07XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSBjYXRjaCAoZSkge1xuICAgIC8vIEZhbGxiYWNrIHRvIGxhc3Qgc2l6ZSBtYXBwaW5nIHN1cHBsaWVkIGlmIHRoZXJlJ3MgYW4gaW52YWxpZCBtYXBwaW5nIHByb3ZpZGVkXG4gICAgcmV0dXJuIHNpemVNYXBwaW5nc1tzaXplTWFwcGluZ3MubGVuZ3RoIC0gMV1bMV07XG4gIH1cbn1cblxuLyoqXG4qIEBkZXNjIFJlc2l6ZSBldmVudCB0aGF0IGNoZWNrcyBpZiBhIHVzZXIgaGFzIHJlc2l6ZWQgcGFzdCBhIGJyZWFrcG9pbnQgaW5jbHVkZWQgaW4gdGhlIGFkdmVydGlzZW1lbnRzIHNpemVtYXAuIElmIGl0IGhhcyB0aGUgR1BUXG4qIHJlZnJlc2ggbWV0aG9kIGlzIGNhbGxlZCBzbyB0aGUgc2VydmljZSBjYW4gZmV0Y2ggYSBtb3JlIGFwcm9wcmlhdGVseSBzaXplZCBjcmVhdGl2ZS5cbiogQHBhcmFtIHtvYmplY3R9IHBhcmFtcyAtIEFuIG9iamVjdCBjb250YWluaW5nIGFsbCBvZiB0aGUgYWR2ZXJ0aXNlbWVudCBjb25maWd1cmF0aW9uIHNldHRpbmdzIHN1Y2ggYXMgc2xvdCBuYW1lLCBpZCwgYW5kIHBvc2l0aW9uLlxuKiovXG5leHBvcnQgZnVuY3Rpb24gcnVuUmVzaXplRXZlbnRzKHBhcmFtcykge1xuICBsZXQgbGFzdEJyZWFrcG9pbnQ7XG4gIGxldCBpbml0aWFsTG9hZCA9IGZhbHNlO1xuXG4gIHJldHVybiAoKSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgYWQsXG4gICAgICBicmVha3BvaW50cyxcbiAgICAgIGlkLFxuICAgICAgYmlkZGluZyxcbiAgICAgIG1hcHBpbmcsXG4gICAgICBzbG90TmFtZSxcbiAgICAgIHdyYXBwZXIsXG4gICAgICBwcmVyZW5kZXIgfSA9IHBhcmFtcztcblxuICAgIGNvbnN0IHdpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgbGV0IGJyZWFrcG9pbnQ7XG4gICAgbGV0IG5leHRCcmVha3BvaW50O1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBicmVha3BvaW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgYnJlYWtwb2ludCA9IGJyZWFrcG9pbnRzW2ldO1xuICAgICAgbmV4dEJyZWFrcG9pbnQgPSBicmVha3BvaW50c1tpICsgMV07XG5cbiAgICAgIGlmICgod2lkdGggPiBicmVha3BvaW50ICYmICh3aWR0aCA8IG5leHRCcmVha3BvaW50IHx8ICFuZXh0QnJlYWtwb2ludCkgJiYgbGFzdEJyZWFrcG9pbnQgIT09IGJyZWFrcG9pbnQpIHx8ICh3aWR0aCA9PT0gYnJlYWtwb2ludCAmJiAhaW5pdGlhbExvYWQpKSB7XG4gICAgICAgIGxhc3RCcmVha3BvaW50ID0gYnJlYWtwb2ludDtcbiAgICAgICAgaW5pdGlhbExvYWQgPSB0cnVlO1xuXG4gICAgICAgIC8vIEZldGNoZXMgYSBzZXQgb2YgZGltZW5zaW9ucyBmb3IgdGhlIGFkIHdoaWNoIGlzIGFib3V0IHRvIGRpc3BsYXkuXG4gICAgICAgIGNvbnN0IHBhcnNlZFNpemVNYXBwaW5nID0gcGFyc2VTaXplTWFwcGluZ3MobWFwcGluZyk7XG5cbiAgICAgICAgY29uc3QgYWRJbmZvID0ge1xuICAgICAgICAgIGFkVW5pdDogYWQsXG4gICAgICAgICAgYWRTbG90OiBzbG90TmFtZSxcbiAgICAgICAgICBhZERpbWVuc2lvbnM6IHBhcnNlZFNpemVNYXBwaW5nLFxuICAgICAgICAgIGFkSWQ6IGlkXG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gSWYgaXQncyBpbmNsdWRlZCBpbiBhIGhlYWRlci1iaWRkaW5nIHNlcnZpY2Ugd2UgcmUtZmV0Y2ggYmlkcyBmb3IgdGhlIGdpdmVuIHNsb3QsIG90aGVyd2lzZSBpdCByZWZyZXNoZXMgYXMgbm9ybWFsLlxuICAgICAgICBpZiAoKGJpZGRpbmcucHJlYmlkICYmIGJpZGRpbmcucHJlYmlkLmVuYWJsZWQpIHx8IChiaWRkaW5nLmFtYXpvbiAmJiBiaWRkaW5nLmFtYXpvbi5lbmFibGVkKSkge1xuICAgICAgICAgIGZldGNoQmlkcyh7XG4gICAgICAgICAgICBhZCxcbiAgICAgICAgICAgIGlkLFxuICAgICAgICAgICAgc2xvdE5hbWUsXG4gICAgICAgICAgICBkaW1lbnNpb25zOiBwYXJzZWRTaXplTWFwcGluZyxcbiAgICAgICAgICAgIGJpZGRpbmcsXG4gICAgICAgICAgICB3cmFwcGVyLFxuICAgICAgICAgICAgcHJlcmVuZGVyLFxuICAgICAgICAgICAgY29ycmVsYXRvcjogc2l6ZW1hcExpc3RlbmVyc1tpZF0uY29ycmVsYXRvcnNbaV1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZWZyZXNoU2xvdCh7XG4gICAgICAgICAgICBhZCxcbiAgICAgICAgICAgIGNvcnJlbGF0b3I6IHNpemVtYXBMaXN0ZW5lcnNbaWRdLmNvcnJlbGF0b3JzW2ldLFxuICAgICAgICAgICAgcHJlcmVuZGVyLFxuICAgICAgICAgICAgaW5mbzogYWRJbmZvXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgc2l6ZW1hcExpc3RlbmVyc1tpZF0uY29ycmVsYXRvcnNbaV0gPSB0cnVlO1xuICAgIH1cbiAgfTtcbn1cblxuLyoqXG4qIEBkZXNjIEFzc2lnbnMgYW4gZXZlbnQgbGlzdGVuZXIgZm9yIGEgc2l6ZSBtYXBwZWQgYWQgd2hpY2ggZGV0ZWN0cyB3aGVuIHRoZSBzY3JlZW4gcmVzaXplcyBwYXN0IGEgYnJlYWtwb2ludCBpbiB0aGUgc2l6ZW1hcC5cbiogQWxzbyBzdG9yZXMgdGhlIGV2ZW50IGxpc3RlbmVyIGluIGFuIG9iamVjdCBzb3J0ZWQgYnkgdGhlIGFkdmVydGlzZW1lbnQgaWQgc28gaXQgY2FuIGJlIHVuYm91bmQgbGF0ZXIgaWYgbmVlZGVkLlxuKiBAcGFyYW0ge29iamVjdH0gcGFyYW1zIC0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgYWxsIG9mIHRoZSBhZHZlcnRpc2VtZW50IGNvbmZpZ3VyYXRpb24gc2V0dGluZ3Mgc3VjaCBhcyBzbG90IG5hbWUsIGlkLCBhbmQgcG9zaXRpb24uXG4qKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRSZXNpemVMaXN0ZW5lcihwYXJhbXMpIHtcbiAgY29uc3QgeyBpZCwgY29ycmVsYXRvcnMgfSA9IHBhcmFtcztcblxuICByZXNpemVMaXN0ZW5lcnNbaWRdID0gZGVib3VuY2UocnVuUmVzaXplRXZlbnRzKHBhcmFtcyksIDI1MCk7XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCByZXNpemVMaXN0ZW5lcnNbaWRdKTtcblxuICAvLyBBZGRzIHRoZSBsaXN0ZW5lciB0byBhbiBvYmplY3Qgd2l0aCB0aGUgaWQgYXMgdGhlIGtleSBzbyB3ZSBjYW4gdW5iaW5kIGl0IGxhdGVyLlxuICBzaXplbWFwTGlzdGVuZXJzW2lkXSA9IHsgbGlzdGVuZXI6IHJlc2l6ZUxpc3RlbmVyc1tpZF0sIGNvcnJlbGF0b3JzIH07XG59XG5cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9zZXJ2aWNlcy9zaXplbWFwcGluZy5qcyIsIi8qKlxuKiBAZGVzYyBEZWJvdW5jZXMgYSBmdW5jdGlvbiBwcmV2ZW50aW5nIGl0IGZyb20gcnVubmluZyBtb3JlIHRoZW4gZXZlcnkgc28gbWFueSBtaWxsaXNlY29uZHMuIFVzZWZ1bCBmb3Igc2Nyb2xsIG9yIHJlc2l6ZSBoYW5kbGVycy5cbiogQHBhcmFtIHtmdW5jdGlvbn0gZnVuYyAtIFRoZSBmdW5jdGlvbiB0aGF0IHNob3VsZCBiZSBkZWJvdW5jZWQuXG4qIEBwYXJhbSB7bnVtYmVyfSB3YWl0IC0gVGhlIGFtb3VudCBvZiB0aW1lIGEgZnVuY3Rpb24gc2hvdWxkIHdhaXQgYmVmb3JlIGl0IGZpcmVzIGFnYWluLlxuKiBAcmV0dXJuIC0gUmV0dXJucyBhIGZ1bmN0aW9uIGV2ZXJ5IHNvIG1hbnkgbWlsbGlzZWNvbmRzIGJhc2VkIG9uIHRoZSBwcm92aWRlZCBwYXJhbWV0ZXJzLlxuKiovXG5leHBvcnQgZnVuY3Rpb24gZGVib3VuY2UoZnVuYywgd2FpdCkge1xuICBsZXQgdGltZW91dDtcbiAgcmV0dXJuIGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgZnVuYy5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9LCB3YWl0KTtcbiAgfTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy91dGlsL2RlYm91bmNlLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==