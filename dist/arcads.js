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

      _prebid.queuePrebidCommand.bind(_this, (0, _prebid.fetchPrebidBids)(ad, id, timeout, adInfo, prerender, function () {
        resolve('Fetched Prebid ads!');
      }));
    } else {
      resolve('Prebid is not enabled on the wrapper...');
    }
  });

  var amazonBids = new Promise(function (resolve) {
    if (wrapper.amazon && wrapper.amazon.enabled) {
      (0, _amazon.fetchAmazonBids)(id, slotName, dimensions, function () {
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

/** @desc Utility class that determines the end users browser user agent. **/
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
* @desc Debounces a function preventing it from running more then every so many millisecdonds. Useful for scroll or resize handelrs.
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBlODA5ZmZhY2RkYTcxMWRiNTNmNiIsIndlYnBhY2s6Ly8vLi9zcmMvc2VydmljZXMvZ3B0LmpzIiwid2VicGFjazovLy8od2VicGFjaykvYnVpbGRpbi9nbG9iYWwuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NlcnZpY2VzL2hlYWRlcmJpZGRpbmcuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWwvcmVzb3VyY2VzLmpzIiwid2VicGFjazovLy8uL3NyYy9zZXJ2aWNlcy9wcmViaWQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsL3BvbHlmaWxscy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHJvbWlzZS1wb2x5ZmlsbC9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RpbWVycy1icm93c2VyaWZ5L21haW4uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3NldGltbWVkaWF0ZS9zZXRJbW1lZGlhdGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHJvbWlzZS1wb2x5ZmlsbC9zcmMvZmluYWxseS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbC9tb2JpbGUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWwvY3VzdG9tVGFyZ2V0aW5nLmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsL3F1ZXJ5LmpzIiwid2VicGFjazovLy8uL3NyYy9zZXJ2aWNlcy9hbWF6b24uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NlcnZpY2VzL3NpemVtYXBwaW5nLmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsL2RlYm91bmNlLmpzIl0sIm5hbWVzIjpbImluaXRpYWxpemVHUFQiLCJyZWZyZXNoU2xvdCIsInF1ZXVlR29vZ2xldGFnQ29tbWFuZCIsInNldFRhcmdldGluZyIsImRmcFNldHRpbmdzIiwiZGV0ZXJtaW5lU2xvdE5hbWUiLCJ3aW5kb3ciLCJnb29nbGV0YWciLCJjbWQiLCJhZCIsImNvcnJlbGF0b3IiLCJwcmVyZW5kZXIiLCJpbmZvIiwiUHJvbWlzZSIsInJlc29sdmUiLCJ0aGVuIiwiZXJyb3IiLCJjb25zb2xlIiwid2FybiIsInJ1blJlZnJlc2hFdmVudCIsInB1YmFkc1JlYWR5IiwicHViYWRzIiwicmVmcmVzaCIsImNoYW5nZUNvcnJlbGF0b3IiLCJzZXRUaW1lb3V0IiwiZm4iLCJwdXNoIiwib3B0aW9ucyIsImtleSIsImhhc093blByb3BlcnR5IiwiaGFuZGxlU2xvdFJlbmRlckVuZGVkIiwiZGlzYWJsZUluaXRpYWxMb2FkIiwiZW5hYmxlU2luZ2xlUmVxdWVzdCIsImVuYWJsZUFzeW5jUmVuZGVyaW5nIiwiZW5hYmxlU2VydmljZXMiLCJhZGRFdmVudExpc3RlbmVyIiwiZGZwQ29kZSIsInNsb3ROYW1lIiwic2xvdE92ZXJyaWRlIiwiaW5pdGlhbGl6ZUJpZGRpbmdTZXJ2aWNlcyIsImZldGNoQmlkcyIsInByZWJpZCIsImFtYXpvbiIsImFyY0JpZGRpbmdSZWFkeSIsImVuYWJsZVByZWJpZCIsImVuYWJsZWQiLCJwYmpzIiwicXVlIiwiZW5hYmxlQW1hem9uIiwiaWQiLCJhcHN0YWciLCJpbml0IiwicHViSUQiLCJhZFNlcnZlciIsImFsbCIsImRpbWVuc2lvbnMiLCJ3cmFwcGVyIiwiYmlkZGluZyIsImFkSW5mbyIsImFkVW5pdCIsImFkU2xvdCIsImFkRGltZW5zaW9ucyIsImFkSWQiLCJwcmViaWRCaWRzIiwidGltZW91dCIsInF1ZXVlUHJlYmlkQ29tbWFuZCIsImJpbmQiLCJhbWF6b25CaWRzIiwiYXBwZW5kUmVzb3VyY2UiLCJ0YWduYW1lIiwidXJsIiwiYXN5bmMiLCJkZWZlciIsImNiIiwidGFnIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50Iiwic3JjIiwiaGVhZCIsImRvY3VtZW50RWxlbWVudCIsImFwcGVuZENoaWxkIiwiZmV0Y2hQcmViaWRCaWRzIiwiYWRkVW5pdCIsInJlcXVlc3RCaWRzIiwiYWRVbml0Q29kZXMiLCJiaWRzQmFja0hhbmRsZXIiLCJzZXRUYXJnZXRpbmdGb3JHUFRBc3luYyIsImNvZGUiLCJzaXplcyIsImJpZHMiLCJzbG90Iiwic2l6ZUNvbmZpZyIsImFkZEFkVW5pdHMiLCJzZXRDb25maWciLCJBcmNBZHMiLCJoYW5kbGVTbG90UmVuZGVyZWQiLCJkZnBJZCIsImRmcCIsInBvc2l0aW9ucyIsImlzTW9iaWxlIiwiTW9iaWxlRGV0ZWN0aW9uIiwicGFyYW1zIiwiYWRUeXBlIiwidGFyZ2V0aW5nIiwiZGlzcGxheSIsInBvc2l0aW9uIiwiYXMiLCJPYmplY3QiLCJhc3NpZ24iLCJwb3NpdGlvblBhcmFtIiwiYW55IiwiZGlzcGxheUFkIiwiY29sbGVjdGlvbiIsImZvckVhY2giLCJhZHZlcnQiLCJyZWdpc3RlckFkIiwic2l6ZW1hcCIsImZ1bGxTbG90TmFtZSIsInBhcnNlZERpbWVuc2lvbnMiLCJsZW5ndGgiLCJKU09OIiwicGFyc2UiLCJkZWZpbmVPdXRPZlBhZ2VTbG90IiwiZGVmaW5lU2xvdCIsImJyZWFrcG9pbnRzIiwibWFwcGluZyIsImNvcnJlbGF0b3JzIiwiZGVmaW5lU2l6ZU1hcHBpbmciLCJhZGRTZXJ2aWNlIiwiZGVmaW5lUHJvcGVydHkiLCJ2YWx1ZSIsInRhcmdldCIsInZhckFyZ3MiLCJUeXBlRXJyb3IiLCJ0byIsImluZGV4IiwiYXJndW1lbnRzIiwibmV4dFNvdXJjZSIsIm5leHRLZXkiLCJwcm90b3R5cGUiLCJjYWxsIiwid3JpdGFibGUiLCJjb25maWd1cmFibGUiLCJuYXZpZ2F0b3IiLCJ1c2VyQWdlbnQiLCJtYXRjaCIsInJldGluYSIsImRldmljZVBpeGVsUmF0aW8iLCJBbmRyb2lkIiwiS2luZGxlIiwiS2luZGxlRmlyZSIsIlNpbGsiLCJCbGFja0JlcnJ5IiwiaU9TIiwiV2luZG93cyIsIkZpcmVmb3hPUyIsInJlbmFtZVBvc2l0aW9uS2V5IiwicG9zaXRpb25WYWx1ZSIsIm5ld1RhcmdldGluZ09iamVjdCIsImtleU5hbWUiLCJleHBhbmRRdWVyeVN0cmluZyIsInBhcmFtIiwibG9jYXRpb24iLCJocmVmIiwibmFtZSIsInJlcGxhY2UiLCJyZWdleCIsIlJlZ0V4cCIsInJlc3VsdHMiLCJleGVjIiwiZGVjb2RlVVJJQ29tcG9uZW50IiwiZmV0Y2hBbWF6b25CaWRzIiwicXVldWVBbWF6b25Db21tYW5kIiwic2xvdElEIiwic2xvdHMiLCJzZXREaXNwbGF5QmlkcyIsInByZXBhcmVTaXplTWFwcyIsInBhcnNlU2l6ZU1hcHBpbmdzIiwicnVuUmVzaXplRXZlbnRzIiwic2V0UmVzaXplTGlzdGVuZXIiLCJzaXplbWFwTGlzdGVuZXJzIiwicmVzaXplTGlzdGVuZXJzIiwicGFyc2VkU2l6ZW1hcCIsImluZGV4T2YiLCJzb3J0IiwiYSIsImIiLCJzaXplTWFwcGluZ3MiLCJ3aWR0aCIsImlubmVyV2lkdGgiLCJjbGllbnRXaWR0aCIsImJvZHkiLCJoZWlnaHQiLCJpbm5lckhlaWdodCIsImNsaWVudEhlaWdodCIsInNkIiwidmFsaWRNYXBwaW5ncyIsImZpbHRlciIsInJlc3VsdCIsImNvbnN0cnVjdG9yIiwiQXJyYXkiLCJlIiwibGFzdEJyZWFrcG9pbnQiLCJpbml0aWFsTG9hZCIsImJyZWFrcG9pbnQiLCJuZXh0QnJlYWtwb2ludCIsImkiLCJwYXJzZWRTaXplTWFwcGluZyIsImxpc3RlbmVyIiwiZGVib3VuY2UiLCJmdW5jIiwid2FpdCIsImFyZ3MiLCJjbGVhclRpbWVvdXQiLCJhcHBseSJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FB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QUFVO0FBQ1Y7QUFDQTs7QUFFQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDOzs7Ozs7OztBQ3pMRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLHNCQUFzQjtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QUFBLE1BQzVCNkUsV0FENEIsR0FDWnpCLE1BRFksQ0FDNUJ5QixXQUQ0Qjs7O0FBR3hDdUQsa0JBQWdCcEksRUFBaEIsSUFBc0Isd0JBQVNpSSxnQkFBZ0I3RSxNQUFoQixDQUFULEVBQWtDLEdBQWxDLENBQXRCO0FBQ0EvRixTQUFPNkIsZ0JBQVAsQ0FBd0IsUUFBeEIsRUFBa0NrSixnQkFBZ0JwSSxFQUFoQixDQUFsQzs7QUFFQTtBQUNBbUksbUJBQWlCbkksRUFBakIsSUFBdUIsRUFBRStKLFVBQVUzQixnQkFBZ0JwSSxFQUFoQixDQUFaLEVBQWlDNkUsd0JBQWpDLEVBQXZCO0FBQ0QsQzs7Ozs7Ozs7Ozs7O1FDdEplbUYsUSxHQUFBQSxRO0FBTmhCOzs7Ozs7QUFNTyxTQUFTQSxRQUFULENBQWtCQyxJQUFsQixFQUF3QkMsSUFBeEIsRUFBOEI7QUFDbkMsTUFBSW5KLGdCQUFKO0FBQ0EsU0FBTyxZQUFtQjtBQUFBOztBQUFBLHNDQUFOb0osSUFBTTtBQUFOQSxVQUFNO0FBQUE7O0FBQ3hCQyxpQkFBYXJKLE9BQWI7QUFDQUEsY0FBVXhDLFdBQVcsWUFBTTtBQUN6QndDLGdCQUFVLElBQVY7QUFDQWtKLFdBQUtJLEtBQUwsUUFBaUJGLElBQWpCO0FBQ0QsS0FIUyxFQUdQRCxJQUhPLENBQVY7QUFJRCxHQU5EO0FBT0QsQyIsImZpbGUiOiJhcmNhZHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2Uge1xuXHRcdHZhciBhID0gZmFjdG9yeSgpO1xuXHRcdGZvcih2YXIgaSBpbiBhKSAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnID8gZXhwb3J0cyA6IHJvb3QpW2ldID0gYVtpXTtcblx0fVxufSkodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnID8gc2VsZiA6IHRoaXMsIGZ1bmN0aW9uKCkge1xucmV0dXJuIFxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA1KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBlODA5ZmZhY2RkYTcxMWRiNTNmNiIsImltcG9ydCB7IGFwcGVuZFJlc291cmNlIH0gZnJvbSAnLi4vdXRpbC9yZXNvdXJjZXMnO1xuaW1wb3J0IHsgZXhwYW5kUXVlcnlTdHJpbmcgfSBmcm9tICcuLi91dGlsL3F1ZXJ5JztcblxuLyoqXG4qIEBkZXNjIEluaXRpYWxpemVzIHRoZSBHb29nbGUgUHVibGlzaGVyIHRhZyBzY3JpcHRzLlxuKiovXG5leHBvcnQgZnVuY3Rpb24gaW5pdGlhbGl6ZUdQVCgpIHtcbiAgd2luZG93Lmdvb2dsZXRhZyA9IHdpbmRvdy5nb29nbGV0YWcgfHwge307XG4gIHdpbmRvdy5nb29nbGV0YWcuY21kID0gd2luZG93Lmdvb2dsZXRhZy5jbWQgfHwgW107XG5cbiAgYXBwZW5kUmVzb3VyY2UoJ3NjcmlwdCcsICcvL3d3dy5nb29nbGV0YWdzZXJ2aWNlcy5jb20vdGFnL2pzL2dwdC5qcycsIHRydWUsIHRydWUpO1xufVxuXG4vKipcbiogQGRlc2MgUmVmcmVzaGVzIGFuIGFkdmVydGlzZW1lbnQgdmlhIHRoZSBHUFQgcmVmcmVzaCBtZXRob2QuIElmIGEgcHJlcmVuZGVyIGZ1bmN0aW9uIGlzIHByb3ZpZGVkIGl0IGlzIGV4ZWN1dGVkIHByaW9yIHRvIHRoZSByZWZyZXNoLlxuKiBAcGFyYW0ge29iamVjdH0gb2JqIC0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgYWxsIG9mIHRoZSBmdW5jdGlvbiBhcmd1bWVudHMuXG4qIEBwYXJhbSB7T2JqZWN0fSBvYmouYWQgLSBBbiBvYmplY3QgY29udGFpbmluZyB0aGUgR1BUIGFkIHNsb3QuXG4qIEBwYXJhbSB7Ym9vbGVhbn0gb2JqLmNvcnJlbGF0b3IgLSBBbiBvcHRpb25hbCBib29sZWFuIHRoYXQgZGVzY3JpYmVzIGlmIHRoZSBjb3JyZWxhdG9yIHZhbHVlIHNob3VsZCB1cGRhdGUgb3Igbm90LlxuKiBAcGFyYW0ge2Z1bmN0aW9ufSBvYmoucHJlcmVuZGVyIC0gQW4gb3B0aW9uYWwgZnVuY3Rpb24gdGhhdCB3aWxsIHJ1biBiZWZvcmUgdGhlIGFkdmVydGlzZW1lbnQgcmVuZGVycy5cbiogQHBhcmFtIHtvYmplY3R9IG9iai5pbmZvIC0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGFkdmVydGlzZW1lbnQgdGhhdCBpcyBhYm91dCB0byBsb2FkLlxuKiovXG5leHBvcnQgZnVuY3Rpb24gcmVmcmVzaFNsb3Qoe1xuICBhZCxcbiAgY29ycmVsYXRvciA9IGZhbHNlLFxuICBwcmVyZW5kZXIgPSBudWxsLFxuICBpbmZvID0ge31cbn0pIHtcbiAgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBpZiAocHJlcmVuZGVyKSB7XG4gICAgICB0cnkge1xuICAgICAgICBwcmVyZW5kZXIoaW5mbykudGhlbigoKSA9PiB7XG4gICAgICAgICAgcmVzb2x2ZSgnUHJlcmVuZGVyIGZ1bmN0aW9uIGhhcyBjb21wbGV0ZWQuJyk7XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS53YXJuKGBBcmNBZHM6IFByZXJlbmRlciBmdW5jdGlvbiBkaWQgbm90IHJldHVybiBhIHByb21pc2Ugb3IgdGhlcmUgd2FzIGFuIGVycm9yLlxuICAgICAgICAgIERvY3VtZW50YXRpb246IGh0dHBzOi8vZ2l0aHViLmNvbS93YXBvcGFydG5lcnMvYXJjLWFkcy93aWtpL1V0aWxpemluZy1hLVByZXJlbmRlci1Ib29rYCk7XG4gICAgICAgIHJlc29sdmUoJ1ByZXJlbmRlciBmdW5jdGlvbiBkaWQgbm90IHJldHVybiBhIHByb21pc2Ugb3IgdGhlcmUgd2FzIGFuIGVycm9yLCBpZ25vcmluZy4nKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmVzb2x2ZSgnTm8gUHJlcmVuZGVyIGZ1bmN0aW9uIHdhcyBwcm92aWRlZC4nKTtcbiAgICB9XG4gIH0pLnRoZW4oKCkgPT4ge1xuICAgIHJ1blJlZnJlc2hFdmVudCgpO1xuICB9KTtcblxuICBmdW5jdGlvbiBydW5SZWZyZXNoRXZlbnQoKSB7XG4gICAgaWYgKHdpbmRvdy5nb29nbGV0YWcgJiYgZ29vZ2xldGFnLnB1YmFkc1JlYWR5KSB7XG4gICAgICB3aW5kb3cuZ29vZ2xldGFnLnB1YmFkcygpLnJlZnJlc2goW2FkXSwgeyBjaGFuZ2VDb3JyZWxhdG9yOiBjb3JyZWxhdG9yIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgcnVuUmVmcmVzaEV2ZW50KCk7XG4gICAgICB9LCAyMDApO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiogQGRlc2MgUXVldWVzIGEgY29tbWFuZCBpbnNpZGUgb2YgR1BULlxuKiBAcGFyYW0ge2Z1bmN0aW9ufSBmbiAtIEFjY2VwdHMgYSBmdW5jdGlvbiB0byBwdXNoIGludG8gdGhlIFByZWJpZCBjb21tYW5kIHF1ZXVlLlxuKiovXG5leHBvcnQgZnVuY3Rpb24gcXVldWVHb29nbGV0YWdDb21tYW5kKGZuKSB7XG4gIHdpbmRvdy5nb29nbGV0YWcuY21kLnB1c2goZm4pO1xufVxuXG4vKipcbiogQGRlc2MgQXNzaWducyBrZXkvdmFsdWUgdGFyZ2V0aW5nIHRvIGEgc3BlY2lmaWMgYWR2ZXJ0aXNlbWVudC5cbiogQHBhcmFtIHtPYmplY3R9IGFkIC0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIEdQVCBhZCBzbG90LlxuKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIEFuIG9iamVjdCBjb250YWluaW5nIGFsbCBvZiB0aGUga2V5L3ZhbHVlIHRhcmdldGluZyBwYWlycyB0byBhc3NpZ24gdG8gdGhlIGFkdmVydGlzZW1lbnQuXG4qKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRUYXJnZXRpbmcoYWQsIG9wdGlvbnMpIHtcbiAgZm9yIChjb25zdCBrZXkgaW4gb3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zLmhhc093blByb3BlcnR5KGtleSkgJiYgb3B0aW9uc1trZXldKSB7XG4gICAgICBhZC5zZXRUYXJnZXRpbmcoa2V5LCBvcHRpb25zW2tleV0pO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiogQGRlc2MgQ29uZmlndXJlcyB0aGUgR1BUIGNvbmZpZ3VyYXRpb24gb3B0aW9ucy5cbiogQHBhcmFtIHtmdW5jdGlvbn0gaGFuZGxlU2xvdFJlbmRlckVuZGVkIC0gQ2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBnZXRzIGZpcmVkIHdoZW5ldmVyIGEgR1BUIGFkIHNsb3QgaGFzIGZpbmlzaGVkIHJlbmRlcmluZy5cbioqL1xuZXhwb3J0IGZ1bmN0aW9uIGRmcFNldHRpbmdzKGhhbmRsZVNsb3RSZW5kZXJFbmRlZCkge1xuICB3aW5kb3cuZ29vZ2xldGFnLnB1YmFkcygpLmRpc2FibGVJbml0aWFsTG9hZCgpO1xuICB3aW5kb3cuZ29vZ2xldGFnLnB1YmFkcygpLmVuYWJsZVNpbmdsZVJlcXVlc3QoKTtcbiAgd2luZG93Lmdvb2dsZXRhZy5wdWJhZHMoKS5lbmFibGVBc3luY1JlbmRlcmluZygpO1xuICB3aW5kb3cuZ29vZ2xldGFnLmVuYWJsZVNlcnZpY2VzKCk7XG5cbiAgaWYgKGhhbmRsZVNsb3RSZW5kZXJFbmRlZCkge1xuICAgIHdpbmRvdy5nb29nbGV0YWcucHViYWRzKCkuYWRkRXZlbnRMaXN0ZW5lcignc2xvdFJlbmRlckVuZGVkJywgaGFuZGxlU2xvdFJlbmRlckVuZGVkKTtcbiAgfVxufVxuXG4vKipcbiogQGRlc2MgRGV0ZXJtaW5lcyB0aGUgZnVsbCBzbG90IG5hbWUgb2YgdGhlIGFkIHVuaXQuIElmIGEgdXNlciBhcHBlbmRzIGFuICdhZHNsb3QnIHF1ZXJ5IHBhcmFtZXRlciB0byB0aGUgcGFnZSBVUkwgdGhlIHNsb3QgbmFtZSB3aWxsIGJlIHZlcnJpZGRlbi5cbiogQHBhcmFtIHtzdHJpbmd9IGRmcENvZGUgLSBBIHN0cmluZyBjb250YWluaW5nIHRoZSBwdWJsaXNoZXJzIERGUCBpZCBjb2RlLlxuKiBAcGFyYW0ge3N0cmluZ30gc2xvdE5hbWUgLSBBIHN0cmluZyBjb250YWluaW5nIHRoZSBzbG90IG5hbWUgb2YgdGhlIGFkdmVydGlzZW1lbnQsIGZvciBleGFtcGxlICdob21lcGFnZScuXG4qIEByZXR1cm4gLSBSZXR1cm5zIGEgc3RyaW5nIGNvbWJpbmluZyB0aGUgREZQIGlkIGNvZGUgYW5kIHRoZSBzbG90IG5hbWUsIGZvciBleGFtcGxlICcxMjMvaG9tZXBhZ2UnLlxuKiovXG5leHBvcnQgZnVuY3Rpb24gZGV0ZXJtaW5lU2xvdE5hbWUoZGZwQ29kZSwgc2xvdE5hbWUpIHtcbiAgY29uc3Qgc2xvdE92ZXJyaWRlID0gZXhwYW5kUXVlcnlTdHJpbmcoJ2Fkc2xvdCcpO1xuICBpZiAoc2xvdE92ZXJyaWRlICYmIChzbG90T3ZlcnJpZGUgIT09ICcnIHx8IHNsb3RPdmVycmlkZSAhPT0gbnVsbCkpIHtcbiAgICByZXR1cm4gYCR7ZGZwQ29kZX0vJHtzbG90T3ZlcnJpZGV9YDtcbiAgfVxuICByZXR1cm4gYCR7ZGZwQ29kZX0vJHtzbG90TmFtZX1gO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3NlcnZpY2VzL2dwdC5qcyIsInZhciBnO1xyXG5cclxuLy8gVGhpcyB3b3JrcyBpbiBub24tc3RyaWN0IG1vZGVcclxuZyA9IChmdW5jdGlvbigpIHtcclxuXHRyZXR1cm4gdGhpcztcclxufSkoKTtcclxuXHJcbnRyeSB7XHJcblx0Ly8gVGhpcyB3b3JrcyBpZiBldmFsIGlzIGFsbG93ZWQgKHNlZSBDU1ApXHJcblx0ZyA9IGcgfHwgRnVuY3Rpb24oXCJyZXR1cm4gdGhpc1wiKSgpIHx8ICgxLGV2YWwpKFwidGhpc1wiKTtcclxufSBjYXRjaChlKSB7XHJcblx0Ly8gVGhpcyB3b3JrcyBpZiB0aGUgd2luZG93IHJlZmVyZW5jZSBpcyBhdmFpbGFibGVcclxuXHRpZih0eXBlb2Ygd2luZG93ID09PSBcIm9iamVjdFwiKVxyXG5cdFx0ZyA9IHdpbmRvdztcclxufVxyXG5cclxuLy8gZyBjYW4gc3RpbGwgYmUgdW5kZWZpbmVkLCBidXQgbm90aGluZyB0byBkbyBhYm91dCBpdC4uLlxyXG4vLyBXZSByZXR1cm4gdW5kZWZpbmVkLCBpbnN0ZWFkIG9mIG5vdGhpbmcgaGVyZSwgc28gaXQnc1xyXG4vLyBlYXNpZXIgdG8gaGFuZGxlIHRoaXMgY2FzZS4gaWYoIWdsb2JhbCkgeyAuLi59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGc7XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vICh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBhcHBlbmRSZXNvdXJjZSB9IGZyb20gJy4uL3V0aWwvcmVzb3VyY2VzJztcbmltcG9ydCB7IGZldGNoUHJlYmlkQmlkcywgcXVldWVQcmViaWRDb21tYW5kIH0gZnJvbSAnLi9wcmViaWQnO1xuaW1wb3J0IHsgZmV0Y2hBbWF6b25CaWRzLCBxdWV1ZUFtYXpvbkNvbW1hbmQgfSBmcm9tICcuL2FtYXpvbic7XG5pbXBvcnQgeyByZWZyZXNoU2xvdCB9IGZyb20gJy4vZ3B0JztcblxuLyoqXG4qIEBkZXNjIEluaXRpYWxpemVzIGFsbCBoZWFkZXIgYmlkZGluZyBzZXJ2aWNlcyBhbmQgYXBwZW5kcyB0aGUgYXBwbGljYWJsZSBzY3JpcHRzIHRvIHRoZSBwYWdlLlxuKiBAcGFyYW0ge29iamVjdH0gb2JqIC0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgYWxsIG9mIHRoZSBmdW5jdGlvbiBhcmd1bWVudHMuXG4qIEBwYXJhbSB7b2JqZWN0fSBvYmoucHJlYmlkIC0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgY29uZmlndXJhdGlvbiBkYXRhIGZvciBQcmViaWQuanMuXG4qIEBwYXJhbSB7b2JqZWN0fSBvYmouYW1hem9uIC0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgY29uZmlndXJhdGlvbiBkYXRhIGZvciBBbWF6b24gQTkgYW5kIFRBTS5cbioqL1xuZXhwb3J0IGZ1bmN0aW9uIGluaXRpYWxpemVCaWRkaW5nU2VydmljZXMoe1xuICBwcmViaWQgPSBmYWxzZSxcbiAgYW1hem9uID0gZmFsc2Vcbn0pIHtcbiAgd2luZG93LmFyY0JpZGRpbmdSZWFkeSA9IGZhbHNlO1xuXG4gIGNvbnN0IGVuYWJsZVByZWJpZCA9IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgaWYgKHByZWJpZCAmJiBwcmViaWQuZW5hYmxlZCkge1xuICAgICAgY29uc3QgcGJqcyA9IHBianMgfHwge307XG4gICAgICBwYmpzLnF1ZSA9IHBianMucXVlIHx8IFtdO1xuXG4gICAgICByZXNvbHZlKCdQcmViaWQgaGFzIGJlZW4gaW5pdGlhbGl6ZWQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzb2x2ZSgnUHJlYmlkIGlzIG5vdCBlbmFibGVkIG9uIHRoZSB3cmFwcGVyLi4uJyk7XG4gICAgfVxuICB9KTtcblxuICBjb25zdCBlbmFibGVBbWF6b24gPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIGlmIChhbWF6b24gJiYgYW1hem9uLmVuYWJsZWQpIHtcbiAgICAgIGFwcGVuZFJlc291cmNlKCdzY3JpcHQnLCAnLy9jLmFtYXpvbi1hZHN5c3RlbS5jb20vYWF4Mi9hcHN0YWcuanMnLCB0cnVlLCB0cnVlLCAoKSA9PiB7XG4gICAgICAgIGlmIChhbWF6b24uaWQgJiYgYW1hem9uLmlkICE9PSAnJykge1xuICAgICAgICAgIHF1ZXVlQW1hem9uQ29tbWFuZCgoKSA9PiB7XG4gICAgICAgICAgICAvLyBJbml0aWFsaXplcyB0aGUgQW1hem9uIEFQUyB0YWcgc2NyaXB0LlxuICAgICAgICAgICAgd2luZG93LmFwc3RhZy5pbml0KHtcbiAgICAgICAgICAgICAgcHViSUQ6IGFtYXpvbi5pZCxcbiAgICAgICAgICAgICAgYWRTZXJ2ZXI6ICdnb29nbGV0YWcnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmVzb2x2ZSgnQW1hem9uIHNjcmlwdHMgaGF2ZSBiZWVuIGFkZGVkIG9udG8gdGhlIHBhZ2UhJyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKGBBcmNBZHM6IE1pc3NpbmcgQW1hem9uIGFjY291bnQgaWQuIFxuICAgICAgICAgICAgRG9jdW1lbnRhdGlvbjogaHR0cHM6Ly9naXRodWIuY29tL3dhcG9wYXJ0bmVycy9hcmMtYWRzI2FtYXpvbi10YW1hOWApO1xuICAgICAgICAgIHJlc29sdmUoJ0FtYXpvbiBpcyBub3QgZW5hYmxlZCBvbiB0aGUgd3JhcHBlci4uLicpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzb2x2ZSgnQW1hem9uIGlzIG5vdCBlbmFibGVkIG9uIHRoZSB3cmFwcGVyLi4uJyk7XG4gICAgfVxuICB9KTtcblxuICAvLyBXYWl0cyBmb3IgYWxsIGhlYWRlciBiaWRkaW5nIHNlcnZpY2VzIHRvIGJlIGluaXRpYWxpemVkIGJlZm9yZSB0ZWxsaW5nIHRoZSBzZXJ2aWNlIGl0J3MgcmVhZHkgdG8gcmV0cmlldmUgYmlkcy5cbiAgUHJvbWlzZS5hbGwoW2VuYWJsZVByZWJpZCwgZW5hYmxlQW1hem9uXSlcbiAgICAudGhlbigoKSA9PiB7XG4gICAgICB3aW5kb3cuYXJjQmlkZGluZ1JlYWR5ID0gdHJ1ZTtcbiAgICB9KTtcbn1cblxuLyoqXG4qIEBkZXNjIEZldGNoZXMgYSBiaWQgZm9yIGFuIGFkdmVydGlzZW1lbnQgYmFzZWQgb24gd2hpY2ggc2VydmljZXMgYXJlIGVuYWJsZWQgb24gdW5pdCBhbmQgdGhlIHdyYXBwZXIuXG4qIEBwYXJhbSB7b2JqZWN0fSBvYmogLSBBbiBvYmplY3QgY29udGFpbmluZyBhbGwgb2YgdGhlIGZ1bmN0aW9uIGFyZ3VtZW50cy5cbiogQHBhcmFtIHtPYmplY3R9IG9iai5hZCAtIEFuIG9iamVjdCBjb250YWluaW5nIHRoZSBHUFQgYWQgc2xvdC5cbiogQHBhcmFtIHtzdHJpbmd9IG9iai5pZCAtIEEgc3RyaW5nIGNvbnRhaW5pbmcgdGhlIGFkdmVydGlzZW1lbnQgaWQgY29ycmVzcG9uZGluZyB0byB0aGUgZGl2IHRoZSBhZHZlcnRpc2VtZW50IHdpbGwgbG9hZCBpbnRvLlxuKiBAcGFyYW0ge3N0cmluZ30gb2JqLnNsb3ROYW1lIC0gQSBzdHJpbmcgY29udGFpbmluZyB0aGUgc2xvdCBuYW1lIG9mIHRoZSBhZHZlcnRpc2VtZW50LCBmb3IgaW5zdGFuY2UgJzEyMzQvYWRuLmNvbS9ob21lcGFnZScuXG4qIEBwYXJhbSB7QXJyYXl9IG9iai5kaW1lbnNpb25zIC0gQW4gYXJyYXkgY29udGFpbmluZyBhbGwgb2YgdGhlIGFwcGxpY2FibGUgc2l6ZXMgdGhlIGFkdmVydGlzZW1lbnQgY2FuIHVzZS5cbiogQHBhcmFtIHtPYmplY3R9IG9iai53cmFwcGVyIC0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgYWxsIG9mIHRoZSB3cmFwcGVyIHNldHRpbmdzLlxuKiBAcGFyYW0ge0FycmF5fSBvYmouYmlkZGluZyAtIENvbnRhaW5zIGFsbCBvZiB0aGUgYXBwbGljYWJsZSBiaWQgZGF0YSwgc3VjaCBhcyB3aGljaCB2ZW5kb3JzIHRvIHVzZSBhbmQgdGhlaXIgcGxhY2VtZW50IGlkcy5cbiogQHBhcmFtIHtib29sZWFufSBvYmouY29ycmVsYXRvciAtIEFuIG9wdGlvbmFsIGJvb2xlYW4gdGhhdCBkZXNjcmliZXMgaWYgdGhlIGNvcnJlbGF0b3IgdmFsdWUgc2hvdWxkIHVwZGF0ZSBvciBub3QuXG4qIEBwYXJhbSB7ZnVuY3Rpb259IG9iai5wcmVyZW5kZXIgLSBBbiBvcHRpb25hbCBmdW5jdGlvbiB0aGF0IHdpbGwgcnVuIGJlZm9yZSB0aGUgYWR2ZXJ0aXNlbWVudCByZW5kZXJzLlxuKiovXG5leHBvcnQgZnVuY3Rpb24gZmV0Y2hCaWRzKHtcbiAgYWQsXG4gIGlkLFxuICBzbG90TmFtZSxcbiAgZGltZW5zaW9ucyxcbiAgd3JhcHBlcixcbiAgYmlkZGluZyxcbiAgY29ycmVsYXRvciA9IGZhbHNlLFxuICBwcmVyZW5kZXJcbn0pIHtcbiAgY29uc3QgYWRJbmZvID0ge1xuICAgIGFkVW5pdDogYWQsXG4gICAgYWRTbG90OiBzbG90TmFtZSxcbiAgICBhZERpbWVuc2lvbnM6IGRpbWVuc2lvbnMsXG4gICAgYWRJZDogaWRcbiAgfTtcblxuICBjb25zdCBwcmViaWRCaWRzID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBpZiAod3JhcHBlci5wcmViaWQgJiYgd3JhcHBlci5wcmViaWQuZW5hYmxlZCkge1xuICAgICAgY29uc3QgdGltZW91dCA9IHdyYXBwZXIucHJlYmlkLnRpbWVvdXQgfHwgNzAwO1xuXG4gICAgICBxdWV1ZVByZWJpZENvbW1hbmQuYmluZCh0aGlzLCBmZXRjaFByZWJpZEJpZHMoYWQsIGlkLCB0aW1lb3V0LCBhZEluZm8sIHByZXJlbmRlciwgKCkgPT4ge1xuICAgICAgICByZXNvbHZlKCdGZXRjaGVkIFByZWJpZCBhZHMhJyk7XG4gICAgICB9KSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc29sdmUoJ1ByZWJpZCBpcyBub3QgZW5hYmxlZCBvbiB0aGUgd3JhcHBlci4uLicpO1xuICAgIH1cbiAgfSk7XG5cbiAgY29uc3QgYW1hem9uQmlkcyA9IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgaWYgKHdyYXBwZXIuYW1hem9uICYmIHdyYXBwZXIuYW1hem9uLmVuYWJsZWQpIHtcbiAgICAgIGZldGNoQW1hem9uQmlkcyhpZCwgc2xvdE5hbWUsIGRpbWVuc2lvbnMsICgpID0+IHtcbiAgICAgICAgcmVzb2x2ZSgnRmV0Y2hlZCBBbWF6b24gYWRzIScpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc29sdmUoJ0FtYXpvbiBpcyBub3QgZW5hYmxlZCBvbiB0aGUgd3JhcHBlci4uLicpO1xuICAgIH1cbiAgfSk7XG5cbiAgaWYgKHdpbmRvdy5hcmNCaWRkaW5nUmVhZHkpIHtcbiAgICBQcm9taXNlLmFsbChbcHJlYmlkQmlkcywgYW1hem9uQmlkc10pXG4gICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgIHJlZnJlc2hTbG90KHtcbiAgICAgICAgICBhZCxcbiAgICAgICAgICBjb3JyZWxhdG9yLFxuICAgICAgICAgIHByZXJlbmRlcixcbiAgICAgICAgICBpbmZvOiBhZEluZm9cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGZldGNoQmlkcyh7XG4gICAgICAgIGFkLFxuICAgICAgICBpZCxcbiAgICAgICAgc2xvdE5hbWUsXG4gICAgICAgIGRpbWVuc2lvbnMsXG4gICAgICAgIHdyYXBwZXIsXG4gICAgICAgIGJpZGRpbmcsXG4gICAgICAgIGNvcnJlbGF0b3IsXG4gICAgICAgIHByZXJlbmRlclxuICAgICAgfSk7XG4gICAgfSwgMjAwKTtcbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3NlcnZpY2VzL2hlYWRlcmJpZGRpbmcuanMiLCIvKipcbiogQGRlc2MgQXBwZW5kcyBhIHJlbW90ZSByZXNvdXJjZSB0byB0aGUgcGFnZSB3aXRoaW4gYSBIVE1MIHRhZy5cbiogQHBhcmFtIHtzdHJpbmd9IHRhZ25hbWUgLSBBIHN0cmluZyBjb250YWluaW5nIHRoZSB0eXBlIG9mIEhUTUwgdGFnIHRoYXQgc2hvdWxkIGJlIGFwcGVuZGVkLlxuKiBAcGFyYW0ge3N0cmluZ30gdXJsIC0gQSBzdHJpbmcgY29udGFpbmluZyB0aGUgcGF0aCBvZiB0aGUgcmVzb3VyY2UuXG4qIEBwYXJhbSB7Ym9vbGVhbn0gYXN5bmMgLSBBIGJvb2xlYW4gcmVwcmVzZW50aW5nIGlmIHRoZSByZXNvdXJjZSBzaG91bGQgYmUgbG9hZGVkIGFzeW5jaHJvbm91c2x5IG9yIG5vdC5cbiogQHBhcmFtIHtib29sZWFufSBkZWZlciAtIEEgYm9vbGVhbiByZXByZXNlbnRpbmcgaWYgdGhlIHJlc291cmNlIHNob3VsZCBiZSBkZWZlcnJlZCBvciBub3QuXG4qIEBwYXJhbSB7ZnVuY3Rpb259IGNiIC0gQW4gb3B0aW9uYWwgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBzaG91bGQgZmlyZSB3aGVuZXZlciB0aGUgcmVzb3VyY2UgaGFzIGJlZW4gYXBwZW5kZWQuXG4qKi9cbmV4cG9ydCBmdW5jdGlvbiBhcHBlbmRSZXNvdXJjZSh0YWduYW1lLCB1cmwsIGFzeW5jLCBkZWZlciwgY2IpIHtcbiAgY29uc3QgdGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWduYW1lKTtcbiAgaWYgKHRhZ25hbWUgPT09ICdzY3JpcHQnKSB7XG4gICAgdGFnLnNyYyA9IHVybDtcbiAgICB0YWcuYXN5bmMgPSBhc3luYyB8fCBmYWxzZTtcbiAgICB0YWcuZGVmZXIgPSBhc3luYyB8fCBkZWZlciB8fCBmYWxzZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm47XG4gIH1cbiAgKGRvY3VtZW50LmhlYWQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KS5hcHBlbmRDaGlsZCh0YWcpO1xuXG4gIGlmIChjYikge1xuICAgIGNiKCk7XG4gIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy91dGlsL3Jlc291cmNlcy5qcyIsImltcG9ydCB7IHJlZnJlc2hTbG90IH0gZnJvbSAnLi9ncHQnO1xuXG4vKipcbiogQGRlc2MgUXVldWVzIGEgY29tbWFuZCBpbnNpZGUgb2YgUHJlYmlkLmpzXG4qIEBwYXJhbSB7ZnVuY3Rpb259IGZuIC0gQWNjZXB0cyBhIGZ1bmN0aW9uIHRvIHB1c2ggaW50byB0aGUgUHJlYmlkIGNvbW1hbmQgcXVldWUuXG4qKi9cbmV4cG9ydCBmdW5jdGlvbiBxdWV1ZVByZWJpZENvbW1hbmQoZm4pIHtcbiAgcGJqcy5xdWUucHVzaChmbik7XG59XG5cbi8qKlxuKiBAZGVzYyBDYWxscyB0aGUgUHJlYmlkIHJlcXVlc3QgbWV0aG9kIGZvciBmZXRjaGluZyBiaWRzLCBvbmNlIGZldGNoZWQgdGhlIGFkdmVydGlzZW1lbnQgaXMgcmVmcmVzaGVkIHVubGVzcyBhIGNhbGxiYWNrIGlzIGRlZmluZWQuXG4qIEBwYXJhbSB7b2JqZWN0fSBhZCAtIEFuIG9iamVjdCBjb250YWluaW5nIHRoZSBHUFQgYWQgc2xvdC5cbiogQHBhcmFtIHtzdHJpbmd9IGlkIC0gQSBzdHJpbmcgY29udGFpbmluZyB0aGUgYWR2ZXJ0aXNlbWVudCBpZCBjb3JyZXNwb25kaW5nIHRvIHRoZSBkaXYgdGhlIGFkdmVydGlzZW1lbnQgd2lsbCBsb2FkIGludG8uXG4qIEBwYXJhbSB7bnVtYmVyfSB0aW1lb3V0IC0gQW4gaW50ZWdlciBjb21tdW5pY2F0aW5nIGhvdyBsb25nIGluIG1zIHRoZSBQcmViaWQuanMgc2VydmljZSBzaG91bGQgd2FpdCBiZWZvcmUgaXQgY2xvc2VzIHRoZSBhdWN0aW9uIGZvciBhIGxvdC5cbiogQHBhcmFtIHtvYmplY3R9IGluZm8gLSBBbiBvYmplY3QgY29udGFpbmluZyBpbmZvcm1hdGlvbiBhYm91dCB0aGUgYWR2ZXJ0aXNlbWVudCB0aGF0IGlzIGFib3V0IHRvIGxvYWQuXG4qIEBwYXJhbSB7ZnVuY3Rpb259IHByZXJlbmRlciAtIEFuIG9wdGlvbmFsIGZ1bmN0aW9uIHRoYXQgd2lsbCBydW4gYmVmb3JlIHRoZSBhZHZlcnRpc2VtZW50IHJlbmRlcnMuXG4qIEBwYXJhbSB7ZnVuY3Rpb259IGNiIC0gQW4gb3B0aW9uYWwgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBzaG91bGQgZmlyZSB3aGVuZXZlciB0aGUgYmlkZGluZyBoYXMgY29uY2x1ZGVkLlxuKiovXG5leHBvcnQgZnVuY3Rpb24gZmV0Y2hQcmViaWRCaWRzKGFkLCBpZCwgdGltZW91dCwgaW5mbywgcHJlcmVuZGVyLCBjYiA9IG51bGwpIHtcbiAgcGJqcy5yZXF1ZXN0Qmlkcyh7XG4gICAgdGltZW91dCxcbiAgICBhZFVuaXRDb2RlczogW2lkXSxcbiAgICBiaWRzQmFja0hhbmRsZXI6ICgpID0+IHtcbiAgICAgIHBianMuc2V0VGFyZ2V0aW5nRm9yR1BUQXN5bmMoW2lkXSk7XG4gICAgICBpZiAoY2IpIHtcbiAgICAgICAgY2IoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlZnJlc2hTbG90KHsgYWQsIGluZm8sIHByZXJlbmRlciB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufVxuXG4vKipcbiogQGRlc2MgUmVnaXN0ZXJzIGFuIGFkdmVydGlzZW1lbnQgd2l0aCBQcmViaWQuanMgc28gaXQncyBwcmVwYXJlZCB0byBmZXRjaCBiaWRzIGZvciBpdC5cbiogQHBhcmFtIHtzdHJpbmd9IGNvZGUgLSBDb250YWlucyB0aGUgZGl2IGlkIHVzZWQgZm9yIHRoZSBhZHZlcnRpc2VtZW50XG4qIEBwYXJhbSB7YXJyYXl9IHNpemVzIC0gQW4gYXJyYXkgb2YgYXBwbGljYWJsZSBhZCBzaXplcyB0aGF0IGFyZSBhdmFpbGFibGUgZm9yIGJpZGRpbmcuXG4qIEBwYXJhbSB7b2JqZWN0fSBiaWRzIC0gQ29udGFpbnMgYWxsIG9mIHRoZSBhcHBsaWNhYmxlIGJpZCBkYXRhLCBzdWNoIGFzIHdoaWNoIHZlbmRvcnMgdG8gdXNlIGFuZCB0aGVpciBwbGFjZW1lbnQgaWRzLlxuKiBAcGFyYW0ge29iamVjdH0gd3JhcHBlciAtIEFuIG9iamVjdCBjb250YWluaW5nIGFsbCBlbmFibGVkIHNlcnZpY2VzIG9uIHRoZSBBcmMgQWRzLlxuKiovXG5leHBvcnQgZnVuY3Rpb24gYWRkVW5pdChjb2RlLCBzaXplcywgYmlkcywgd3JhcHBlciA9IHt9KSB7XG4gIC8vIEZvcm1hdHMgdGhlIGFkZCB1bml0IGZvciBwcmViaWQuLlxuICBjb25zdCBzbG90ID0geyBjb2RlLCBzaXplcywgYmlkcyB9O1xuICBjb25zdCB7IHNpemVDb25maWcgfSA9IHdyYXBwZXI7XG5cbiAgcGJqcy5hZGRBZFVuaXRzKHNsb3QpO1xuXG4gIGlmIChzaXplQ29uZmlnKSB7XG4gICAgcGJqcy5zZXRDb25maWcoeyBzaXplQ29uZmlnOiBbc2l6ZUNvbmZpZ10gfSk7XG4gIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9zZXJ2aWNlcy9wcmViaWQuanMiLCJpbXBvcnQgJy4vdXRpbC9wb2x5ZmlsbHMnO1xuaW1wb3J0IHsgTW9iaWxlRGV0ZWN0aW9uIH0gZnJvbSAnLi91dGlsL21vYmlsZSc7XG5pbXBvcnQgeyByZW5hbWVQb3NpdGlvbktleSB9IGZyb20gJy4vdXRpbC9jdXN0b21UYXJnZXRpbmcnO1xuaW1wb3J0IHsgZmV0Y2hCaWRzLCBpbml0aWFsaXplQmlkZGluZ1NlcnZpY2VzIH0gZnJvbSAnLi9zZXJ2aWNlcy9oZWFkZXJiaWRkaW5nJztcbmltcG9ydCB7IGluaXRpYWxpemVHUFQsIHF1ZXVlR29vZ2xldGFnQ29tbWFuZCwgcmVmcmVzaFNsb3QsIGRmcFNldHRpbmdzLCBzZXRUYXJnZXRpbmcsIGRldGVybWluZVNsb3ROYW1lIH0gZnJvbSAnLi9zZXJ2aWNlcy9ncHQnO1xuaW1wb3J0IHsgcXVldWVQcmViaWRDb21tYW5kLCBhZGRVbml0IH0gZnJvbSAnLi9zZXJ2aWNlcy9wcmViaWQnO1xuaW1wb3J0IHsgcHJlcGFyZVNpemVNYXBzLCBzZXRSZXNpemVMaXN0ZW5lciB9IGZyb20gJy4vc2VydmljZXMvc2l6ZW1hcHBpbmcnO1xuXG4vKiogQGRlc2MgRGlzcGxheXMgYW4gYWR2ZXJ0aXNlbWVudCBmcm9tIEdvb2dsZSBERlAgd2l0aCBvcHRpb25hbCBzdXBwb3J0IGZvciBQcmViaWQuanMgYW5kIEFtYXpvbiBUQU0vQTkuICoqL1xuZXhwb3J0IGNsYXNzIEFyY0FkcyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMsIGhhbmRsZVNsb3RSZW5kZXJlZCA9IG51bGwpIHtcbiAgICB0aGlzLmRmcElkID0gb3B0aW9ucy5kZnAuaWQgfHwgJyc7XG4gICAgdGhpcy53cmFwcGVyID0gb3B0aW9ucy5iaWRkaW5nIHx8IHt9O1xuICAgIHRoaXMucG9zaXRpb25zID0gW107XG5cbiAgICB3aW5kb3cuaXNNb2JpbGUgPSBNb2JpbGVEZXRlY3Rpb247XG5cbiAgICBpZiAodGhpcy5kZnBJZCA9PT0gJycpIHtcbiAgICAgIGNvbnNvbGUud2FybihgQXJjQWRzOiBERlAgaWQgaXMgbWlzc2luZyBmcm9tIHRoZSBhcmNhZHMgaW5pdGlhbGl6YXRpb24gc2NyaXB0LlxuICAgICAgICBEb2N1bWVudGF0aW9uOiBodHRwczovL2dpdGh1Yi5jb20vd2Fwb3BhcnRuZXJzL2FyYy1hZHMjZ2V0dGluZy1zdGFydGVkYCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGluaXRpYWxpemVHUFQoKTtcbiAgICAgIHF1ZXVlR29vZ2xldGFnQ29tbWFuZChkZnBTZXR0aW5ncy5iaW5kKHRoaXMsIGhhbmRsZVNsb3RSZW5kZXJlZCkpO1xuICAgICAgaW5pdGlhbGl6ZUJpZGRpbmdTZXJ2aWNlcyh0aGlzLndyYXBwZXIpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAqIEBkZXNjIFJlZ2lzdGVycyBhbiBhZHZlcnRpc2VtZW50IGluIHRoZSBzZXJ2aWNlLlxuICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJhbXMgLSBBbiBvYmplY3QgY29udGFpbmluZyBhbGwgb2YgdGhlIGFkdmVydGlzZW1lbnQgY29uZmlndXJhdGlvbiBzZXR0aW5ncyBzdWNoIGFzIHNsb3QgbmFtZSwgaWQsIGFuZCBwb3NpdGlvbi5cbiAgKiovXG4gIHJlZ2lzdGVyQWQocGFyYW1zKSB7XG4gICAgY29uc3QgeyBpZCwgZGltZW5zaW9ucywgYWRUeXBlID0gZmFsc2UsIHRhcmdldGluZyA9IHt9LCBkaXNwbGF5ID0gJ2FsbCcsIGJpZGRpbmcgPSBmYWxzZSB9ID0gcGFyYW1zO1xuXG4gICAgLyogSWYgcG9zaXRpb25hbCB0YXJnZXRpbmcgZG9lc24ndCBleGlzdCBpdCBnZXRzIGFzc2lnbmVkIGEgbnVtZXJpYyB2YWx1ZVxuICAgICAgYmFzZWQgb24gdGhlIG9yZGVyIGFuZCB0eXBlIG9mIHRoZSBhZHZlcnRpc2VtZW50LiBUaGlzIGxvZ2ljIGlzIHNraXBwZWQgaWYgYWRUeXBlIGlzIG5vdCBkZWZpbmVkLiAqL1xuXG4gICAgaWYgKCghdGFyZ2V0aW5nLmhhc093blByb3BlcnR5KCdwb3NpdGlvbicpIHx8IHR5cGVvZiB0YXJnZXRpbmcucG9zaXRpb24gPT09ICdvYmplY3QnKSAmJiBhZFR5cGUgIT09IGZhbHNlKSB7XG4gICAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMucG9zaXRpb25zW2FkVHlwZV0gKyAxIHx8IDE7XG4gICAgICB0aGlzLnBvc2l0aW9uc1thZFR5cGVdID0gcG9zaXRpb247XG5cbiAgICAgIGlmICh0eXBlb2YgdGFyZ2V0aW5nLnBvc2l0aW9uID09PSAnb2JqZWN0JyAmJiB0YXJnZXRpbmcucG9zaXRpb24uYXMpIHtcbiAgICAgICAgT2JqZWN0LmFzc2lnbihwb3NpdGlvbiwgcmVuYW1lUG9zaXRpb25LZXkodGFyZ2V0aW5nLCBwb3NpdGlvbikpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgcG9zaXRpb25QYXJhbSA9IE9iamVjdC5hc3NpZ24odGFyZ2V0aW5nLCB7IHBvc2l0aW9uIH0pO1xuICAgICAgICBPYmplY3QuYXNzaWduKHBhcmFtcywgeyB0YXJnZXRpbmc6IHBvc2l0aW9uUGFyYW0gfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKChpc01vYmlsZS5hbnkoKSAmJiBkaXNwbGF5ID09PSAnbW9iaWxlJykgfHwgKCFpc01vYmlsZS5hbnkoKSAmJiBkaXNwbGF5ID09PSAnZGVza3RvcCcpIHx8IChkaXNwbGF5ID09PSAnYWxsJykpIHtcbiAgICAgIC8vIFJlZ2lzdGVycyB0aGUgYWR2ZXJ0aXNlbWVudCB3aXRoIFByZWJpZC5qcyBpZiBlbmFibGVkIG9uIGJvdGggdGhlIHVuaXQgYW5kIHdyYXBwZXIuXG4gICAgICBpZiAoKGJpZGRpbmcucHJlYmlkICYmIGJpZGRpbmcucHJlYmlkLmJpZHMpICYmICh0aGlzLndyYXBwZXIucHJlYmlkICYmIHRoaXMud3JhcHBlci5wcmViaWQuZW5hYmxlZCkgJiYgZGltZW5zaW9ucykge1xuICAgICAgICBxdWV1ZVByZWJpZENvbW1hbmQuYmluZCh0aGlzLCBhZGRVbml0KGlkLCBkaW1lbnNpb25zLCBiaWRkaW5nLnByZWJpZC5iaWRzLCB0aGlzLndyYXBwZXIucHJlYmlkKSk7XG4gICAgICB9XG5cbiAgICAgIHF1ZXVlR29vZ2xldGFnQ29tbWFuZCh0aGlzLmRpc3BsYXlBZC5iaW5kKHRoaXMsIHBhcmFtcykpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAqIEBkZXNjIFJlZ2lzdGVycyBhIGNvbGxlY3Rpb24gb2YgYWR2ZXJ0aXNlbWVudHMuXG4gICogQHBhcmFtIHthcnJheX0gY29sbGVjdGlvbiAtIEFuIGFycmF5IGNvbnRhaW5pbmcgYSBsaXN0IG9mIG9iamVjdHMgY29udGFpbmluZyBhZHZlcnRpc2VtZW50IGRhdGEuXG4gICoqL1xuICByZWdpc3RlckFkQ29sbGVjdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgY29sbGVjdGlvbi5mb3JFYWNoKChhZHZlcnQpID0+IHtcbiAgICAgIHRoaXMucmVnaXN0ZXJBZChhZHZlcnQpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICogQGRlc2MgRGlzcGxheXMgYW4gYWR2ZXJ0aXNlbWVudCBhbmQgc2V0cyB1cCBhbnkgbmVjY2Vyc2FyeSBldmVudCBiaW5kaW5nLlxuICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJhbXMgLSBBbiBvYmplY3QgY29udGFpbmluZyBhbGwgb2YgdGhlIGZ1bmN0aW9uIGFyZ3VtZW50cy5cbiAgKiBAcGFyYW0ge3N0cmluZ30gcGFyYW1zLmlkIC0gQSBzdHJpbmcgY29udGFpbmluZyB0aGUgYWR2ZXJ0aXNlbWVudCBpZCBjb3JyZXNwb25kaW5nIHRvIHRoZSBkaXYgdGhlIGFkdmVydGlzZW1lbnQgd2lsbCBsb2FkIGludG8uXG4gICogQHBhcmFtIHtzdHJpbmd9IHBhcmFtcy5zbG90TmFtZSAtIEEgc3RyaW5nIGNvbnRhaW5pbmcgdGhlIHNsb3QgbmFtZSBvZiB0aGUgYWR2ZXJ0aXNlbWVudCwgZm9yIGluc3RhbmNlICcxMjM0L25ld3MvaG9tZXBhZ2UnLlxuICAqIEBwYXJhbSB7YXJyYXl9IHBhcmFtcy5kaW1lbnNpb25zIC0gQW4gYXJyYXkgY29udGFpbmluZyBhbGwgb2YgdGhlIGFwcGxpY2FibGUgc2l6ZXMgdGhlIGFkdmVydGlzZW1lbnQgY2FuIHVzZS5cbiAgKiBAcGFyYW0ge29iamVjdH0gcGFyYW1zLnRhcmdldGluZyAtIEFuIG9iamVjdCBjb250YWluaW5nIGFsbCBvZiB0aGUgYWR2ZXJ0aXNlbWVudHMgdGFyZ2V0aW5nIGRhdGEuXG4gICogQHBhcmFtIHthcnJheX0gcGFyYW1zLnNpemVtYXAgLSBBbiBhcnJheSBjb250YWluaW5nIG9wdGlvbmFsIHNpemUgbWFwcGluZyBpbmZvcm1hdGlvbi5cbiAgKiBAcGFyYW0ge29iamVjdH0gcGFyYW1zLmJpZGRpbmcgLSBDb250YWlucyBhbGwgb2YgdGhlIGFwcGxpY2FibGUgYmlkIGRhdGEsIHN1Y2ggYXMgd2hpY2ggdmVuZG9ycyB0byB1c2UgYW5kIHRoZWlyIHBsYWNlbWVudCBpZHMuXG4gICogQHBhcmFtIHtmdW5jdGlvbn0gcGFyYW1zLnByZXJlbmRlciAtIEFuIG9wdGlvbmFsIGZ1bmN0aW9uIHRoYXQgd2lsbCBydW4gYmVmb3JlIHRoZSBhZHZlcnRpc2VtZW50IHJlbmRlcnMuXG4gICoqL1xuICBkaXNwbGF5QWQoe1xuICAgIGlkLFxuICAgIHNsb3ROYW1lLFxuICAgIGRpbWVuc2lvbnMsXG4gICAgdGFyZ2V0aW5nLFxuICAgIHNpemVtYXAgPSBmYWxzZSxcbiAgICBiaWRkaW5nID0gZmFsc2UsXG4gICAgcHJlcmVuZGVyID0gbnVsbFxuICB9KSB7XG4gICAgY29uc3QgZnVsbFNsb3ROYW1lID0gZGV0ZXJtaW5lU2xvdE5hbWUodGhpcy5kZnBJZCwgc2xvdE5hbWUpO1xuICAgIGNvbnN0IHBhcnNlZERpbWVuc2lvbnMgPSAhZGltZW5zaW9ucy5sZW5ndGggPyBudWxsIDogSlNPTi5wYXJzZShkaW1lbnNpb25zKTtcbiAgICBjb25zdCBhZCA9ICFkaW1lbnNpb25zID8gd2luZG93Lmdvb2dsZXRhZy5kZWZpbmVPdXRPZlBhZ2VTbG90KGZ1bGxTbG90TmFtZSwgaWQpXG4gICAgICA6IHdpbmRvdy5nb29nbGV0YWcuZGVmaW5lU2xvdChmdWxsU2xvdE5hbWUsIHBhcnNlZERpbWVuc2lvbnMsIGlkKTtcblxuICAgIGlmIChzaXplbWFwICYmIHNpemVtYXAuYnJlYWtwb2ludHMgJiYgZGltZW5zaW9ucykge1xuICAgICAgY29uc3QgeyBtYXBwaW5nLCBicmVha3BvaW50cywgY29ycmVsYXRvcnMgfSA9IHByZXBhcmVTaXplTWFwcyhwYXJzZWREaW1lbnNpb25zLCBzaXplbWFwLmJyZWFrcG9pbnRzKTtcblxuICAgICAgYWQuZGVmaW5lU2l6ZU1hcHBpbmcobWFwcGluZyk7XG5cbiAgICAgIGlmIChzaXplbWFwLnJlZnJlc2gpIHtcbiAgICAgICAgc2V0UmVzaXplTGlzdGVuZXIoe1xuICAgICAgICAgIGFkLFxuICAgICAgICAgIHNsb3ROYW1lOiBmdWxsU2xvdE5hbWUsXG4gICAgICAgICAgYnJlYWtwb2ludHMsXG4gICAgICAgICAgaWQsXG4gICAgICAgICAgbWFwcGluZyxcbiAgICAgICAgICBjb3JyZWxhdG9ycyxcbiAgICAgICAgICBiaWRkaW5nLFxuICAgICAgICAgIHdyYXBwZXI6IHRoaXMud3JhcHBlcixcbiAgICAgICAgICBwcmVyZW5kZXJcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgYWQuYWRkU2VydmljZSh3aW5kb3cuZ29vZ2xldGFnLnB1YmFkcygpKTtcblxuICAgIHNldFRhcmdldGluZyhhZCwgdGFyZ2V0aW5nKTtcblxuICAgIGlmIChiaWRkaW5nICYmIGRpbWVuc2lvbnMpIHtcbiAgICAgIGZldGNoQmlkcyh7XG4gICAgICAgIGFkLFxuICAgICAgICBpZCxcbiAgICAgICAgc2xvdE5hbWU6IGZ1bGxTbG90TmFtZSxcbiAgICAgICAgZGltZW5zaW9uczogcGFyc2VkRGltZW5zaW9ucyxcbiAgICAgICAgd3JhcHBlcjogdGhpcy53cmFwcGVyLFxuICAgICAgICBwcmVyZW5kZXIsXG4gICAgICAgIGJpZGRpbmdcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZWZyZXNoU2xvdCh7XG4gICAgICAgIGFkLFxuICAgICAgICBwcmVyZW5kZXIsXG4gICAgICAgIGluZm86IHtcbiAgICAgICAgICBhZFVuaXQ6IGFkLFxuICAgICAgICAgIGFkU2xvdDogZnVsbFNsb3ROYW1lLFxuICAgICAgICAgIGFkRGltZW5zaW9uczogcGFyc2VkRGltZW5zaW9ucyxcbiAgICAgICAgICBhZElkOiBpZFxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9pbmRleC5qcyIsImltcG9ydCBQcm9taXNlIGZyb20gJ3Byb21pc2UtcG9seWZpbGwnO1xuXG5pZiAoIXdpbmRvdy5Qcm9taXNlKSB7XG4gIHdpbmRvdy5Qcm9taXNlID0gUHJvbWlzZTtcbn1cblxuLyogZXNsaW50LWRpc2FibGUgKi9cblxuLy8gc291cmNlOiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9PYmplY3QvYXNzaWduI1BvbHlmaWxsXG4vKiBPYmplY3QuYXNzaWduKCkgZm9yIElFMTEgKG9idmlvdXNseSkgKi9cbmlmICh0eXBlb2YgT2JqZWN0LmFzc2lnbiAhPSAnZnVuY3Rpb24nKSB7XG4gIC8vIE11c3QgYmUgd3JpdGFibGU6IHRydWUsIGVudW1lcmFibGU6IGZhbHNlLCBjb25maWd1cmFibGU6IHRydWVcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE9iamVjdCwgXCJhc3NpZ25cIiwge1xuICAgIHZhbHVlOiBmdW5jdGlvbiBhc3NpZ24odGFyZ2V0LCB2YXJBcmdzKSB7IC8vIC5sZW5ndGggb2YgZnVuY3Rpb24gaXMgMlxuICAgICAgJ3VzZSBzdHJpY3QnO1xuICAgICAgaWYgKHRhcmdldCA9PSBudWxsKSB7IC8vIFR5cGVFcnJvciBpZiB1bmRlZmluZWQgb3IgbnVsbFxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdDYW5ub3QgY29udmVydCB1bmRlZmluZWQgb3IgbnVsbCB0byBvYmplY3QnKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHRvID0gT2JqZWN0KHRhcmdldCk7XG5cbiAgICAgIGZvciAodmFyIGluZGV4ID0gMTsgaW5kZXggPCBhcmd1bWVudHMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgIHZhciBuZXh0U291cmNlID0gYXJndW1lbnRzW2luZGV4XTtcblxuICAgICAgICBpZiAobmV4dFNvdXJjZSAhPSBudWxsKSB7IC8vIFNraXAgb3ZlciBpZiB1bmRlZmluZWQgb3IgbnVsbFxuICAgICAgICAgIGZvciAodmFyIG5leHRLZXkgaW4gbmV4dFNvdXJjZSkge1xuICAgICAgICAgICAgLy8gQXZvaWQgYnVncyB3aGVuIGhhc093blByb3BlcnR5IGlzIHNoYWRvd2VkXG4gICAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG5leHRTb3VyY2UsIG5leHRLZXkpKSB7XG4gICAgICAgICAgICAgIHRvW25leHRLZXldID0gbmV4dFNvdXJjZVtuZXh0S2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0bztcbiAgICB9LFxuICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbn1cblxuLyogZXNsaW50LWVuYWJsZSAqL1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3V0aWwvcG9seWZpbGxzLmpzIiwiaW1wb3J0IHByb21pc2VGaW5hbGx5IGZyb20gJy4vZmluYWxseSc7XG5cbi8vIFN0b3JlIHNldFRpbWVvdXQgcmVmZXJlbmNlIHNvIHByb21pc2UtcG9seWZpbGwgd2lsbCBiZSB1bmFmZmVjdGVkIGJ5XG4vLyBvdGhlciBjb2RlIG1vZGlmeWluZyBzZXRUaW1lb3V0IChsaWtlIHNpbm9uLnVzZUZha2VUaW1lcnMoKSlcbnZhciBzZXRUaW1lb3V0RnVuYyA9IHNldFRpbWVvdXQ7XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG4vLyBQb2x5ZmlsbCBmb3IgRnVuY3Rpb24ucHJvdG90eXBlLmJpbmRcbmZ1bmN0aW9uIGJpbmQoZm4sIHRoaXNBcmcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIGZuLmFwcGx5KHRoaXNBcmcsIGFyZ3VtZW50cyk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIFByb21pc2UoZm4pIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFByb21pc2UpKVxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Byb21pc2VzIG11c3QgYmUgY29uc3RydWN0ZWQgdmlhIG5ldycpO1xuICBpZiAodHlwZW9mIGZuICE9PSAnZnVuY3Rpb24nKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdub3QgYSBmdW5jdGlvbicpO1xuICB0aGlzLl9zdGF0ZSA9IDA7XG4gIHRoaXMuX2hhbmRsZWQgPSBmYWxzZTtcbiAgdGhpcy5fdmFsdWUgPSB1bmRlZmluZWQ7XG4gIHRoaXMuX2RlZmVycmVkcyA9IFtdO1xuXG4gIGRvUmVzb2x2ZShmbiwgdGhpcyk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZShzZWxmLCBkZWZlcnJlZCkge1xuICB3aGlsZSAoc2VsZi5fc3RhdGUgPT09IDMpIHtcbiAgICBzZWxmID0gc2VsZi5fdmFsdWU7XG4gIH1cbiAgaWYgKHNlbGYuX3N0YXRlID09PSAwKSB7XG4gICAgc2VsZi5fZGVmZXJyZWRzLnB1c2goZGVmZXJyZWQpO1xuICAgIHJldHVybjtcbiAgfVxuICBzZWxmLl9oYW5kbGVkID0gdHJ1ZTtcbiAgUHJvbWlzZS5faW1tZWRpYXRlRm4oZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNiID0gc2VsZi5fc3RhdGUgPT09IDEgPyBkZWZlcnJlZC5vbkZ1bGZpbGxlZCA6IGRlZmVycmVkLm9uUmVqZWN0ZWQ7XG4gICAgaWYgKGNiID09PSBudWxsKSB7XG4gICAgICAoc2VsZi5fc3RhdGUgPT09IDEgPyByZXNvbHZlIDogcmVqZWN0KShkZWZlcnJlZC5wcm9taXNlLCBzZWxmLl92YWx1ZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciByZXQ7XG4gICAgdHJ5IHtcbiAgICAgIHJldCA9IGNiKHNlbGYuX3ZhbHVlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZWplY3QoZGVmZXJyZWQucHJvbWlzZSwgZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJlc29sdmUoZGVmZXJyZWQucHJvbWlzZSwgcmV0KTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHJlc29sdmUoc2VsZiwgbmV3VmFsdWUpIHtcbiAgdHJ5IHtcbiAgICAvLyBQcm9taXNlIFJlc29sdXRpb24gUHJvY2VkdXJlOiBodHRwczovL2dpdGh1Yi5jb20vcHJvbWlzZXMtYXBsdXMvcHJvbWlzZXMtc3BlYyN0aGUtcHJvbWlzZS1yZXNvbHV0aW9uLXByb2NlZHVyZVxuICAgIGlmIChuZXdWYWx1ZSA9PT0gc2VsZilcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0EgcHJvbWlzZSBjYW5ub3QgYmUgcmVzb2x2ZWQgd2l0aCBpdHNlbGYuJyk7XG4gICAgaWYgKFxuICAgICAgbmV3VmFsdWUgJiZcbiAgICAgICh0eXBlb2YgbmV3VmFsdWUgPT09ICdvYmplY3QnIHx8IHR5cGVvZiBuZXdWYWx1ZSA9PT0gJ2Z1bmN0aW9uJylcbiAgICApIHtcbiAgICAgIHZhciB0aGVuID0gbmV3VmFsdWUudGhlbjtcbiAgICAgIGlmIChuZXdWYWx1ZSBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgc2VsZi5fc3RhdGUgPSAzO1xuICAgICAgICBzZWxmLl92YWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgICBmaW5hbGUoc2VsZik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoZW4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgZG9SZXNvbHZlKGJpbmQodGhlbiwgbmV3VmFsdWUpLCBzZWxmKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgICBzZWxmLl9zdGF0ZSA9IDE7XG4gICAgc2VsZi5fdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICBmaW5hbGUoc2VsZik7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZWplY3Qoc2VsZiwgZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVqZWN0KHNlbGYsIG5ld1ZhbHVlKSB7XG4gIHNlbGYuX3N0YXRlID0gMjtcbiAgc2VsZi5fdmFsdWUgPSBuZXdWYWx1ZTtcbiAgZmluYWxlKHNlbGYpO1xufVxuXG5mdW5jdGlvbiBmaW5hbGUoc2VsZikge1xuICBpZiAoc2VsZi5fc3RhdGUgPT09IDIgJiYgc2VsZi5fZGVmZXJyZWRzLmxlbmd0aCA9PT0gMCkge1xuICAgIFByb21pc2UuX2ltbWVkaWF0ZUZuKGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCFzZWxmLl9oYW5kbGVkKSB7XG4gICAgICAgIFByb21pc2UuX3VuaGFuZGxlZFJlamVjdGlvbkZuKHNlbGYuX3ZhbHVlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBzZWxmLl9kZWZlcnJlZHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBoYW5kbGUoc2VsZiwgc2VsZi5fZGVmZXJyZWRzW2ldKTtcbiAgfVxuICBzZWxmLl9kZWZlcnJlZHMgPSBudWxsO1xufVxuXG5mdW5jdGlvbiBIYW5kbGVyKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkLCBwcm9taXNlKSB7XG4gIHRoaXMub25GdWxmaWxsZWQgPSB0eXBlb2Ygb25GdWxmaWxsZWQgPT09ICdmdW5jdGlvbicgPyBvbkZ1bGZpbGxlZCA6IG51bGw7XG4gIHRoaXMub25SZWplY3RlZCA9IHR5cGVvZiBvblJlamVjdGVkID09PSAnZnVuY3Rpb24nID8gb25SZWplY3RlZCA6IG51bGw7XG4gIHRoaXMucHJvbWlzZSA9IHByb21pc2U7XG59XG5cbi8qKlxuICogVGFrZSBhIHBvdGVudGlhbGx5IG1pc2JlaGF2aW5nIHJlc29sdmVyIGZ1bmN0aW9uIGFuZCBtYWtlIHN1cmVcbiAqIG9uRnVsZmlsbGVkIGFuZCBvblJlamVjdGVkIGFyZSBvbmx5IGNhbGxlZCBvbmNlLlxuICpcbiAqIE1ha2VzIG5vIGd1YXJhbnRlZXMgYWJvdXQgYXN5bmNocm9ueS5cbiAqL1xuZnVuY3Rpb24gZG9SZXNvbHZlKGZuLCBzZWxmKSB7XG4gIHZhciBkb25lID0gZmFsc2U7XG4gIHRyeSB7XG4gICAgZm4oXG4gICAgICBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICBpZiAoZG9uZSkgcmV0dXJuO1xuICAgICAgICBkb25lID0gdHJ1ZTtcbiAgICAgICAgcmVzb2x2ZShzZWxmLCB2YWx1ZSk7XG4gICAgICB9LFxuICAgICAgZnVuY3Rpb24ocmVhc29uKSB7XG4gICAgICAgIGlmIChkb25lKSByZXR1cm47XG4gICAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgICByZWplY3Qoc2VsZiwgcmVhc29uKTtcbiAgICAgIH1cbiAgICApO1xuICB9IGNhdGNoIChleCkge1xuICAgIGlmIChkb25lKSByZXR1cm47XG4gICAgZG9uZSA9IHRydWU7XG4gICAgcmVqZWN0KHNlbGYsIGV4KTtcbiAgfVxufVxuXG5Qcm9taXNlLnByb3RvdHlwZVsnY2F0Y2gnXSA9IGZ1bmN0aW9uKG9uUmVqZWN0ZWQpIHtcbiAgcmV0dXJuIHRoaXMudGhlbihudWxsLCBvblJlamVjdGVkKTtcbn07XG5cblByb21pc2UucHJvdG90eXBlLnRoZW4gPSBmdW5jdGlvbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCkge1xuICB2YXIgcHJvbSA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKG5vb3ApO1xuXG4gIGhhbmRsZSh0aGlzLCBuZXcgSGFuZGxlcihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCwgcHJvbSkpO1xuICByZXR1cm4gcHJvbTtcbn07XG5cblByb21pc2UucHJvdG90eXBlWydmaW5hbGx5J10gPSBwcm9taXNlRmluYWxseTtcblxuUHJvbWlzZS5hbGwgPSBmdW5jdGlvbihhcnIpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgIGlmICghYXJyIHx8IHR5cGVvZiBhcnIubGVuZ3RoID09PSAndW5kZWZpbmVkJylcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Byb21pc2UuYWxsIGFjY2VwdHMgYW4gYXJyYXknKTtcbiAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFycik7XG4gICAgaWYgKGFyZ3MubGVuZ3RoID09PSAwKSByZXR1cm4gcmVzb2x2ZShbXSk7XG4gICAgdmFyIHJlbWFpbmluZyA9IGFyZ3MubGVuZ3RoO1xuXG4gICAgZnVuY3Rpb24gcmVzKGksIHZhbCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKHZhbCAmJiAodHlwZW9mIHZhbCA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIHZhbCA9PT0gJ2Z1bmN0aW9uJykpIHtcbiAgICAgICAgICB2YXIgdGhlbiA9IHZhbC50aGVuO1xuICAgICAgICAgIGlmICh0eXBlb2YgdGhlbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhlbi5jYWxsKFxuICAgICAgICAgICAgICB2YWwsXG4gICAgICAgICAgICAgIGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgICAgICAgIHJlcyhpLCB2YWwpO1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICByZWplY3RcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGFyZ3NbaV0gPSB2YWw7XG4gICAgICAgIGlmICgtLXJlbWFpbmluZyA9PT0gMCkge1xuICAgICAgICAgIHJlc29sdmUoYXJncyk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgIHJlamVjdChleCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICByZXMoaSwgYXJnc1tpXSk7XG4gICAgfVxuICB9KTtcbn07XG5cblByb21pc2UucmVzb2x2ZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlLmNvbnN0cnVjdG9yID09PSBQcm9taXNlKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcbiAgICByZXNvbHZlKHZhbHVlKTtcbiAgfSk7XG59O1xuXG5Qcm9taXNlLnJlamVjdCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICByZWplY3QodmFsdWUpO1xuICB9KTtcbn07XG5cblByb21pc2UucmFjZSA9IGZ1bmN0aW9uKHZhbHVlcykge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHZhbHVlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgdmFsdWVzW2ldLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcbiAgICB9XG4gIH0pO1xufTtcblxuLy8gVXNlIHBvbHlmaWxsIGZvciBzZXRJbW1lZGlhdGUgZm9yIHBlcmZvcm1hbmNlIGdhaW5zXG5Qcm9taXNlLl9pbW1lZGlhdGVGbiA9XG4gICh0eXBlb2Ygc2V0SW1tZWRpYXRlID09PSAnZnVuY3Rpb24nICYmXG4gICAgZnVuY3Rpb24oZm4pIHtcbiAgICAgIHNldEltbWVkaWF0ZShmbik7XG4gICAgfSkgfHxcbiAgZnVuY3Rpb24oZm4pIHtcbiAgICBzZXRUaW1lb3V0RnVuYyhmbiwgMCk7XG4gIH07XG5cblByb21pc2UuX3VuaGFuZGxlZFJlamVjdGlvbkZuID0gZnVuY3Rpb24gX3VuaGFuZGxlZFJlamVjdGlvbkZuKGVycikge1xuICBpZiAodHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnICYmIGNvbnNvbGUpIHtcbiAgICBjb25zb2xlLndhcm4oJ1Bvc3NpYmxlIFVuaGFuZGxlZCBQcm9taXNlIFJlamVjdGlvbjonLCBlcnIpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGVcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgUHJvbWlzZTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3Byb21pc2UtcG9seWZpbGwvc3JjL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSA3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBzY29wZSA9ICh0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiICYmIGdsb2JhbCkgfHxcbiAgICAgICAgICAgICh0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiAmJiBzZWxmKSB8fFxuICAgICAgICAgICAgd2luZG93O1xudmFyIGFwcGx5ID0gRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5O1xuXG4vLyBET00gQVBJcywgZm9yIGNvbXBsZXRlbmVzc1xuXG5leHBvcnRzLnNldFRpbWVvdXQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBUaW1lb3V0KGFwcGx5LmNhbGwoc2V0VGltZW91dCwgc2NvcGUsIGFyZ3VtZW50cyksIGNsZWFyVGltZW91dCk7XG59O1xuZXhwb3J0cy5zZXRJbnRlcnZhbCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IFRpbWVvdXQoYXBwbHkuY2FsbChzZXRJbnRlcnZhbCwgc2NvcGUsIGFyZ3VtZW50cyksIGNsZWFySW50ZXJ2YWwpO1xufTtcbmV4cG9ydHMuY2xlYXJUaW1lb3V0ID1cbmV4cG9ydHMuY2xlYXJJbnRlcnZhbCA9IGZ1bmN0aW9uKHRpbWVvdXQpIHtcbiAgaWYgKHRpbWVvdXQpIHtcbiAgICB0aW1lb3V0LmNsb3NlKCk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIFRpbWVvdXQoaWQsIGNsZWFyRm4pIHtcbiAgdGhpcy5faWQgPSBpZDtcbiAgdGhpcy5fY2xlYXJGbiA9IGNsZWFyRm47XG59XG5UaW1lb3V0LnByb3RvdHlwZS51bnJlZiA9IFRpbWVvdXQucHJvdG90eXBlLnJlZiA9IGZ1bmN0aW9uKCkge307XG5UaW1lb3V0LnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLl9jbGVhckZuLmNhbGwoc2NvcGUsIHRoaXMuX2lkKTtcbn07XG5cbi8vIERvZXMgbm90IHN0YXJ0IHRoZSB0aW1lLCBqdXN0IHNldHMgdXAgdGhlIG1lbWJlcnMgbmVlZGVkLlxuZXhwb3J0cy5lbnJvbGwgPSBmdW5jdGlvbihpdGVtLCBtc2Vjcykge1xuICBjbGVhclRpbWVvdXQoaXRlbS5faWRsZVRpbWVvdXRJZCk7XG4gIGl0ZW0uX2lkbGVUaW1lb3V0ID0gbXNlY3M7XG59O1xuXG5leHBvcnRzLnVuZW5yb2xsID0gZnVuY3Rpb24oaXRlbSkge1xuICBjbGVhclRpbWVvdXQoaXRlbS5faWRsZVRpbWVvdXRJZCk7XG4gIGl0ZW0uX2lkbGVUaW1lb3V0ID0gLTE7XG59O1xuXG5leHBvcnRzLl91bnJlZkFjdGl2ZSA9IGV4cG9ydHMuYWN0aXZlID0gZnVuY3Rpb24oaXRlbSkge1xuICBjbGVhclRpbWVvdXQoaXRlbS5faWRsZVRpbWVvdXRJZCk7XG5cbiAgdmFyIG1zZWNzID0gaXRlbS5faWRsZVRpbWVvdXQ7XG4gIGlmIChtc2VjcyA+PSAwKSB7XG4gICAgaXRlbS5faWRsZVRpbWVvdXRJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gb25UaW1lb3V0KCkge1xuICAgICAgaWYgKGl0ZW0uX29uVGltZW91dClcbiAgICAgICAgaXRlbS5fb25UaW1lb3V0KCk7XG4gICAgfSwgbXNlY3MpO1xuICB9XG59O1xuXG4vLyBzZXRpbW1lZGlhdGUgYXR0YWNoZXMgaXRzZWxmIHRvIHRoZSBnbG9iYWwgb2JqZWN0XG5yZXF1aXJlKFwic2V0aW1tZWRpYXRlXCIpO1xuLy8gT24gc29tZSBleG90aWMgZW52aXJvbm1lbnRzLCBpdCdzIG5vdCBjbGVhciB3aGljaCBvYmplY3QgYHNldGltbWVkaWF0ZWAgd2FzXG4vLyBhYmxlIHRvIGluc3RhbGwgb250by4gIFNlYXJjaCBlYWNoIHBvc3NpYmlsaXR5IGluIHRoZSBzYW1lIG9yZGVyIGFzIHRoZVxuLy8gYHNldGltbWVkaWF0ZWAgbGlicmFyeS5cbmV4cG9ydHMuc2V0SW1tZWRpYXRlID0gKHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiICYmIHNlbGYuc2V0SW1tZWRpYXRlKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAodHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBnbG9iYWwuc2V0SW1tZWRpYXRlKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAodGhpcyAmJiB0aGlzLnNldEltbWVkaWF0ZSk7XG5leHBvcnRzLmNsZWFySW1tZWRpYXRlID0gKHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiICYmIHNlbGYuY2xlYXJJbW1lZGlhdGUpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgKHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgJiYgZ2xvYmFsLmNsZWFySW1tZWRpYXRlKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICh0aGlzICYmIHRoaXMuY2xlYXJJbW1lZGlhdGUpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvdGltZXJzLWJyb3dzZXJpZnkvbWFpbi5qc1xuLy8gbW9kdWxlIGlkID0gOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIoZnVuY3Rpb24gKGdsb2JhbCwgdW5kZWZpbmVkKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBpZiAoZ2xvYmFsLnNldEltbWVkaWF0ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIG5leHRIYW5kbGUgPSAxOyAvLyBTcGVjIHNheXMgZ3JlYXRlciB0aGFuIHplcm9cbiAgICB2YXIgdGFza3NCeUhhbmRsZSA9IHt9O1xuICAgIHZhciBjdXJyZW50bHlSdW5uaW5nQVRhc2sgPSBmYWxzZTtcbiAgICB2YXIgZG9jID0gZ2xvYmFsLmRvY3VtZW50O1xuICAgIHZhciByZWdpc3RlckltbWVkaWF0ZTtcblxuICAgIGZ1bmN0aW9uIHNldEltbWVkaWF0ZShjYWxsYmFjaykge1xuICAgICAgLy8gQ2FsbGJhY2sgY2FuIGVpdGhlciBiZSBhIGZ1bmN0aW9uIG9yIGEgc3RyaW5nXG4gICAgICBpZiAodHlwZW9mIGNhbGxiYWNrICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgY2FsbGJhY2sgPSBuZXcgRnVuY3Rpb24oXCJcIiArIGNhbGxiYWNrKTtcbiAgICAgIH1cbiAgICAgIC8vIENvcHkgZnVuY3Rpb24gYXJndW1lbnRzXG4gICAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBhcmdzW2ldID0gYXJndW1lbnRzW2kgKyAxXTtcbiAgICAgIH1cbiAgICAgIC8vIFN0b3JlIGFuZCByZWdpc3RlciB0aGUgdGFza1xuICAgICAgdmFyIHRhc2sgPSB7IGNhbGxiYWNrOiBjYWxsYmFjaywgYXJnczogYXJncyB9O1xuICAgICAgdGFza3NCeUhhbmRsZVtuZXh0SGFuZGxlXSA9IHRhc2s7XG4gICAgICByZWdpc3RlckltbWVkaWF0ZShuZXh0SGFuZGxlKTtcbiAgICAgIHJldHVybiBuZXh0SGFuZGxlKys7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xlYXJJbW1lZGlhdGUoaGFuZGxlKSB7XG4gICAgICAgIGRlbGV0ZSB0YXNrc0J5SGFuZGxlW2hhbmRsZV07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcnVuKHRhc2spIHtcbiAgICAgICAgdmFyIGNhbGxiYWNrID0gdGFzay5jYWxsYmFjaztcbiAgICAgICAgdmFyIGFyZ3MgPSB0YXNrLmFyZ3M7XG4gICAgICAgIHN3aXRjaCAoYXJncy5sZW5ndGgpIHtcbiAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICBjYWxsYmFjayhhcmdzWzBdKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICBjYWxsYmFjayhhcmdzWzBdLCBhcmdzWzFdKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICBjYWxsYmFjayhhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgY2FsbGJhY2suYXBwbHkodW5kZWZpbmVkLCBhcmdzKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcnVuSWZQcmVzZW50KGhhbmRsZSkge1xuICAgICAgICAvLyBGcm9tIHRoZSBzcGVjOiBcIldhaXQgdW50aWwgYW55IGludm9jYXRpb25zIG9mIHRoaXMgYWxnb3JpdGhtIHN0YXJ0ZWQgYmVmb3JlIHRoaXMgb25lIGhhdmUgY29tcGxldGVkLlwiXG4gICAgICAgIC8vIFNvIGlmIHdlJ3JlIGN1cnJlbnRseSBydW5uaW5nIGEgdGFzaywgd2UnbGwgbmVlZCB0byBkZWxheSB0aGlzIGludm9jYXRpb24uXG4gICAgICAgIGlmIChjdXJyZW50bHlSdW5uaW5nQVRhc2spIHtcbiAgICAgICAgICAgIC8vIERlbGF5IGJ5IGRvaW5nIGEgc2V0VGltZW91dC4gc2V0SW1tZWRpYXRlIHdhcyB0cmllZCBpbnN0ZWFkLCBidXQgaW4gRmlyZWZveCA3IGl0IGdlbmVyYXRlZCBhXG4gICAgICAgICAgICAvLyBcInRvbyBtdWNoIHJlY3Vyc2lvblwiIGVycm9yLlxuICAgICAgICAgICAgc2V0VGltZW91dChydW5JZlByZXNlbnQsIDAsIGhhbmRsZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgdGFzayA9IHRhc2tzQnlIYW5kbGVbaGFuZGxlXTtcbiAgICAgICAgICAgIGlmICh0YXNrKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudGx5UnVubmluZ0FUYXNrID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBydW4odGFzayk7XG4gICAgICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJJbW1lZGlhdGUoaGFuZGxlKTtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudGx5UnVubmluZ0FUYXNrID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zdGFsbE5leHRUaWNrSW1wbGVtZW50YXRpb24oKSB7XG4gICAgICAgIHJlZ2lzdGVySW1tZWRpYXRlID0gZnVuY3Rpb24oaGFuZGxlKSB7XG4gICAgICAgICAgICBwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uICgpIHsgcnVuSWZQcmVzZW50KGhhbmRsZSk7IH0pO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNhblVzZVBvc3RNZXNzYWdlKCkge1xuICAgICAgICAvLyBUaGUgdGVzdCBhZ2FpbnN0IGBpbXBvcnRTY3JpcHRzYCBwcmV2ZW50cyB0aGlzIGltcGxlbWVudGF0aW9uIGZyb20gYmVpbmcgaW5zdGFsbGVkIGluc2lkZSBhIHdlYiB3b3JrZXIsXG4gICAgICAgIC8vIHdoZXJlIGBnbG9iYWwucG9zdE1lc3NhZ2VgIG1lYW5zIHNvbWV0aGluZyBjb21wbGV0ZWx5IGRpZmZlcmVudCBhbmQgY2FuJ3QgYmUgdXNlZCBmb3IgdGhpcyBwdXJwb3NlLlxuICAgICAgICBpZiAoZ2xvYmFsLnBvc3RNZXNzYWdlICYmICFnbG9iYWwuaW1wb3J0U2NyaXB0cykge1xuICAgICAgICAgICAgdmFyIHBvc3RNZXNzYWdlSXNBc3luY2hyb25vdXMgPSB0cnVlO1xuICAgICAgICAgICAgdmFyIG9sZE9uTWVzc2FnZSA9IGdsb2JhbC5vbm1lc3NhZ2U7XG4gICAgICAgICAgICBnbG9iYWwub25tZXNzYWdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcG9zdE1lc3NhZ2VJc0FzeW5jaHJvbm91cyA9IGZhbHNlO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGdsb2JhbC5wb3N0TWVzc2FnZShcIlwiLCBcIipcIik7XG4gICAgICAgICAgICBnbG9iYWwub25tZXNzYWdlID0gb2xkT25NZXNzYWdlO1xuICAgICAgICAgICAgcmV0dXJuIHBvc3RNZXNzYWdlSXNBc3luY2hyb25vdXM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnN0YWxsUG9zdE1lc3NhZ2VJbXBsZW1lbnRhdGlvbigpIHtcbiAgICAgICAgLy8gSW5zdGFsbHMgYW4gZXZlbnQgaGFuZGxlciBvbiBgZ2xvYmFsYCBmb3IgdGhlIGBtZXNzYWdlYCBldmVudDogc2VlXG4gICAgICAgIC8vICogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vRE9NL3dpbmRvdy5wb3N0TWVzc2FnZVxuICAgICAgICAvLyAqIGh0dHA6Ly93d3cud2hhdHdnLm9yZy9zcGVjcy93ZWItYXBwcy9jdXJyZW50LXdvcmsvbXVsdGlwYWdlL2NvbW1zLmh0bWwjY3Jvc3NEb2N1bWVudE1lc3NhZ2VzXG5cbiAgICAgICAgdmFyIG1lc3NhZ2VQcmVmaXggPSBcInNldEltbWVkaWF0ZSRcIiArIE1hdGgucmFuZG9tKCkgKyBcIiRcIjtcbiAgICAgICAgdmFyIG9uR2xvYmFsTWVzc2FnZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQuc291cmNlID09PSBnbG9iYWwgJiZcbiAgICAgICAgICAgICAgICB0eXBlb2YgZXZlbnQuZGF0YSA9PT0gXCJzdHJpbmdcIiAmJlxuICAgICAgICAgICAgICAgIGV2ZW50LmRhdGEuaW5kZXhPZihtZXNzYWdlUHJlZml4KSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJ1bklmUHJlc2VudCgrZXZlbnQuZGF0YS5zbGljZShtZXNzYWdlUHJlZml4Lmxlbmd0aCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICAgICAgZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIG9uR2xvYmFsTWVzc2FnZSwgZmFsc2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZ2xvYmFsLmF0dGFjaEV2ZW50KFwib25tZXNzYWdlXCIsIG9uR2xvYmFsTWVzc2FnZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZWdpc3RlckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgICAgICAgICAgZ2xvYmFsLnBvc3RNZXNzYWdlKG1lc3NhZ2VQcmVmaXggKyBoYW5kbGUsIFwiKlwiKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnN0YWxsTWVzc2FnZUNoYW5uZWxJbXBsZW1lbnRhdGlvbigpIHtcbiAgICAgICAgdmFyIGNoYW5uZWwgPSBuZXcgTWVzc2FnZUNoYW5uZWwoKTtcbiAgICAgICAgY2hhbm5lbC5wb3J0MS5vbm1lc3NhZ2UgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgdmFyIGhhbmRsZSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBydW5JZlByZXNlbnQoaGFuZGxlKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZWdpc3RlckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgICAgICAgICAgY2hhbm5lbC5wb3J0Mi5wb3N0TWVzc2FnZShoYW5kbGUpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc3RhbGxSZWFkeVN0YXRlQ2hhbmdlSW1wbGVtZW50YXRpb24oKSB7XG4gICAgICAgIHZhciBodG1sID0gZG9jLmRvY3VtZW50RWxlbWVudDtcbiAgICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUgPSBmdW5jdGlvbihoYW5kbGUpIHtcbiAgICAgICAgICAgIC8vIENyZWF0ZSBhIDxzY3JpcHQ+IGVsZW1lbnQ7IGl0cyByZWFkeXN0YXRlY2hhbmdlIGV2ZW50IHdpbGwgYmUgZmlyZWQgYXN5bmNocm9ub3VzbHkgb25jZSBpdCBpcyBpbnNlcnRlZFxuICAgICAgICAgICAgLy8gaW50byB0aGUgZG9jdW1lbnQuIERvIHNvLCB0aHVzIHF1ZXVpbmcgdXAgdGhlIHRhc2suIFJlbWVtYmVyIHRvIGNsZWFuIHVwIG9uY2UgaXQncyBiZWVuIGNhbGxlZC5cbiAgICAgICAgICAgIHZhciBzY3JpcHQgPSBkb2MuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcbiAgICAgICAgICAgIHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcnVuSWZQcmVzZW50KGhhbmRsZSk7XG4gICAgICAgICAgICAgICAgc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgaHRtbC5yZW1vdmVDaGlsZChzY3JpcHQpO1xuICAgICAgICAgICAgICAgIHNjcmlwdCA9IG51bGw7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaHRtbC5hcHBlbmRDaGlsZChzY3JpcHQpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc3RhbGxTZXRUaW1lb3V0SW1wbGVtZW50YXRpb24oKSB7XG4gICAgICAgIHJlZ2lzdGVySW1tZWRpYXRlID0gZnVuY3Rpb24oaGFuZGxlKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KHJ1bklmUHJlc2VudCwgMCwgaGFuZGxlKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBJZiBzdXBwb3J0ZWQsIHdlIHNob3VsZCBhdHRhY2ggdG8gdGhlIHByb3RvdHlwZSBvZiBnbG9iYWwsIHNpbmNlIHRoYXQgaXMgd2hlcmUgc2V0VGltZW91dCBldCBhbC4gbGl2ZS5cbiAgICB2YXIgYXR0YWNoVG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YgJiYgT2JqZWN0LmdldFByb3RvdHlwZU9mKGdsb2JhbCk7XG4gICAgYXR0YWNoVG8gPSBhdHRhY2hUbyAmJiBhdHRhY2hUby5zZXRUaW1lb3V0ID8gYXR0YWNoVG8gOiBnbG9iYWw7XG5cbiAgICAvLyBEb24ndCBnZXQgZm9vbGVkIGJ5IGUuZy4gYnJvd3NlcmlmeSBlbnZpcm9ubWVudHMuXG4gICAgaWYgKHt9LnRvU3RyaW5nLmNhbGwoZ2xvYmFsLnByb2Nlc3MpID09PSBcIltvYmplY3QgcHJvY2Vzc11cIikge1xuICAgICAgICAvLyBGb3IgTm9kZS5qcyBiZWZvcmUgMC45XG4gICAgICAgIGluc3RhbGxOZXh0VGlja0ltcGxlbWVudGF0aW9uKCk7XG5cbiAgICB9IGVsc2UgaWYgKGNhblVzZVBvc3RNZXNzYWdlKCkpIHtcbiAgICAgICAgLy8gRm9yIG5vbi1JRTEwIG1vZGVybiBicm93c2Vyc1xuICAgICAgICBpbnN0YWxsUG9zdE1lc3NhZ2VJbXBsZW1lbnRhdGlvbigpO1xuXG4gICAgfSBlbHNlIGlmIChnbG9iYWwuTWVzc2FnZUNoYW5uZWwpIHtcbiAgICAgICAgLy8gRm9yIHdlYiB3b3JrZXJzLCB3aGVyZSBzdXBwb3J0ZWRcbiAgICAgICAgaW5zdGFsbE1lc3NhZ2VDaGFubmVsSW1wbGVtZW50YXRpb24oKTtcblxuICAgIH0gZWxzZSBpZiAoZG9jICYmIFwib25yZWFkeXN0YXRlY2hhbmdlXCIgaW4gZG9jLmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIikpIHtcbiAgICAgICAgLy8gRm9yIElFIDbigJM4XG4gICAgICAgIGluc3RhbGxSZWFkeVN0YXRlQ2hhbmdlSW1wbGVtZW50YXRpb24oKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEZvciBvbGRlciBicm93c2Vyc1xuICAgICAgICBpbnN0YWxsU2V0VGltZW91dEltcGxlbWVudGF0aW9uKCk7XG4gICAgfVxuXG4gICAgYXR0YWNoVG8uc2V0SW1tZWRpYXRlID0gc2V0SW1tZWRpYXRlO1xuICAgIGF0dGFjaFRvLmNsZWFySW1tZWRpYXRlID0gY2xlYXJJbW1lZGlhdGU7XG59KHR5cGVvZiBzZWxmID09PSBcInVuZGVmaW5lZFwiID8gdHlwZW9mIGdsb2JhbCA9PT0gXCJ1bmRlZmluZWRcIiA/IHRoaXMgOiBnbG9iYWwgOiBzZWxmKSk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9zZXRpbW1lZGlhdGUvc2V0SW1tZWRpYXRlLmpzXG4vLyBtb2R1bGUgaWQgPSA5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanNcbi8vIG1vZHVsZSBpZCA9IDEwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gIHZhciBjb25zdHJ1Y3RvciA9IHRoaXMuY29uc3RydWN0b3I7XG4gIHJldHVybiB0aGlzLnRoZW4oXG4gICAgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiBjb25zdHJ1Y3Rvci5yZXNvbHZlKGNhbGxiYWNrKCkpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgZnVuY3Rpb24ocmVhc29uKSB7XG4gICAgICByZXR1cm4gY29uc3RydWN0b3IucmVzb2x2ZShjYWxsYmFjaygpKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gY29uc3RydWN0b3IucmVqZWN0KHJlYXNvbik7XG4gICAgICB9KTtcbiAgICB9XG4gICk7XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9wcm9taXNlLXBvbHlmaWxsL3NyYy9maW5hbGx5LmpzXG4vLyBtb2R1bGUgaWQgPSAxMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKiogQGRlc2MgVXRpbGl0eSBjbGFzcyB0aGF0IGRldGVybWluZXMgdGhlIGVuZCB1c2VycyBicm93c2VyIHVzZXIgYWdlbnQuICoqL1xuZXhwb3J0IGNsYXNzIE1vYmlsZURldGVjdGlvbiB7XG4gIC8qKlxuICAqIEBkZXNjIERldGVybWluZXMgaWYgdGhlIHVzZXIgaXMgdXNpbmcgYW4gQW5kcm9pZCBkZXZpY2UuXG4gICoqL1xuICBzdGF0aWMgQW5kcm9pZCgpIHtcbiAgICByZXR1cm4gISFuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9BbmRyb2lkL2kpO1xuICB9XG5cbiAgLyoqXG4gICogQGRlc2MgRGV0ZXJtaW5lcyBpZiB0aGUgdXNlciBpcyB1c2luZyBhbiBvbGQgQW5kcm9pZCBkZXZpY2UuXG4gICoqL1xuICBzdGF0aWMgQW5kcm9pZE9sZCgpIHtcbiAgICByZXR1cm4gISFuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9BbmRyb2lkIDIuMy4zL2kpO1xuICB9XG5cbiAgLyoqXG4gICogQGRlc2MgRGV0ZXJtaW5lcyBpZiB0aGUgdXNlciBpcyB1c2luZyBhbiBBbmRyb2lkIHRhYmxldCBkZXZpY2UuXG4gICoqL1xuICBzdGF0aWMgQW5kcm9pZFRhYmxldCgpIHtcbiAgICByZXR1cm4gISEobmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvQW5kcm9pZC9pKSAmJiAhbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvTW9iaWxlL2kpKTtcbiAgfVxuXG4gIC8qKlxuICAqIEBkZXNjIERldGVybWluZXMgaWYgdGhlIHVzZXIgaXMgdXNpbmcgYSBLaW5kbGUuXG4gICoqL1xuICBzdGF0aWMgS2luZGxlKCkge1xuICAgIHJldHVybiAhIW5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL0tpbmRsZS9pKTtcbiAgfVxuXG4gIC8qKlxuICAqIEBkZXNjIERldGVybWluZXMgaWYgdGhlIHVzZXIgaXMgdXNpbmcgYSBLaW5kbGUgRmlyZS5cbiAgKiovXG4gIHN0YXRpYyBLaW5kbGVGaXJlKCkge1xuICAgIHJldHVybiAhIW5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL0tGT1QvaSk7XG4gIH1cblxuICAvKipcbiAgKiBAZGVzYyBEZXRlcm1pbmVzIGlmIHRoZSB1c2VyIGlzIHVzaW5nIFNpbGsuXG4gICoqL1xuICBzdGF0aWMgU2lsaygpIHtcbiAgICByZXR1cm4gISFuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9TaWxrL2kpO1xuICB9XG5cbiAgLyoqXG4gICogQGRlc2MgRGV0ZXJtaW5lcyBpZiB0aGUgdXNlciBpcyB1c2luZyBhIEJsYWNrQmVycnkgZGV2aWNlXG4gICoqL1xuICBzdGF0aWMgQmxhY2tCZXJyeSgpIHtcbiAgICByZXR1cm4gISFuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9CbGFja0JlcnJ5L2kpO1xuICB9XG5cbiAgLyoqXG4gICogQGRlc2MgRGV0ZXJtaW5lcyBpZiB0aGUgdXNlciBpcyB1c2luZyBhbiBpT1MgZGV2aWNlLlxuICAqKi9cbiAgc3RhdGljIGlPUygpIHtcbiAgICByZXR1cm4gISFuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9pUGhvbmV8aVBhZHxpUG9kL2kpO1xuICB9XG5cbiAgLyoqXG4gICogQGRlc2MgRGV0ZXJtaW5lcyBpZiB0aGUgdXNlciBpcyB1c2luZyBhbiBpUGhvbmUgb3IgaVBvZC5cbiAgKiovXG4gIHN0YXRpYyBpUGhvbmUoKSB7XG4gICAgcmV0dXJuICEhbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvaVBob25lfGlQb2QvaSk7XG4gIH1cblxuICAvKipcbiAgKiBAZGVzYyBEZXRlcm1pbmVzIGlmIHRoZSB1c2VyIGlzIHVzaW5nIGFuIGlQYWQuXG4gICoqL1xuICBzdGF0aWMgaVBhZCgpIHtcbiAgICByZXR1cm4gISFuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9pUGFkL2kpO1xuICB9XG5cbiAgLyoqXG4gICogQGRlc2MgRGV0ZXJtaW5lcyBpZiB0aGUgdXNlciBpcyB1c2luZyBhIFdpbmRvd3MgTW9iaWxlIGRldmljZS5cbiAgKiovXG4gIHN0YXRpYyBXaW5kb3dzKCkge1xuICAgIHJldHVybiAhIW5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL0lFTW9iaWxlL2kpO1xuICB9XG5cbiAgLyoqXG4gICogQGRlc2MgRGV0ZXJtaW5lcyBpZiB0aGUgdXNlciBpcyB1c2luZyBGaXJlRm94T1MuXG4gICoqL1xuICBzdGF0aWMgRmlyZWZveE9TKCkge1xuICAgIHJldHVybiAhIW5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL01vemlsbGEvaSkgJiYgISFuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9Nb2JpbGUvaSk7XG4gIH1cblxuICAvKipcbiAgKiBAZGVzYyBEZXRlcm1pbmVzIGlmIHRoZSB1c2VyIGlzIHVzaW5nIGEgUmV0aW5hIGRpc3BsYXkuXG4gICoqL1xuICBzdGF0aWMgUmV0aW5hKCkge1xuICAgIHJldHVybiAod2luZG93LnJldGluYSB8fCB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyA+IDEpO1xuICB9XG5cbiAgLyoqXG4gICogQGRlc2MgRGV0ZXJtaW5lcyBpZiB0aGUgdXNlciBpcyB1c2luZyBhbnkgdHlwZSBvZiBtb2JpbGUgZGV2aWNlLlxuICAqKi9cbiAgc3RhdGljIGFueSgpIHtcbiAgICByZXR1cm4gKHRoaXMuQW5kcm9pZCgpIHx8IHRoaXMuS2luZGxlKCkgfHwgdGhpcy5LaW5kbGVGaXJlKCkgfHwgdGhpcy5TaWxrKCkgfHwgdGhpcy5CbGFja0JlcnJ5KCkgfHwgdGhpcy5pT1MoKSB8fCB0aGlzLldpbmRvd3MoKSB8fCB0aGlzLkZpcmVmb3hPUygpKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBNb2JpbGVEZXRlY3Rpb247XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvdXRpbC9tb2JpbGUuanMiLCIvKipcbiogQGRlc2MgSWYgYSBkaWZmZXJlbnQga2V5IGlzIHJlcXVpcmVkIHRvIHNlcnZlIHBvc2l0aW9uIHRhcmdldGluZyBmb3Igb2xkZXIgY3JlYXRpdmVzLCByZW5hbWUgaXQgaGVyZS5cbiogQHBhcmFtIHtvYmplY3R9IHRhcmdldGluZyAtIFRhcmdldGluZyBvYmplY3QgcGFzc2VkIGluIGZyb20gdGhlIGFkIG9iamVjdC5cbiogQHBhcmFtIHtudW1iZXJ9IHBvc2l0aW9uVmFsdWUgLSBUaGUgbnRoIG51bWJlciBvZiBhZFR5cGUgaW5jbHVkZWQuXG4qIEByZXR1cm4gLSBSZXR1cm5zIHRoZSB0YXJnZXRpbmcgb2JqZWN0IHdpdGggdGhlIG9sZCBwb3NpdGlvbiB2YWx1ZSBzdHJpcHBlZCBvdXQsIGFuZCB0aGUgbmV3IG9uZSB3aXRoIHRoZSBkZXNpcmVkIGtleSBpbiBpdHMgcGxhY2UuXG4qKi9cbmV4cG9ydCBmdW5jdGlvbiByZW5hbWVQb3NpdGlvbktleSh0YXJnZXRpbmcsIHBvc2l0aW9uVmFsdWUpIHtcbiAgY29uc3QgbmV3VGFyZ2V0aW5nT2JqZWN0ID0gdGFyZ2V0aW5nO1xuICBjb25zdCBrZXlOYW1lID0gdGFyZ2V0aW5nLnBvc2l0aW9uLmFzO1xuICBkZWxldGUgbmV3VGFyZ2V0aW5nT2JqZWN0LnBvc2l0aW9uO1xuICBuZXdUYXJnZXRpbmdPYmplY3Rba2V5TmFtZV0gPSBwb3NpdGlvblZhbHVlO1xuICBPYmplY3QuYXNzaWduKHRhcmdldGluZywgbmV3VGFyZ2V0aW5nT2JqZWN0KTtcbiAgcmV0dXJuIHRhcmdldGluZztcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy91dGlsL2N1c3RvbVRhcmdldGluZy5qcyIsIi8qKlxuKiBAZGVzYyBBY2NlcHRzIGEga2V5IGFzIGEgc3RyaW5nIGFuZCByZXR1cm5zIHRoZSB2YWx1ZSBvZiBhIHF1ZXJ5IHBhcmFtZXRlciBvbiB0aGUgcGFnZSByZXF1ZXN0LlxuKiBAcGFyYW0ge3N0cmluZ30gcGFyYW0gLSBBIHN0cmluZyB0aGF0IHJlcHJlc2VudHMgdGhlIGtleSBvZiBhIHF1ZXJ5IHBhcmFtdGVyLCBmb3IgZXhhbXBsZSAnYWRzbG90JyB3aWxsIHJldHVybiAnaGVsbG8nIGlmIHRoZSB1cmwgaGFzICc/YWRzbG90PWhlbGxvJyBhdCB0aGUgZW5kIG9mIGl0LlxuKiBAcmV0dXJuIC0gUmV0dXJucyBhIHN0cmluZyBjb250YWluaW5nIHRoZSB2YWx1ZSBvZiBhIHF1ZXJ5IHBhcmFtdGVyLlxuKiovXG5leHBvcnQgZnVuY3Rpb24gZXhwYW5kUXVlcnlTdHJpbmcocGFyYW0pIHtcbiAgY29uc3QgdXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG4gIGNvbnN0IG5hbWUgPSBwYXJhbS5yZXBsYWNlKC9bW1xcXV0vZywgJ1xcXFwkJicpO1xuICBjb25zdCByZWdleCA9IG5ldyBSZWdFeHAoYFs/Jl0ke25hbWV9KD0oW14mI10qKXwmfCN8JClgKTtcbiAgY29uc3QgcmVzdWx0cyA9IHJlZ2V4LmV4ZWModXJsKTtcblxuICBpZiAoIXJlc3VsdHMpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGlmICghcmVzdWx0c1syXSkge1xuICAgIHJldHVybiAnJztcbiAgfVxuICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHJlc3VsdHNbMl0ucmVwbGFjZSgvXFwrL2csICcgJykpO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3V0aWwvcXVlcnkuanMiLCIvKipcbiogQGRlc2MgRmV0Y2hlcyBhIGJpZCBmb3IgYW4gYWR2ZXJ0aXNlbWVudCBiYXNlZCBvbiB3aGljaCBzZXJ2aWNlcyBhcmUgZW5hYmxlZCBvbiB1bml0IGFuZCB0aGUgd3JhcHBlci5cbiogQHBhcmFtIHtzdHJpbmd9IGlkIC0gQSBzdHJpbmcgY29udGFpbmluZyB0aGUgYWR2ZXJ0aXNlbWVudCBpZCBjb3JyZXNwb25kaW5nIHRvIHRoZSBkaXYgdGhlIGFkdmVydGlzZW1lbnQgd2lsbCBsb2FkIGludG8uXG4qIEBwYXJhbSB7c3RyaW5nfSBzbG90TmFtZSAtIEEgc3RyaW5nIGNvbnRhaW5pbmcgdGhlIHNsb3QgbmFtZSBvZiB0aGUgYWR2ZXJ0aXNlbWVudCwgZm9yIGluc3RhbmNlICcxMjM0L2Fkbi5jb20vaG9tZXBhZ2UnLlxuKiBAcGFyYW0ge2FycmF5fSBkaW1lbnNpb25zIC0gQW4gYXJyYXkgY29udGFpbmluZyBhbGwgb2YgdGhlIGFwcGxpY2FibGUgc2l6ZXMgdGhlIGFkdmVydGlzZW1lbnQgY2FuIHVzZS5cbiogQHBhcmFtIHtmdW5jdGlvbn0gY2IgLSBBbiBvcHRpb25hbCBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IHNob3VsZCBmaXJlIHdoZW5ldmVyIHRoZSBiaWRkaW5nIGhhcyBjb25jbHVkZWQuXG4qKi9cbmV4cG9ydCBmdW5jdGlvbiBmZXRjaEFtYXpvbkJpZHMoaWQsIHNsb3ROYW1lLCBkaW1lbnNpb25zLCBjYiA9IG51bGwpIHtcbiAgcXVldWVBbWF6b25Db21tYW5kKCgpID0+IHtcbiAgICBjb25zdCBzbG90ID0ge1xuICAgICAgc2xvdE5hbWUsXG4gICAgICBzbG90SUQ6IGlkLFxuICAgICAgc2l6ZXM6IGRpbWVuc2lvbnNcbiAgICB9O1xuXG4gICAgLy8gUmV0cmlldmVzIHRoZSBiaWQgZnJvbSBBbWF6b25cbiAgICB3aW5kb3cuYXBzdGFnLmZldGNoQmlkcyh7IHNsb3RzOiBbc2xvdF0gfSwgKCkgPT4ge1xuICAgICAgLy8gU2V0cyB0aGUgdGFyZ2V0aW5nIHZhbHVlcyBvbiB0aGUgZGlzcGxheSBiaWQgZnJvbSBhcHN0YWdcbiAgICAgIHdpbmRvdy5hcHN0YWcuc2V0RGlzcGxheUJpZHMoKTtcblxuICAgICAgaWYgKGNiKSB7XG4gICAgICAgIGNiKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufVxuXG4vKipcbiogQGRlc2MgQWRkcyBhbiBBbWF6b24gY29tbWFuZCB0byBhIGNhbGxiYWNrIHF1ZXVlIHdoaWNoIGF3YWl0cyBmb3Igd2luZG93LmFwc3RhZ1xuKiBAcGFyYW0ge3N0cmluZ30gY21kIC0gVGhlIGZ1bmN0aW9uIHRoYXQgc2hvdWxkIHdhaXQgZm9yIHdpbmRvdy5hcHN0YWcgdG8gYmUgcmVhZHkuXG4qKi9cbmV4cG9ydCBmdW5jdGlvbiBxdWV1ZUFtYXpvbkNvbW1hbmQoY21kKSB7XG4gIGlmICh3aW5kb3cuYXBzdGFnKSB7XG4gICAgY21kKCk7XG4gIH0gZWxzZSB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBxdWV1ZUFtYXpvbkNvbW1hbmQoY21kKTtcbiAgICB9LCAyMDApO1xuICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvc2VydmljZXMvYW1hem9uLmpzIiwiaW1wb3J0IHsgZGVib3VuY2UgfSBmcm9tICcuLi91dGlsL2RlYm91bmNlJztcbmltcG9ydCB7IGZldGNoQmlkcyB9IGZyb20gJy4vaGVhZGVyYmlkZGluZyc7XG5pbXBvcnQgeyByZWZyZXNoU2xvdCB9IGZyb20gJy4vZ3B0JztcblxuLyoqIEBkZXNjIEFuIG9iamVjdCBjb250YWluaW5nIGFsbCBvZiB0aGUgc2l6ZSBtYXAgcmVmcmVzaCBldmVudCBsaXN0ZW5lcnMgYW5kIGNvcnJlbGF0b3JzIGZvciBzaXplIG1hcHBpbmcuICoqL1xuZXhwb3J0IGNvbnN0IHNpemVtYXBMaXN0ZW5lcnMgPSB7fTtcblxuLyoqIEBkZXNjIEFuIG9iamVjdCBjb250YWluaW5nIGFsbCBvZiB0aGUgc2NyZWVuIHJlc2l6ZSBldmVudCBsaXN0ZW5lcnMgZm9yIHNpemUgbWFwcGluZy4gKiovXG5leHBvcnQgY29uc3QgcmVzaXplTGlzdGVuZXJzID0ge307XG5cbi8qKlxuKiBAZGVzYyBQcmVwYXJlcyBhIHNldCBvZiBkaW1lbnNpb25zIGFuZCB0aGVpciBjb3JyZXNwb25kaW5nIGJyZWFrcG9pbnRzIHRvIGNyZWF0ZSBhIHNpemVtYXAgd2hpY2ggaXMgcmVhZGFibGUgYnkgR1BULlxuKiBAcGFyYW0ge2FycmF5fSBkaW1lbnNpb25zIC0gQW4gYXJyYXkgY29udGFpbmluZyBhbGwgb2YgdGhlIGFwcGxpY2FibGUgc2l6ZXMgdGhlIGFkdmVydGlzZW1lbnQgY2FuIHVzZS5cbiogQHBhcmFtIHthcnJheX0gc2l6ZW1hcCAtIEFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIG9mIHRoZSBhcHBsaWNhYmxlIGJyZWFrcG9pbnRzIGZvciB0aGUgc2l6ZW1hcHBpbmcuXG4qKi9cbmV4cG9ydCBmdW5jdGlvbiBwcmVwYXJlU2l6ZU1hcHMoZGltZW5zaW9ucywgc2l6ZW1hcCkge1xuICBjb25zdCBtYXBwaW5nID0gW107XG4gIGNvbnN0IGJyZWFrcG9pbnRzID0gW107XG4gIGNvbnN0IGNvcnJlbGF0b3JzID0gW107XG4gIGNvbnN0IHBhcnNlZFNpemVtYXAgPSAhc2l6ZW1hcC5sZW5ndGggPyBudWxsIDogSlNPTi5wYXJzZShzaXplbWFwKTtcblxuICBwYXJzZWRTaXplbWFwLmZvckVhY2goKHZhbHVlLCBpbmRleCkgPT4ge1xuICAgIG1hcHBpbmcucHVzaChbdmFsdWUsIGRpbWVuc2lvbnNbaW5kZXhdXSk7XG5cbiAgICAvLyBGaWx0ZXJzIGR1cGxpY2F0ZXMgZnJvbSB0aGUgbWFwcGluZ1xuICAgIGlmIChicmVha3BvaW50cy5pbmRleE9mKHZhbHVlWzBdKSA9PT0gLTEpIHtcbiAgICAgIGJyZWFrcG9pbnRzLnB1c2godmFsdWVbMF0pO1xuICAgICAgY29ycmVsYXRvcnMucHVzaChmYWxzZSk7XG4gICAgfVxuICB9KTtcblxuICBicmVha3BvaW50cy5zb3J0KChhLCBiKSA9PiB7IHJldHVybiBhIC0gYjsgfSk7XG5cbiAgcmV0dXJuIHsgbWFwcGluZywgYnJlYWtwb2ludHMsIGNvcnJlbGF0b3JzIH07XG59XG5cbi8qKlxuKiBAZGVzYyBEZXRlcm1pbmVzIHdoaWNoIHNldCBvZiBhZCBzaXplcyBhcmUgYWJvdXQgdG8gZGlzcGxheSBiYXNlZCBvbiB0aGUgdXNlcnMgY3VycmVudCBzY3JlZW4gc2l6ZS5cbiogQHBhcmFtIHthcnJheX0gc2l6ZU1hcHBpbmdzIC0gQW4gYXJyYXkgY29udGFpbmluZyB0aGUgYWR2ZXJ0aXNlbWVudHMgR1BUIHJlYWRhYmxlIHNpemUgbWFwcGluZy5cbiogQHJldHVybiB7YXJyYXl9IC0gUmV0dXJucyBhbiBhcnJheSBjb250YWluaW5nIHRoZSBhZCBzaXplcyB3aGljaCByZWxhdGUgdG8gdGhlIHVzZXJzIGN1cnJlbnQgd2luZG93IHdpZHRoLlxuKiovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VTaXplTWFwcGluZ3Moc2l6ZU1hcHBpbmdzKSB7XG4gIHRyeSB7XG4gICAgY29uc3Qgd2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aCB8fFxuICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCB8fFxuICAgIGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGg7XG5cbiAgICBjb25zdCBoZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQgfHxcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0IHx8XG4gICAgZG9jdW1lbnQuYm9keS5jbGllbnRIZWlnaHQ7XG5cbiAgICBjb25zdCBzZCA9IFt3aWR0aCwgaGVpZ2h0XTtcblxuICAgIC8qIEZpbHRlcnMgbWFwcGluZ3MgdGhhdCBhcmUgdmFsaWQgYnkgY29uZmlybWluZyB0aGF0IHRoZSBjdXJyZW50IHNjcmVlbiBkaW1lbnNpb25zXG4gICAgICBhcmUgYm90aCBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gdGhlIGJyZWFrcG9pbnQgW3gsIHldIG1pbmltdW1zIHNwZWNpZmllZCBpbiB0aGUgZmlyc3QgcG9zaXRpb24gaW4gdGhlIG1hcHBpbmcuXG4gICAgICBSZXR1cm5zIHRoZSBsZWZ0bW9zdCBtYXBwaW5nJ3Mgc2l6ZXMgb3IgYW4gZW1wdHkgYXJyYXkuICovXG4gICAgY29uc3QgdmFsaWRNYXBwaW5ncyA9IHNpemVNYXBwaW5ncy5maWx0ZXIoKG1hcHBpbmcpID0+IHtcbiAgICAgIHJldHVybiBtYXBwaW5nWzBdWzBdIDw9IHNkWzBdICYmIG1hcHBpbmdbMF1bMV0gPD0gc2RbMV07XG4gICAgfSk7XG5cbiAgICBsZXQgcmVzdWx0ID0gdmFsaWRNYXBwaW5ncy5sZW5ndGggPiAwID8gdmFsaWRNYXBwaW5nc1swXVsxXSA6IFtdO1xuXG4gICAgaWYgKHJlc3VsdC5sZW5ndGggPiAwICYmIHJlc3VsdFswXS5jb25zdHJ1Y3RvciAhPT0gQXJyYXkpIHtcbiAgICAgIC8vIFdyYXBzIHRoZSAxRCBhcnJheSBpbiBhbm90aGVyIHNldCBvZiBicmFja2V0cyB0byBtYWtlIGl0IDJEXG4gICAgICByZXN1bHQgPSBbcmVzdWx0XTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9IGNhdGNoIChlKSB7XG4gICAgLy8gRmFsbGJhY2sgdG8gbGFzdCBzaXplIG1hcHBpbmcgc3VwcGxpZWQgaWYgdGhlcmUncyBhbiBpbnZhbGlkIG1hcHBpbmcgcHJvdmlkZWRcbiAgICByZXR1cm4gc2l6ZU1hcHBpbmdzW3NpemVNYXBwaW5ncy5sZW5ndGggLSAxXVsxXTtcbiAgfVxufVxuXG4vKipcbiogQGRlc2MgUmVzaXplIGV2ZW50IHRoYXQgY2hlY2tzIGlmIGEgdXNlciBoYXMgcmVzaXplZCBwYXN0IGEgYnJlYWtwb2ludCBpbmNsdWRlZCBpbiB0aGUgYWR2ZXJ0aXNlbWVudHMgc2l6ZW1hcC4gSWYgaXQgaGFzIHRoZSBHUFRcbiogcmVmcmVzaCBtZXRob2QgaXMgY2FsbGVkIHNvIHRoZSBzZXJ2aWNlIGNhbiBmZXRjaCBhIG1vcmUgYXByb3ByaWF0ZWx5IHNpemVkIGNyZWF0aXZlLlxuKiBAcGFyYW0ge29iamVjdH0gcGFyYW1zIC0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgYWxsIG9mIHRoZSBhZHZlcnRpc2VtZW50IGNvbmZpZ3VyYXRpb24gc2V0dGluZ3Mgc3VjaCBhcyBzbG90IG5hbWUsIGlkLCBhbmQgcG9zaXRpb24uXG4qKi9cbmV4cG9ydCBmdW5jdGlvbiBydW5SZXNpemVFdmVudHMocGFyYW1zKSB7XG4gIGxldCBsYXN0QnJlYWtwb2ludDtcbiAgbGV0IGluaXRpYWxMb2FkID0gZmFsc2U7XG5cbiAgcmV0dXJuICgpID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBhZCxcbiAgICAgIGJyZWFrcG9pbnRzLFxuICAgICAgaWQsXG4gICAgICBiaWRkaW5nLFxuICAgICAgbWFwcGluZyxcbiAgICAgIHNsb3ROYW1lLFxuICAgICAgd3JhcHBlcixcbiAgICAgIHByZXJlbmRlciB9ID0gcGFyYW1zO1xuXG4gICAgY29uc3Qgd2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICBsZXQgYnJlYWtwb2ludDtcbiAgICBsZXQgbmV4dEJyZWFrcG9pbnQ7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJyZWFrcG9pbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBicmVha3BvaW50ID0gYnJlYWtwb2ludHNbaV07XG4gICAgICBuZXh0QnJlYWtwb2ludCA9IGJyZWFrcG9pbnRzW2kgKyAxXTtcblxuICAgICAgaWYgKCh3aWR0aCA+IGJyZWFrcG9pbnQgJiYgKHdpZHRoIDwgbmV4dEJyZWFrcG9pbnQgfHwgIW5leHRCcmVha3BvaW50KSAmJiBsYXN0QnJlYWtwb2ludCAhPT0gYnJlYWtwb2ludCkgfHwgKHdpZHRoID09PSBicmVha3BvaW50ICYmICFpbml0aWFsTG9hZCkpIHtcbiAgICAgICAgbGFzdEJyZWFrcG9pbnQgPSBicmVha3BvaW50O1xuICAgICAgICBpbml0aWFsTG9hZCA9IHRydWU7XG5cbiAgICAgICAgLy8gRmV0Y2hlcyBhIHNldCBvZiBkaW1lbnNpb25zIGZvciB0aGUgYWQgd2hpY2ggaXMgYWJvdXQgdG8gZGlzcGxheS5cbiAgICAgICAgY29uc3QgcGFyc2VkU2l6ZU1hcHBpbmcgPSBwYXJzZVNpemVNYXBwaW5ncyhtYXBwaW5nKTtcblxuICAgICAgICBjb25zdCBhZEluZm8gPSB7XG4gICAgICAgICAgYWRVbml0OiBhZCxcbiAgICAgICAgICBhZFNsb3Q6IHNsb3ROYW1lLFxuICAgICAgICAgIGFkRGltZW5zaW9uczogcGFyc2VkU2l6ZU1hcHBpbmcsXG4gICAgICAgICAgYWRJZDogaWRcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBJZiBpdCdzIGluY2x1ZGVkIGluIGEgaGVhZGVyLWJpZGRpbmcgc2VydmljZSB3ZSByZS1mZXRjaCBiaWRzIGZvciB0aGUgZ2l2ZW4gc2xvdCwgb3RoZXJ3aXNlIGl0IHJlZnJlc2hlcyBhcyBub3JtYWwuXG4gICAgICAgIGlmICgoYmlkZGluZy5wcmViaWQgJiYgYmlkZGluZy5wcmViaWQuZW5hYmxlZCkgfHwgKGJpZGRpbmcuYW1hem9uICYmIGJpZGRpbmcuYW1hem9uLmVuYWJsZWQpKSB7XG4gICAgICAgICAgZmV0Y2hCaWRzKHtcbiAgICAgICAgICAgIGFkLFxuICAgICAgICAgICAgaWQsXG4gICAgICAgICAgICBzbG90TmFtZSxcbiAgICAgICAgICAgIGRpbWVuc2lvbnM6IHBhcnNlZFNpemVNYXBwaW5nLFxuICAgICAgICAgICAgYmlkZGluZyxcbiAgICAgICAgICAgIHdyYXBwZXIsXG4gICAgICAgICAgICBwcmVyZW5kZXIsXG4gICAgICAgICAgICBjb3JyZWxhdG9yOiBzaXplbWFwTGlzdGVuZXJzW2lkXS5jb3JyZWxhdG9yc1tpXVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlZnJlc2hTbG90KHtcbiAgICAgICAgICAgIGFkLFxuICAgICAgICAgICAgY29ycmVsYXRvcjogc2l6ZW1hcExpc3RlbmVyc1tpZF0uY29ycmVsYXRvcnNbaV0sXG4gICAgICAgICAgICBwcmVyZW5kZXIsXG4gICAgICAgICAgICBpbmZvOiBhZEluZm9cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBzaXplbWFwTGlzdGVuZXJzW2lkXS5jb3JyZWxhdG9yc1tpXSA9IHRydWU7XG4gICAgfVxuICB9O1xufVxuXG4vKipcbiogQGRlc2MgQXNzaWducyBhbiBldmVudCBsaXN0ZW5lciBmb3IgYSBzaXplIG1hcHBlZCBhZCB3aGljaCBkZXRlY3RzIHdoZW4gdGhlIHNjcmVlbiByZXNpemVzIHBhc3QgYSBicmVha3BvaW50IGluIHRoZSBzaXplbWFwLlxuKiBBbHNvIHN0b3JlcyB0aGUgZXZlbnQgbGlzdGVuZXIgaW4gYW4gb2JqZWN0IHNvcnRlZCBieSB0aGUgYWR2ZXJ0aXNlbWVudCBpZCBzbyBpdCBjYW4gYmUgdW5ib3VuZCBsYXRlciBpZiBuZWVkZWQuXG4qIEBwYXJhbSB7b2JqZWN0fSBwYXJhbXMgLSBBbiBvYmplY3QgY29udGFpbmluZyBhbGwgb2YgdGhlIGFkdmVydGlzZW1lbnQgY29uZmlndXJhdGlvbiBzZXR0aW5ncyBzdWNoIGFzIHNsb3QgbmFtZSwgaWQsIGFuZCBwb3NpdGlvbi5cbioqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldFJlc2l6ZUxpc3RlbmVyKHBhcmFtcykge1xuICBjb25zdCB7IGlkLCBjb3JyZWxhdG9ycyB9ID0gcGFyYW1zO1xuXG4gIHJlc2l6ZUxpc3RlbmVyc1tpZF0gPSBkZWJvdW5jZShydW5SZXNpemVFdmVudHMocGFyYW1zKSwgMjUwKTtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlc2l6ZUxpc3RlbmVyc1tpZF0pO1xuXG4gIC8vIEFkZHMgdGhlIGxpc3RlbmVyIHRvIGFuIG9iamVjdCB3aXRoIHRoZSBpZCBhcyB0aGUga2V5IHNvIHdlIGNhbiB1bmJpbmQgaXQgbGF0ZXIuXG4gIHNpemVtYXBMaXN0ZW5lcnNbaWRdID0geyBsaXN0ZW5lcjogcmVzaXplTGlzdGVuZXJzW2lkXSwgY29ycmVsYXRvcnMgfTtcbn1cblxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3NlcnZpY2VzL3NpemVtYXBwaW5nLmpzIiwiLyoqXG4qIEBkZXNjIERlYm91bmNlcyBhIGZ1bmN0aW9uIHByZXZlbnRpbmcgaXQgZnJvbSBydW5uaW5nIG1vcmUgdGhlbiBldmVyeSBzbyBtYW55IG1pbGxpc2VjZG9uZHMuIFVzZWZ1bCBmb3Igc2Nyb2xsIG9yIHJlc2l6ZSBoYW5kZWxycy5cbiogQHBhcmFtIHtmdW5jdGlvbn0gZnVuYyAtIFRoZSBmdW5jdGlvbiB0aGF0IHNob3VsZCBiZSBkZWJvdW5jZWQuXG4qIEBwYXJhbSB7bnVtYmVyfSB3YWl0IC0gVGhlIGFtb3VudCBvZiB0aW1lIGEgZnVuY3Rpb24gc2hvdWxkIHdhaXQgYmVmb3JlIGl0IGZpcmVzIGFnYWluLlxuKiBAcmV0dXJuIC0gUmV0dXJucyBhIGZ1bmN0aW9uIGV2ZXJ5IHNvIG1hbnkgbWlsbGlzZWNvbmRzIGJhc2VkIG9uIHRoZSBwcm92aWRlZCBwYXJhbWV0ZXJzLlxuKiovXG5leHBvcnQgZnVuY3Rpb24gZGVib3VuY2UoZnVuYywgd2FpdCkge1xuICBsZXQgdGltZW91dDtcbiAgcmV0dXJuIGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgZnVuYy5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9LCB3YWl0KTtcbiAgfTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy91dGlsL2RlYm91bmNlLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==