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
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
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

var _resources = __webpack_require__(2);

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
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initializeBiddingServices = initializeBiddingServices;
exports.fetchBids = fetchBids;

var _resources = __webpack_require__(2);

var _prebid = __webpack_require__(3);

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
/* 2 */
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
/* 3 */
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
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ArcAds = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mobile = __webpack_require__(5);

var _customTargeting = __webpack_require__(10);

var _headerbidding = __webpack_require__(1);

var _gpt = __webpack_require__(0);

var _prebid = __webpack_require__(3);

var _sizemapping = __webpack_require__(8);

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
/* 5 */
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
/* 9 */
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

/***/ }),
/* 10 */
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

/***/ })
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCAwMzQyZjI5MTdhZDUyM2M1MDYyYyIsIndlYnBhY2s6Ly8vLi9zcmMvc2VydmljZXMvZ3B0LmpzIiwid2VicGFjazovLy8uL3NyYy9zZXJ2aWNlcy9oZWFkZXJiaWRkaW5nLmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsL3Jlc291cmNlcy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc2VydmljZXMvcHJlYmlkLmpzIiwid2VicGFjazovLy8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbC9tb2JpbGUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWwvcXVlcnkuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NlcnZpY2VzL2FtYXpvbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc2VydmljZXMvc2l6ZW1hcHBpbmcuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWwvZGVib3VuY2UuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWwvY3VzdG9tVGFyZ2V0aW5nLmpzIl0sIm5hbWVzIjpbImluaXRpYWxpemVHUFQiLCJyZWZyZXNoU2xvdCIsInF1ZXVlR29vZ2xldGFnQ29tbWFuZCIsInNldFRhcmdldGluZyIsImRmcFNldHRpbmdzIiwiZGV0ZXJtaW5lU2xvdE5hbWUiLCJ3aW5kb3ciLCJnb29nbGV0YWciLCJjbWQiLCJhZCIsImNvcnJlbGF0b3IiLCJwcmVyZW5kZXIiLCJpbmZvIiwiUHJvbWlzZSIsInJlc29sdmUiLCJ0aGVuIiwiZXJyb3IiLCJjb25zb2xlIiwid2FybiIsInJ1blJlZnJlc2hFdmVudCIsInB1YmFkc1JlYWR5IiwicHViYWRzIiwicmVmcmVzaCIsImNoYW5nZUNvcnJlbGF0b3IiLCJzZXRUaW1lb3V0IiwiZm4iLCJwdXNoIiwib3B0aW9ucyIsImtleSIsImhhc093blByb3BlcnR5IiwiaGFuZGxlU2xvdFJlbmRlckVuZGVkIiwiZGlzYWJsZUluaXRpYWxMb2FkIiwiZW5hYmxlU2luZ2xlUmVxdWVzdCIsImVuYWJsZUFzeW5jUmVuZGVyaW5nIiwiZW5hYmxlU2VydmljZXMiLCJhZGRFdmVudExpc3RlbmVyIiwiZGZwQ29kZSIsInNsb3ROYW1lIiwic2xvdE92ZXJyaWRlIiwiaW5pdGlhbGl6ZUJpZGRpbmdTZXJ2aWNlcyIsImZldGNoQmlkcyIsInByZWJpZCIsImFtYXpvbiIsImFyY0JpZGRpbmdSZWFkeSIsImVuYWJsZVByZWJpZCIsImVuYWJsZWQiLCJwYmpzIiwicXVlIiwiZW5hYmxlQW1hem9uIiwiaWQiLCJhcHN0YWciLCJpbml0IiwicHViSUQiLCJhZFNlcnZlciIsImFsbCIsImRpbWVuc2lvbnMiLCJ3cmFwcGVyIiwiYmlkZGluZyIsImFkSW5mbyIsImFkVW5pdCIsImFkU2xvdCIsImFkRGltZW5zaW9ucyIsImFkSWQiLCJwcmViaWRCaWRzIiwidGltZW91dCIsImJpbmQiLCJhbWF6b25CaWRzIiwiYXBwZW5kUmVzb3VyY2UiLCJ0YWduYW1lIiwidXJsIiwiYXN5bmMiLCJkZWZlciIsImNiIiwidGFnIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50Iiwic3JjIiwiaGVhZCIsImRvY3VtZW50RWxlbWVudCIsImFwcGVuZENoaWxkIiwicXVldWVQcmViaWRDb21tYW5kIiwiZmV0Y2hQcmViaWRCaWRzIiwiYWRkVW5pdCIsInJlcXVlc3RCaWRzIiwiYWRVbml0Q29kZXMiLCJiaWRzQmFja0hhbmRsZXIiLCJzZXRUYXJnZXRpbmdGb3JHUFRBc3luYyIsImNvZGUiLCJzaXplcyIsImJpZHMiLCJzbG90Iiwic2l6ZUNvbmZpZyIsImFkZEFkVW5pdHMiLCJzZXRDb25maWciLCJBcmNBZHMiLCJoYW5kbGVTbG90UmVuZGVyZWQiLCJkZnBJZCIsImRmcCIsInBvc2l0aW9ucyIsImlzTW9iaWxlIiwicGFyYW1zIiwiYWRUeXBlIiwidGFyZ2V0aW5nIiwiZGlzcGxheSIsInBvc2l0aW9uIiwiYXMiLCJPYmplY3QiLCJhc3NpZ24iLCJwb3NpdGlvblBhcmFtIiwiYW55IiwiZGlzcGxheUFkIiwiY29sbGVjdGlvbiIsImZvckVhY2giLCJhZHZlcnQiLCJyZWdpc3RlckFkIiwic2l6ZW1hcCIsImZ1bGxTbG90TmFtZSIsInBhcnNlZERpbWVuc2lvbnMiLCJsZW5ndGgiLCJKU09OIiwicGFyc2UiLCJkZWZpbmVPdXRPZlBhZ2VTbG90IiwiZGVmaW5lU2xvdCIsImJyZWFrcG9pbnRzIiwibWFwcGluZyIsImNvcnJlbGF0b3JzIiwiZGVmaW5lU2l6ZU1hcHBpbmciLCJhZGRTZXJ2aWNlIiwiTW9iaWxlRGV0ZWN0aW9uIiwibmF2aWdhdG9yIiwidXNlckFnZW50IiwibWF0Y2giLCJyZXRpbmEiLCJkZXZpY2VQaXhlbFJhdGlvIiwiQW5kcm9pZCIsIktpbmRsZSIsIktpbmRsZUZpcmUiLCJTaWxrIiwiQmxhY2tCZXJyeSIsImlPUyIsIldpbmRvd3MiLCJGaXJlZm94T1MiLCJleHBhbmRRdWVyeVN0cmluZyIsInBhcmFtIiwibG9jYXRpb24iLCJocmVmIiwibmFtZSIsInJlcGxhY2UiLCJyZWdleCIsIlJlZ0V4cCIsInJlc3VsdHMiLCJleGVjIiwiZGVjb2RlVVJJQ29tcG9uZW50IiwiZmV0Y2hBbWF6b25CaWRzIiwicXVldWVBbWF6b25Db21tYW5kIiwic2xvdElEIiwic2xvdHMiLCJzZXREaXNwbGF5QmlkcyIsInByZXBhcmVTaXplTWFwcyIsInBhcnNlU2l6ZU1hcHBpbmdzIiwicnVuUmVzaXplRXZlbnRzIiwic2V0UmVzaXplTGlzdGVuZXIiLCJzaXplbWFwTGlzdGVuZXJzIiwicmVzaXplTGlzdGVuZXJzIiwicGFyc2VkU2l6ZW1hcCIsInZhbHVlIiwiaW5kZXgiLCJpbmRleE9mIiwic29ydCIsImEiLCJiIiwic2l6ZU1hcHBpbmdzIiwid2lkdGgiLCJpbm5lcldpZHRoIiwiY2xpZW50V2lkdGgiLCJib2R5IiwiaGVpZ2h0IiwiaW5uZXJIZWlnaHQiLCJjbGllbnRIZWlnaHQiLCJzZCIsInZhbGlkTWFwcGluZ3MiLCJmaWx0ZXIiLCJyZXN1bHQiLCJjb25zdHJ1Y3RvciIsIkFycmF5IiwiZSIsImxhc3RCcmVha3BvaW50IiwiaW5pdGlhbExvYWQiLCJicmVha3BvaW50IiwibmV4dEJyZWFrcG9pbnQiLCJpIiwicGFyc2VkU2l6ZU1hcHBpbmciLCJsaXN0ZW5lciIsImRlYm91bmNlIiwiZnVuYyIsIndhaXQiLCJhcmdzIiwiY2xlYXJUaW1lb3V0IiwiYXBwbHkiLCJyZW5hbWVQb3NpdGlvbktleSIsInBvc2l0aW9uVmFsdWUiLCJuZXdUYXJnZXRpbmdPYmplY3QiLCJrZXlOYW1lIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTztBQ1ZBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7O1FDdkRnQkEsYSxHQUFBQSxhO1FBZUFDLFcsR0FBQUEsVztRQXVDQUMscUIsR0FBQUEscUI7UUFTQUMsWSxHQUFBQSxZO1FBWUFDLFcsR0FBQUEsVztRQWlCQUMsaUIsR0FBQUEsaUI7O0FBbEdoQjs7QUFDQTs7QUFFQTs7O0FBR08sU0FBU0wsYUFBVCxHQUF5QjtBQUM5Qk0sU0FBT0MsU0FBUCxHQUFtQkQsT0FBT0MsU0FBUCxJQUFvQixFQUF2QztBQUNBRCxTQUFPQyxTQUFQLENBQWlCQyxHQUFqQixHQUF1QkYsT0FBT0Ms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LFVBQVVwRyxVQUFVRSxRQUFWLENBQW1CQyxFQUFuQztBQUNBLFNBQU9nRyxtQkFBbUJqRyxRQUExQjtBQUNBaUcscUJBQW1CQyxPQUFuQixJQUE4QkYsYUFBOUI7QUFDQTlGLFNBQU9DLE1BQVAsQ0FBY0wsU0FBZCxFQUF5Qm1HLGtCQUF6QjtBQUNBLFNBQU9uRyxTQUFQO0FBQ0QsQyIsImZpbGUiOiJhcmNhZHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2Uge1xuXHRcdHZhciBhID0gZmFjdG9yeSgpO1xuXHRcdGZvcih2YXIgaSBpbiBhKSAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnID8gZXhwb3J0cyA6IHJvb3QpW2ldID0gYVtpXTtcblx0fVxufSkodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnID8gc2VsZiA6IHRoaXMsIGZ1bmN0aW9uKCkge1xucmV0dXJuIFxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA0KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCAwMzQyZjI5MTdhZDUyM2M1MDYyYyIsImltcG9ydCB7IGFwcGVuZFJlc291cmNlIH0gZnJvbSAnLi4vdXRpbC9yZXNvdXJjZXMnO1xuaW1wb3J0IHsgZXhwYW5kUXVlcnlTdHJpbmcgfSBmcm9tICcuLi91dGlsL3F1ZXJ5JztcblxuLyoqXG4qIEBkZXNjIEluaXRpYWxpemVzIHRoZSBHb29nbGUgUHVibGlzaGVyIHRhZyBzY3JpcHRzLlxuKiovXG5leHBvcnQgZnVuY3Rpb24gaW5pdGlhbGl6ZUdQVCgpIHtcbiAgd2luZG93Lmdvb2dsZXRhZyA9IHdpbmRvdy5nb29nbGV0YWcgfHwge307XG4gIHdpbmRvdy5nb29nbGV0YWcuY21kID0gd2luZG93Lmdvb2dsZXRhZy5jbWQgfHwgW107XG5cbiAgYXBwZW5kUmVzb3VyY2UoJ3NjcmlwdCcsICcvL3d3dy5nb29nbGV0YWdzZXJ2aWNlcy5jb20vdGFnL2pzL2dwdC5qcycsIHRydWUsIHRydWUpO1xufVxuXG4vKipcbiogQGRlc2MgUmVmcmVzaGVzIGFuIGFkdmVydGlzZW1lbnQgdmlhIHRoZSBHUFQgcmVmcmVzaCBtZXRob2QuIElmIGEgcHJlcmVuZGVyIGZ1bmN0aW9uIGlzIHByb3ZpZGVkIGl0IGlzIGV4ZWN1dGVkIHByaW9yIHRvIHRoZSByZWZyZXNoLlxuKiBAcGFyYW0ge29iamVjdH0gb2JqIC0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgYWxsIG9mIHRoZSBmdW5jdGlvbiBhcmd1bWVudHMuXG4qIEBwYXJhbSB7T2JqZWN0fSBvYmouYWQgLSBBbiBvYmplY3QgY29udGFpbmluZyB0aGUgR1BUIGFkIHNsb3QuXG4qIEBwYXJhbSB7Ym9vbGVhbn0gb2JqLmNvcnJlbGF0b3IgLSBBbiBvcHRpb25hbCBib29sZWFuIHRoYXQgZGVzY3JpYmVzIGlmIHRoZSBjb3JyZWxhdG9yIHZhbHVlIHNob3VsZCB1cGRhdGUgb3Igbm90LlxuKiBAcGFyYW0ge2Z1bmN0aW9ufSBvYmoucHJlcmVuZGVyIC0gQW4gb3B0aW9uYWwgZnVuY3Rpb24gdGhhdCB3aWxsIHJ1biBiZWZvcmUgdGhlIGFkdmVydGlzZW1lbnQgcmVuZGVycy5cbiogQHBhcmFtIHtvYmplY3R9IG9iai5pbmZvIC0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGFkdmVydGlzZW1lbnQgdGhhdCBpcyBhYm91dCB0byBsb2FkLlxuKiovXG5leHBvcnQgZnVuY3Rpb24gcmVmcmVzaFNsb3Qoe1xuICBhZCxcbiAgY29ycmVsYXRvciA9IGZhbHNlLFxuICBwcmVyZW5kZXIgPSBudWxsLFxuICBpbmZvID0ge31cbn0pIHtcbiAgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBpZiAocHJlcmVuZGVyKSB7XG4gICAgICB0cnkge1xuICAgICAgICBwcmVyZW5kZXIoaW5mbykudGhlbigoKSA9PiB7XG4gICAgICAgICAgcmVzb2x2ZSgnUHJlcmVuZGVyIGZ1bmN0aW9uIGhhcyBjb21wbGV0ZWQuJyk7XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS53YXJuKGBBcmNBZHM6IFByZXJlbmRlciBmdW5jdGlvbiBkaWQgbm90IHJldHVybiBhIHByb21pc2Ugb3IgdGhlcmUgd2FzIGFuIGVycm9yLlxuICAgICAgICAgIERvY3VtZW50YXRpb246IGh0dHBzOi8vZ2l0aHViLmNvbS93YXBvcGFydG5lcnMvYXJjLWFkcy93aWtpL1V0aWxpemluZy1hLVByZXJlbmRlci1Ib29rYCk7XG4gICAgICAgIHJlc29sdmUoJ1ByZXJlbmRlciBmdW5jdGlvbiBkaWQgbm90IHJldHVybiBhIHByb21pc2Ugb3IgdGhlcmUgd2FzIGFuIGVycm9yLCBpZ25vcmluZy4nKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmVzb2x2ZSgnTm8gUHJlcmVuZGVyIGZ1bmN0aW9uIHdhcyBwcm92aWRlZC4nKTtcbiAgICB9XG4gIH0pLnRoZW4oKCkgPT4ge1xuICAgIHJ1blJlZnJlc2hFdmVudCgpO1xuICB9KTtcblxuICBmdW5jdGlvbiBydW5SZWZyZXNoRXZlbnQoKSB7XG4gICAgaWYgKHdpbmRvdy5nb29nbGV0YWcgJiYgZ29vZ2xldGFnLnB1YmFkc1JlYWR5KSB7XG4gICAgICB3aW5kb3cuZ29vZ2xldGFnLnB1YmFkcygpLnJlZnJlc2goW2FkXSwgeyBjaGFuZ2VDb3JyZWxhdG9yOiBjb3JyZWxhdG9yIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgcnVuUmVmcmVzaEV2ZW50KCk7XG4gICAgICB9LCAyMDApO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiogQGRlc2MgUXVldWVzIGEgY29tbWFuZCBpbnNpZGUgb2YgR1BULlxuKiBAcGFyYW0ge2Z1bmN0aW9ufSBmbiAtIEFjY2VwdHMgYSBmdW5jdGlvbiB0byBwdXNoIGludG8gdGhlIFByZWJpZCBjb21tYW5kIHF1ZXVlLlxuKiovXG5leHBvcnQgZnVuY3Rpb24gcXVldWVHb29nbGV0YWdDb21tYW5kKGZuKSB7XG4gIHdpbmRvdy5nb29nbGV0YWcuY21kLnB1c2goZm4pO1xufVxuXG4vKipcbiogQGRlc2MgQXNzaWducyBrZXkvdmFsdWUgdGFyZ2V0aW5nIHRvIGEgc3BlY2lmaWMgYWR2ZXJ0aXNlbWVudC5cbiogQHBhcmFtIHtPYmplY3R9IGFkIC0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIEdQVCBhZCBzbG90LlxuKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIEFuIG9iamVjdCBjb250YWluaW5nIGFsbCBvZiB0aGUga2V5L3ZhbHVlIHRhcmdldGluZyBwYWlycyB0byBhc3NpZ24gdG8gdGhlIGFkdmVydGlzZW1lbnQuXG4qKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRUYXJnZXRpbmcoYWQsIG9wdGlvbnMpIHtcbiAgZm9yIChjb25zdCBrZXkgaW4gb3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zLmhhc093blByb3BlcnR5KGtleSkgJiYgb3B0aW9uc1trZXldKSB7XG4gICAgICBhZC5zZXRUYXJnZXRpbmcoa2V5LCBvcHRpb25zW2tleV0pO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiogQGRlc2MgQ29uZmlndXJlcyB0aGUgR1BUIGNvbmZpZ3VyYXRpb24gb3B0aW9ucy5cbiogQHBhcmFtIHtmdW5jdGlvbn0gaGFuZGxlU2xvdFJlbmRlckVuZGVkIC0gQ2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBnZXRzIGZpcmVkIHdoZW5ldmVyIGEgR1BUIGFkIHNsb3QgaGFzIGZpbmlzaGVkIHJlbmRlcmluZy5cbioqL1xuZXhwb3J0IGZ1bmN0aW9uIGRmcFNldHRpbmdzKGhhbmRsZVNsb3RSZW5kZXJFbmRlZCkge1xuICB3aW5kb3cuZ29vZ2xldGFnLnB1YmFkcygpLmRpc2FibGVJbml0aWFsTG9hZCgpO1xuICB3aW5kb3cuZ29vZ2xldGFnLnB1YmFkcygpLmVuYWJsZVNpbmdsZVJlcXVlc3QoKTtcbiAgd2luZG93Lmdvb2dsZXRhZy5wdWJhZHMoKS5lbmFibGVBc3luY1JlbmRlcmluZygpO1xuICB3aW5kb3cuZ29vZ2xldGFnLmVuYWJsZVNlcnZpY2VzKCk7XG5cbiAgaWYgKGhhbmRsZVNsb3RSZW5kZXJFbmRlZCkge1xuICAgIHdpbmRvdy5nb29nbGV0YWcucHViYWRzKCkuYWRkRXZlbnRMaXN0ZW5lcignc2xvdFJlbmRlckVuZGVkJywgaGFuZGxlU2xvdFJlbmRlckVuZGVkKTtcbiAgfVxufVxuXG4vKipcbiogQGRlc2MgRGV0ZXJtaW5lcyB0aGUgZnVsbCBzbG90IG5hbWUgb2YgdGhlIGFkIHVuaXQuIElmIGEgdXNlciBhcHBlbmRzIGFuICdhZHNsb3QnIHF1ZXJ5IHBhcmFtZXRlciB0byB0aGUgcGFnZSBVUkwgdGhlIHNsb3QgbmFtZSB3aWxsIGJlIHZlcnJpZGRlbi5cbiogQHBhcmFtIHtzdHJpbmd9IGRmcENvZGUgLSBBIHN0cmluZyBjb250YWluaW5nIHRoZSBwdWJsaXNoZXJzIERGUCBpZCBjb2RlLlxuKiBAcGFyYW0ge3N0cmluZ30gc2xvdE5hbWUgLSBBIHN0cmluZyBjb250YWluaW5nIHRoZSBzbG90IG5hbWUgb2YgdGhlIGFkdmVydGlzZW1lbnQsIGZvciBleGFtcGxlICdob21lcGFnZScuXG4qIEByZXR1cm4gLSBSZXR1cm5zIGEgc3RyaW5nIGNvbWJpbmluZyB0aGUgREZQIGlkIGNvZGUgYW5kIHRoZSBzbG90IG5hbWUsIGZvciBleGFtcGxlICcxMjMvaG9tZXBhZ2UnLlxuKiovXG5leHBvcnQgZnVuY3Rpb24gZGV0ZXJtaW5lU2xvdE5hbWUoZGZwQ29kZSwgc2xvdE5hbWUpIHtcbiAgY29uc3Qgc2xvdE92ZXJyaWRlID0gZXhwYW5kUXVlcnlTdHJpbmcoJ2Fkc2xvdCcpO1xuICBpZiAoc2xvdE92ZXJyaWRlICYmIChzbG90T3ZlcnJpZGUgIT09ICcnIHx8IHNsb3RPdmVycmlkZSAhPT0gbnVsbCkpIHtcbiAgICByZXR1cm4gYCR7ZGZwQ29kZX0vJHtzbG90T3ZlcnJpZGV9YDtcbiAgfVxuICByZXR1cm4gYCR7ZGZwQ29kZX0vJHtzbG90TmFtZX1gO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3NlcnZpY2VzL2dwdC5qcyIsImltcG9ydCB7IGFwcGVuZFJlc291cmNlIH0gZnJvbSAnLi4vdXRpbC9yZXNvdXJjZXMnO1xuaW1wb3J0IHsgZmV0Y2hQcmViaWRCaWRzLCBxdWV1ZVByZWJpZENvbW1hbmQgfSBmcm9tICcuL3ByZWJpZCc7XG5pbXBvcnQgeyBmZXRjaEFtYXpvbkJpZHMsIHF1ZXVlQW1hem9uQ29tbWFuZCB9IGZyb20gJy4vYW1hem9uJztcbmltcG9ydCB7IHJlZnJlc2hTbG90IH0gZnJvbSAnLi9ncHQnO1xuXG4vKipcbiogQGRlc2MgSW5pdGlhbGl6ZXMgYWxsIGhlYWRlciBiaWRkaW5nIHNlcnZpY2VzIGFuZCBhcHBlbmRzIHRoZSBhcHBsaWNhYmxlIHNjcmlwdHMgdG8gdGhlIHBhZ2UuXG4qIEBwYXJhbSB7b2JqZWN0fSBvYmogLSBBbiBvYmplY3QgY29udGFpbmluZyBhbGwgb2YgdGhlIGZ1bmN0aW9uIGFyZ3VtZW50cy5cbiogQHBhcmFtIHtvYmplY3R9IG9iai5wcmViaWQgLSBBbiBvYmplY3QgY29udGFpbmluZyBjb25maWd1cmF0aW9uIGRhdGEgZm9yIFByZWJpZC5qcy5cbiogQHBhcmFtIHtvYmplY3R9IG9iai5hbWF6b24gLSBBbiBvYmplY3QgY29udGFpbmluZyBjb25maWd1cmF0aW9uIGRhdGEgZm9yIEFtYXpvbiBBOSBhbmQgVEFNLlxuKiovXG5leHBvcnQgZnVuY3Rpb24gaW5pdGlhbGl6ZUJpZGRpbmdTZXJ2aWNlcyh7XG4gIHByZWJpZCA9IGZhbHNlLFxuICBhbWF6b24gPSBmYWxzZVxufSkge1xuICB3aW5kb3cuYXJjQmlkZGluZ1JlYWR5ID0gZmFsc2U7XG5cbiAgY29uc3QgZW5hYmxlUHJlYmlkID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBpZiAocHJlYmlkICYmIHByZWJpZC5lbmFibGVkKSB7XG4gICAgICBjb25zdCBwYmpzID0gcGJqcyB8fCB7fTtcbiAgICAgIHBianMucXVlID0gcGJqcy5xdWUgfHwgW107XG5cbiAgICAgIHJlc29sdmUoJ1ByZWJpZCBoYXMgYmVlbiBpbml0aWFsaXplZCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXNvbHZlKCdQcmViaWQgaXMgbm90IGVuYWJsZWQgb24gdGhlIHdyYXBwZXIuLi4nKTtcbiAgICB9XG4gIH0pO1xuXG4gIGNvbnN0IGVuYWJsZUFtYXpvbiA9IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgaWYgKGFtYXpvbiAmJiBhbWF6b24uZW5hYmxlZCkge1xuICAgICAgYXBwZW5kUmVzb3VyY2UoJ3NjcmlwdCcsICcvL2MuYW1hem9uLWFkc3lzdGVtLmNvbS9hYXgyL2Fwc3RhZy5qcycsIHRydWUsIHRydWUsICgpID0+IHtcbiAgICAgICAgaWYgKGFtYXpvbi5pZCAmJiBhbWF6b24uaWQgIT09ICcnKSB7XG4gICAgICAgICAgcXVldWVBbWF6b25Db21tYW5kKCgpID0+IHtcbiAgICAgICAgICAgIC8vIEluaXRpYWxpemVzIHRoZSBBbWF6b24gQVBTIHRhZyBzY3JpcHQuXG4gICAgICAgICAgICB3aW5kb3cuYXBzdGFnLmluaXQoe1xuICAgICAgICAgICAgICBwdWJJRDogYW1hem9uLmlkLFxuICAgICAgICAgICAgICBhZFNlcnZlcjogJ2dvb2dsZXRhZydcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXNvbHZlKCdBbWF6b24gc2NyaXB0cyBoYXZlIGJlZW4gYWRkZWQgb250byB0aGUgcGFnZSEnKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLndhcm4oYEFyY0FkczogTWlzc2luZyBBbWF6b24gYWNjb3VudCBpZC4gXG4gICAgICAgICAgICBEb2N1bWVudGF0aW9uOiBodHRwczovL2dpdGh1Yi5jb20vd2Fwb3BhcnRuZXJzL2FyYy1hZHMjYW1hem9uLXRhbWE5YCk7XG4gICAgICAgICAgcmVzb2x2ZSgnQW1hem9uIGlzIG5vdCBlbmFibGVkIG9uIHRoZSB3cmFwcGVyLi4uJyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXNvbHZlKCdBbWF6b24gaXMgbm90IGVuYWJsZWQgb24gdGhlIHdyYXBwZXIuLi4nKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIFdhaXRzIGZvciBhbGwgaGVhZGVyIGJpZGRpbmcgc2VydmljZXMgdG8gYmUgaW5pdGlhbGl6ZWQgYmVmb3JlIHRlbGxpbmcgdGhlIHNlcnZpY2UgaXQncyByZWFkeSB0byByZXRyaWV2ZSBiaWRzLlxuICBQcm9taXNlLmFsbChbZW5hYmxlUHJlYmlkLCBlbmFibGVBbWF6b25dKVxuICAgIC50aGVuKCgpID0+IHtcbiAgICAgIHdpbmRvdy5hcmNCaWRkaW5nUmVhZHkgPSB0cnVlO1xuICAgIH0pO1xufVxuXG4vKipcbiogQGRlc2MgRmV0Y2hlcyBhIGJpZCBmb3IgYW4gYWR2ZXJ0aXNlbWVudCBiYXNlZCBvbiB3aGljaCBzZXJ2aWNlcyBhcmUgZW5hYmxlZCBvbiB1bml0IGFuZCB0aGUgd3JhcHBlci5cbiogQHBhcmFtIHtvYmplY3R9IG9iaiAtIEFuIG9iamVjdCBjb250YWluaW5nIGFsbCBvZiB0aGUgZnVuY3Rpb24gYXJndW1lbnRzLlxuKiBAcGFyYW0ge09iamVjdH0gb2JqLmFkIC0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIEdQVCBhZCBzbG90LlxuKiBAcGFyYW0ge3N0cmluZ30gb2JqLmlkIC0gQSBzdHJpbmcgY29udGFpbmluZyB0aGUgYWR2ZXJ0aXNlbWVudCBpZCBjb3JyZXNwb25kaW5nIHRvIHRoZSBkaXYgdGhlIGFkdmVydGlzZW1lbnQgd2lsbCBsb2FkIGludG8uXG4qIEBwYXJhbSB7c3RyaW5nfSBvYmouc2xvdE5hbWUgLSBBIHN0cmluZyBjb250YWluaW5nIHRoZSBzbG90IG5hbWUgb2YgdGhlIGFkdmVydGlzZW1lbnQsIGZvciBpbnN0YW5jZSAnMTIzNC9hZG4uY29tL2hvbWVwYWdlJy5cbiogQHBhcmFtIHtBcnJheX0gb2JqLmRpbWVuc2lvbnMgLSBBbiBhcnJheSBjb250YWluaW5nIGFsbCBvZiB0aGUgYXBwbGljYWJsZSBzaXplcyB0aGUgYWR2ZXJ0aXNlbWVudCBjYW4gdXNlLlxuKiBAcGFyYW0ge09iamVjdH0gb2JqLndyYXBwZXIgLSBBbiBvYmplY3QgY29udGFpbmluZyBhbGwgb2YgdGhlIHdyYXBwZXIgc2V0dGluZ3MuXG4qIEBwYXJhbSB7QXJyYXl9IG9iai5iaWRkaW5nIC0gQ29udGFpbnMgYWxsIG9mIHRoZSBhcHBsaWNhYmxlIGJpZCBkYXRhLCBzdWNoIGFzIHdoaWNoIHZlbmRvcnMgdG8gdXNlIGFuZCB0aGVpciBwbGFjZW1lbnQgaWRzLlxuKiBAcGFyYW0ge2Jvb2xlYW59IG9iai5jb3JyZWxhdG9yIC0gQW4gb3B0aW9uYWwgYm9vbGVhbiB0aGF0IGRlc2NyaWJlcyBpZiB0aGUgY29ycmVsYXRvciB2YWx1ZSBzaG91bGQgdXBkYXRlIG9yIG5vdC5cbiogQHBhcmFtIHtmdW5jdGlvbn0gb2JqLnByZXJlbmRlciAtIEFuIG9wdGlvbmFsIGZ1bmN0aW9uIHRoYXQgd2lsbCBydW4gYmVmb3JlIHRoZSBhZHZlcnRpc2VtZW50IHJlbmRlcnMuXG4qKi9cbmV4cG9ydCBmdW5jdGlvbiBmZXRjaEJpZHMoe1xuICBhZCxcbiAgaWQsXG4gIHNsb3ROYW1lLFxuICBkaW1lbnNpb25zLFxuICB3cmFwcGVyLFxuICBiaWRkaW5nLFxuICBjb3JyZWxhdG9yID0gZmFsc2UsXG4gIHByZXJlbmRlclxufSkge1xuICBjb25zdCBhZEluZm8gPSB7XG4gICAgYWRVbml0OiBhZCxcbiAgICBhZFNsb3Q6IHNsb3ROYW1lLFxuICAgIGFkRGltZW5zaW9uczogZGltZW5zaW9ucyxcbiAgICBhZElkOiBpZFxuICB9O1xuXG4gIGNvbnN0IHByZWJpZEJpZHMgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIGlmICh3cmFwcGVyLnByZWJpZCAmJiB3cmFwcGVyLnByZWJpZC5lbmFibGVkKSB7XG4gICAgICBjb25zdCB0aW1lb3V0ID0gd3JhcHBlci5wcmViaWQudGltZW91dCB8fCA3MDA7XG5cbiAgICAgIHF1ZXVlUHJlYmlkQ29tbWFuZC5iaW5kKHRoaXMsIGZldGNoUHJlYmlkQmlkcyhhZCwgaWQsIHRpbWVvdXQsIGFkSW5mbywgcHJlcmVuZGVyLCAoKSA9PiB7XG4gICAgICAgIHJlc29sdmUoJ0ZldGNoZWQgUHJlYmlkIGFkcyEnKTtcbiAgICAgIH0pKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzb2x2ZSgnUHJlYmlkIGlzIG5vdCBlbmFibGVkIG9uIHRoZSB3cmFwcGVyLi4uJyk7XG4gICAgfVxuICB9KTtcblxuICBjb25zdCBhbWF6b25CaWRzID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBpZiAod3JhcHBlci5hbWF6b24gJiYgd3JhcHBlci5hbWF6b24uZW5hYmxlZCkge1xuICAgICAgZmV0Y2hBbWF6b25CaWRzKGlkLCBzbG90TmFtZSwgZGltZW5zaW9ucywgKCkgPT4ge1xuICAgICAgICByZXNvbHZlKCdGZXRjaGVkIEFtYXpvbiBhZHMhJyk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzb2x2ZSgnQW1hem9uIGlzIG5vdCBlbmFibGVkIG9uIHRoZSB3cmFwcGVyLi4uJyk7XG4gICAgfVxuICB9KTtcblxuICBpZiAod2luZG93LmFyY0JpZGRpbmdSZWFkeSkge1xuICAgIFByb21pc2UuYWxsKFtwcmViaWRCaWRzLCBhbWF6b25CaWRzXSlcbiAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgcmVmcmVzaFNsb3Qoe1xuICAgICAgICAgIGFkLFxuICAgICAgICAgIGNvcnJlbGF0b3IsXG4gICAgICAgICAgcHJlcmVuZGVyLFxuICAgICAgICAgIGluZm86IGFkSW5mb1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgZmV0Y2hCaWRzKHtcbiAgICAgICAgYWQsXG4gICAgICAgIGlkLFxuICAgICAgICBzbG90TmFtZSxcbiAgICAgICAgZGltZW5zaW9ucyxcbiAgICAgICAgd3JhcHBlcixcbiAgICAgICAgYmlkZGluZyxcbiAgICAgICAgY29ycmVsYXRvcixcbiAgICAgICAgcHJlcmVuZGVyXG4gICAgICB9KTtcbiAgICB9LCAyMDApO1xuICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvc2VydmljZXMvaGVhZGVyYmlkZGluZy5qcyIsIi8qKlxuKiBAZGVzYyBBcHBlbmRzIGEgcmVtb3RlIHJlc291cmNlIHRvIHRoZSBwYWdlIHdpdGhpbiBhIEhUTUwgdGFnLlxuKiBAcGFyYW0ge3N0cmluZ30gdGFnbmFtZSAtIEEgc3RyaW5nIGNvbnRhaW5pbmcgdGhlIHR5cGUgb2YgSFRNTCB0YWcgdGhhdCBzaG91bGQgYmUgYXBwZW5kZWQuXG4qIEBwYXJhbSB7c3RyaW5nfSB1cmwgLSBBIHN0cmluZyBjb250YWluaW5nIHRoZSBwYXRoIG9mIHRoZSByZXNvdXJjZS5cbiogQHBhcmFtIHtib29sZWFufSBhc3luYyAtIEEgYm9vbGVhbiByZXByZXNlbnRpbmcgaWYgdGhlIHJlc291cmNlIHNob3VsZCBiZSBsb2FkZWQgYXN5bmNocm9ub3VzbHkgb3Igbm90LlxuKiBAcGFyYW0ge2Jvb2xlYW59IGRlZmVyIC0gQSBib29sZWFuIHJlcHJlc2VudGluZyBpZiB0aGUgcmVzb3VyY2Ugc2hvdWxkIGJlIGRlZmVycmVkIG9yIG5vdC5cbiogQHBhcmFtIHtmdW5jdGlvbn0gY2IgLSBBbiBvcHRpb25hbCBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IHNob3VsZCBmaXJlIHdoZW5ldmVyIHRoZSByZXNvdXJjZSBoYXMgYmVlbiBhcHBlbmRlZC5cbioqL1xuZXhwb3J0IGZ1bmN0aW9uIGFwcGVuZFJlc291cmNlKHRhZ25hbWUsIHVybCwgYXN5bmMsIGRlZmVyLCBjYikge1xuICBjb25zdCB0YWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZ25hbWUpO1xuICBpZiAodGFnbmFtZSA9PT0gJ3NjcmlwdCcpIHtcbiAgICB0YWcuc3JjID0gdXJsO1xuICAgIHRhZy5hc3luYyA9IGFzeW5jIHx8IGZhbHNlO1xuICAgIHRhZy5kZWZlciA9IGFzeW5jIHx8IGRlZmVyIHx8IGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybjtcbiAgfVxuICAoZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpLmFwcGVuZENoaWxkKHRhZyk7XG5cbiAgaWYgKGNiKSB7XG4gICAgY2IoKTtcbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3V0aWwvcmVzb3VyY2VzLmpzIiwiaW1wb3J0IHsgcmVmcmVzaFNsb3QgfSBmcm9tICcuL2dwdCc7XG5cbi8qKlxuKiBAZGVzYyBRdWV1ZXMgYSBjb21tYW5kIGluc2lkZSBvZiBQcmViaWQuanNcbiogQHBhcmFtIHtmdW5jdGlvbn0gZm4gLSBBY2NlcHRzIGEgZnVuY3Rpb24gdG8gcHVzaCBpbnRvIHRoZSBQcmViaWQgY29tbWFuZCBxdWV1ZS5cbioqL1xuZXhwb3J0IGZ1bmN0aW9uIHF1ZXVlUHJlYmlkQ29tbWFuZChmbikge1xuICBwYmpzLnF1ZS5wdXNoKGZuKTtcbn1cblxuLyoqXG4qIEBkZXNjIENhbGxzIHRoZSBQcmViaWQgcmVxdWVzdCBtZXRob2QgZm9yIGZldGNoaW5nIGJpZHMsIG9uY2UgZmV0Y2hlZCB0aGUgYWR2ZXJ0aXNlbWVudCBpcyByZWZyZXNoZWQgdW5sZXNzIGEgY2FsbGJhY2sgaXMgZGVmaW5lZC5cbiogQHBhcmFtIHtvYmplY3R9IGFkIC0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIEdQVCBhZCBzbG90LlxuKiBAcGFyYW0ge3N0cmluZ30gaWQgLSBBIHN0cmluZyBjb250YWluaW5nIHRoZSBhZHZlcnRpc2VtZW50IGlkIGNvcnJlc3BvbmRpbmcgdG8gdGhlIGRpdiB0aGUgYWR2ZXJ0aXNlbWVudCB3aWxsIGxvYWQgaW50by5cbiogQHBhcmFtIHtudW1iZXJ9IHRpbWVvdXQgLSBBbiBpbnRlZ2VyIGNvbW11bmljYXRpbmcgaG93IGxvbmcgaW4gbXMgdGhlIFByZWJpZC5qcyBzZXJ2aWNlIHNob3VsZCB3YWl0IGJlZm9yZSBpdCBjbG9zZXMgdGhlIGF1Y3Rpb24gZm9yIGEgbG90LlxuKiBAcGFyYW0ge29iamVjdH0gaW5mbyAtIEFuIG9iamVjdCBjb250YWluaW5nIGluZm9ybWF0aW9uIGFib3V0IHRoZSBhZHZlcnRpc2VtZW50IHRoYXQgaXMgYWJvdXQgdG8gbG9hZC5cbiogQHBhcmFtIHtmdW5jdGlvbn0gcHJlcmVuZGVyIC0gQW4gb3B0aW9uYWwgZnVuY3Rpb24gdGhhdCB3aWxsIHJ1biBiZWZvcmUgdGhlIGFkdmVydGlzZW1lbnQgcmVuZGVycy5cbiogQHBhcmFtIHtmdW5jdGlvbn0gY2IgLSBBbiBvcHRpb25hbCBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IHNob3VsZCBmaXJlIHdoZW5ldmVyIHRoZSBiaWRkaW5nIGhhcyBjb25jbHVkZWQuXG4qKi9cbmV4cG9ydCBmdW5jdGlvbiBmZXRjaFByZWJpZEJpZHMoYWQsIGlkLCB0aW1lb3V0LCBpbmZvLCBwcmVyZW5kZXIsIGNiID0gbnVsbCkge1xuICBwYmpzLnJlcXVlc3RCaWRzKHtcbiAgICB0aW1lb3V0LFxuICAgIGFkVW5pdENvZGVzOiBbaWRdLFxuICAgIGJpZHNCYWNrSGFuZGxlcjogKCkgPT4ge1xuICAgICAgcGJqcy5zZXRUYXJnZXRpbmdGb3JHUFRBc3luYyhbaWRdKTtcbiAgICAgIGlmIChjYikge1xuICAgICAgICBjYigpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVmcmVzaFNsb3QoeyBhZCwgaW5mbywgcHJlcmVuZGVyIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59XG5cbi8qKlxuKiBAZGVzYyBSZWdpc3RlcnMgYW4gYWR2ZXJ0aXNlbWVudCB3aXRoIFByZWJpZC5qcyBzbyBpdCdzIHByZXBhcmVkIHRvIGZldGNoIGJpZHMgZm9yIGl0LlxuKiBAcGFyYW0ge3N0cmluZ30gY29kZSAtIENvbnRhaW5zIHRoZSBkaXYgaWQgdXNlZCBmb3IgdGhlIGFkdmVydGlzZW1lbnRcbiogQHBhcmFtIHthcnJheX0gc2l6ZXMgLSBBbiBhcnJheSBvZiBhcHBsaWNhYmxlIGFkIHNpemVzIHRoYXQgYXJlIGF2YWlsYWJsZSBmb3IgYmlkZGluZy5cbiogQHBhcmFtIHtvYmplY3R9IGJpZHMgLSBDb250YWlucyBhbGwgb2YgdGhlIGFwcGxpY2FibGUgYmlkIGRhdGEsIHN1Y2ggYXMgd2hpY2ggdmVuZG9ycyB0byB1c2UgYW5kIHRoZWlyIHBsYWNlbWVudCBpZHMuXG4qIEBwYXJhbSB7b2JqZWN0fSB3cmFwcGVyIC0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgYWxsIGVuYWJsZWQgc2VydmljZXMgb24gdGhlIEFyYyBBZHMuXG4qKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGRVbml0KGNvZGUsIHNpemVzLCBiaWRzLCB3cmFwcGVyID0ge30pIHtcbiAgLy8gRm9ybWF0cyB0aGUgYWRkIHVuaXQgZm9yIHByZWJpZC4uXG4gIGNvbnN0IHNsb3QgPSB7IGNvZGUsIHNpemVzLCBiaWRzIH07XG4gIGNvbnN0IHsgc2l6ZUNvbmZpZyB9ID0gd3JhcHBlcjtcblxuICBwYmpzLmFkZEFkVW5pdHMoc2xvdCk7XG5cbiAgaWYgKHNpemVDb25maWcpIHtcbiAgICBwYmpzLnNldENvbmZpZyh7IHNpemVDb25maWc6IFtzaXplQ29uZmlnXSB9KTtcbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3NlcnZpY2VzL3ByZWJpZC5qcyIsImltcG9ydCB7IE1vYmlsZURldGVjdGlvbiB9IGZyb20gJy4vdXRpbC9tb2JpbGUnO1xuaW1wb3J0IHsgcmVuYW1lUG9zaXRpb25LZXkgfSBmcm9tICcuL3V0aWwvY3VzdG9tVGFyZ2V0aW5nJztcbmltcG9ydCB7IGZldGNoQmlkcywgaW5pdGlhbGl6ZUJpZGRpbmdTZXJ2aWNlcyB9IGZyb20gJy4vc2VydmljZXMvaGVhZGVyYmlkZGluZyc7XG5pbXBvcnQgeyBpbml0aWFsaXplR1BULCBxdWV1ZUdvb2dsZXRhZ0NvbW1hbmQsIHJlZnJlc2hTbG90LCBkZnBTZXR0aW5ncywgc2V0VGFyZ2V0aW5nLCBkZXRlcm1pbmVTbG90TmFtZSB9IGZyb20gJy4vc2VydmljZXMvZ3B0JztcbmltcG9ydCB7IHF1ZXVlUHJlYmlkQ29tbWFuZCwgYWRkVW5pdCB9IGZyb20gJy4vc2VydmljZXMvcHJlYmlkJztcbmltcG9ydCB7IHByZXBhcmVTaXplTWFwcywgc2V0UmVzaXplTGlzdGVuZXIgfSBmcm9tICcuL3NlcnZpY2VzL3NpemVtYXBwaW5nJztcblxuLyoqIEBkZXNjIERpc3BsYXlzIGFuIGFkdmVydGlzZW1lbnQgZnJvbSBHb29nbGUgREZQIHdpdGggb3B0aW9uYWwgc3VwcG9ydCBmb3IgUHJlYmlkLmpzIGFuZCBBbWF6b24gVEFNL0E5LiAqKi9cbmV4cG9ydCBjbGFzcyBBcmNBZHMge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zLCBoYW5kbGVTbG90UmVuZGVyZWQgPSBudWxsKSB7XG4gICAgdGhpcy5kZnBJZCA9IG9wdGlvbnMuZGZwLmlkIHx8ICcnO1xuICAgIHRoaXMud3JhcHBlciA9IG9wdGlvbnMuYmlkZGluZyB8fCB7fTtcbiAgICB0aGlzLnBvc2l0aW9ucyA9IFtdO1xuXG4gICAgd2luZG93LmlzTW9iaWxlID0gTW9iaWxlRGV0ZWN0aW9uO1xuXG4gICAgaWYgKHRoaXMuZGZwSWQgPT09ICcnKSB7XG4gICAgICBjb25zb2xlLndhcm4oYEFyY0FkczogREZQIGlkIGlzIG1pc3NpbmcgZnJvbSB0aGUgYXJjYWRzIGluaXRpYWxpemF0aW9uIHNjcmlwdC5cbiAgICAgICAgRG9jdW1lbnRhdGlvbjogaHR0cHM6Ly9naXRodWIuY29tL3dhcG9wYXJ0bmVycy9hcmMtYWRzI2dldHRpbmctc3RhcnRlZGApO1xuICAgIH0gZWxzZSB7XG4gICAgICBpbml0aWFsaXplR1BUKCk7XG4gICAgICBxdWV1ZUdvb2dsZXRhZ0NvbW1hbmQoZGZwU2V0dGluZ3MuYmluZCh0aGlzLCBoYW5kbGVTbG90UmVuZGVyZWQpKTtcbiAgICAgIGluaXRpYWxpemVCaWRkaW5nU2VydmljZXModGhpcy53cmFwcGVyKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgKiBAZGVzYyBSZWdpc3RlcnMgYW4gYWR2ZXJ0aXNlbWVudCBpbiB0aGUgc2VydmljZS5cbiAgKiBAcGFyYW0ge29iamVjdH0gcGFyYW1zIC0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgYWxsIG9mIHRoZSBhZHZlcnRpc2VtZW50IGNvbmZpZ3VyYXRpb24gc2V0dGluZ3Mgc3VjaCBhcyBzbG90IG5hbWUsIGlkLCBhbmQgcG9zaXRpb24uXG4gICoqL1xuICByZWdpc3RlckFkKHBhcmFtcykge1xuICAgIGNvbnN0IHsgaWQsIGRpbWVuc2lvbnMsIGFkVHlwZSA9IGZhbHNlLCB0YXJnZXRpbmcgPSB7fSwgZGlzcGxheSA9ICdhbGwnLCBiaWRkaW5nID0gZmFsc2UgfSA9IHBhcmFtcztcblxuICAgIC8qIElmIHBvc2l0aW9uYWwgdGFyZ2V0aW5nIGRvZXNuJ3QgZXhpc3QgaXQgZ2V0cyBhc3NpZ25lZCBhIG51bWVyaWMgdmFsdWVcbiAgICAgIGJhc2VkIG9uIHRoZSBvcmRlciBhbmQgdHlwZSBvZiB0aGUgYWR2ZXJ0aXNlbWVudC4gVGhpcyBsb2dpYyBpcyBza2lwcGVkIGlmIGFkVHlwZSBpcyBub3QgZGVmaW5lZC4gKi9cblxuICAgIGlmICgoIXRhcmdldGluZy5oYXNPd25Qcm9wZXJ0eSgncG9zaXRpb24nKSB8fCB0eXBlb2YgdGFyZ2V0aW5nLnBvc2l0aW9uID09PSAnb2JqZWN0JykgJiYgYWRUeXBlICE9PSBmYWxzZSkge1xuICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uc1thZFR5cGVdICsgMSB8fCAxO1xuICAgICAgdGhpcy5wb3NpdGlvbnNbYWRUeXBlXSA9IHBvc2l0aW9uO1xuXG4gICAgICBpZiAodHlwZW9mIHRhcmdldGluZy5wb3NpdGlvbiA9PT0gJ29iamVjdCcgJiYgdGFyZ2V0aW5nLnBvc2l0aW9uLmFzKSB7XG4gICAgICAgIE9iamVjdC5hc3NpZ24ocG9zaXRpb24sIHJlbmFtZVBvc2l0aW9uS2V5KHRhcmdldGluZywgcG9zaXRpb24pKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHBvc2l0aW9uUGFyYW0gPSBPYmplY3QuYXNzaWduKHRhcmdldGluZywgeyBwb3NpdGlvbiB9KTtcbiAgICAgICAgT2JqZWN0LmFzc2lnbihwYXJhbXMsIHsgdGFyZ2V0aW5nOiBwb3NpdGlvblBhcmFtIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICgoaXNNb2JpbGUuYW55KCkgJiYgZGlzcGxheSA9PT0gJ21vYmlsZScpIHx8ICghaXNNb2JpbGUuYW55KCkgJiYgZGlzcGxheSA9PT0gJ2Rlc2t0b3AnKSB8fCAoZGlzcGxheSA9PT0gJ2FsbCcpKSB7XG4gICAgICAvLyBSZWdpc3RlcnMgdGhlIGFkdmVydGlzZW1lbnQgd2l0aCBQcmViaWQuanMgaWYgZW5hYmxlZCBvbiBib3RoIHRoZSB1bml0IGFuZCB3cmFwcGVyLlxuICAgICAgaWYgKChiaWRkaW5nLnByZWJpZCAmJiBiaWRkaW5nLnByZWJpZC5iaWRzKSAmJiAodGhpcy53cmFwcGVyLnByZWJpZCAmJiB0aGlzLndyYXBwZXIucHJlYmlkLmVuYWJsZWQpICYmIGRpbWVuc2lvbnMpIHtcbiAgICAgICAgcXVldWVQcmViaWRDb21tYW5kLmJpbmQodGhpcywgYWRkVW5pdChpZCwgZGltZW5zaW9ucywgYmlkZGluZy5wcmViaWQuYmlkcywgdGhpcy53cmFwcGVyLnByZWJpZCkpO1xuICAgICAgfVxuXG4gICAgICBxdWV1ZUdvb2dsZXRhZ0NvbW1hbmQodGhpcy5kaXNwbGF5QWQuYmluZCh0aGlzLCBwYXJhbXMpKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgKiBAZGVzYyBSZWdpc3RlcnMgYSBjb2xsZWN0aW9uIG9mIGFkdmVydGlzZW1lbnRzLlxuICAqIEBwYXJhbSB7YXJyYXl9IGNvbGxlY3Rpb24gLSBBbiBhcnJheSBjb250YWluaW5nIGEgbGlzdCBvZiBvYmplY3RzIGNvbnRhaW5pbmcgYWR2ZXJ0aXNlbWVudCBkYXRhLlxuICAqKi9cbiAgcmVnaXN0ZXJBZENvbGxlY3Rpb24oY29sbGVjdGlvbikge1xuICAgIGNvbGxlY3Rpb24uZm9yRWFjaCgoYWR2ZXJ0KSA9PiB7XG4gICAgICB0aGlzLnJlZ2lzdGVyQWQoYWR2ZXJ0KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAqIEBkZXNjIERpc3BsYXlzIGFuIGFkdmVydGlzZW1lbnQgYW5kIHNldHMgdXAgYW55IG5lY2NlcnNhcnkgZXZlbnQgYmluZGluZy5cbiAgKiBAcGFyYW0ge29iamVjdH0gcGFyYW1zIC0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgYWxsIG9mIHRoZSBmdW5jdGlvbiBhcmd1bWVudHMuXG4gICogQHBhcmFtIHtzdHJpbmd9IHBhcmFtcy5pZCAtIEEgc3RyaW5nIGNvbnRhaW5pbmcgdGhlIGFkdmVydGlzZW1lbnQgaWQgY29ycmVzcG9uZGluZyB0byB0aGUgZGl2IHRoZSBhZHZlcnRpc2VtZW50IHdpbGwgbG9hZCBpbnRvLlxuICAqIEBwYXJhbSB7c3RyaW5nfSBwYXJhbXMuc2xvdE5hbWUgLSBBIHN0cmluZyBjb250YWluaW5nIHRoZSBzbG90IG5hbWUgb2YgdGhlIGFkdmVydGlzZW1lbnQsIGZvciBpbnN0YW5jZSAnMTIzNC9uZXdzL2hvbWVwYWdlJy5cbiAgKiBAcGFyYW0ge2FycmF5fSBwYXJhbXMuZGltZW5zaW9ucyAtIEFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIG9mIHRoZSBhcHBsaWNhYmxlIHNpemVzIHRoZSBhZHZlcnRpc2VtZW50IGNhbiB1c2UuXG4gICogQHBhcmFtIHtvYmplY3R9IHBhcmFtcy50YXJnZXRpbmcgLSBBbiBvYmplY3QgY29udGFpbmluZyBhbGwgb2YgdGhlIGFkdmVydGlzZW1lbnRzIHRhcmdldGluZyBkYXRhLlxuICAqIEBwYXJhbSB7YXJyYXl9IHBhcmFtcy5zaXplbWFwIC0gQW4gYXJyYXkgY29udGFpbmluZyBvcHRpb25hbCBzaXplIG1hcHBpbmcgaW5mb3JtYXRpb24uXG4gICogQHBhcmFtIHtvYmplY3R9IHBhcmFtcy5iaWRkaW5nIC0gQ29udGFpbnMgYWxsIG9mIHRoZSBhcHBsaWNhYmxlIGJpZCBkYXRhLCBzdWNoIGFzIHdoaWNoIHZlbmRvcnMgdG8gdXNlIGFuZCB0aGVpciBwbGFjZW1lbnQgaWRzLlxuICAqIEBwYXJhbSB7ZnVuY3Rpb259IHBhcmFtcy5wcmVyZW5kZXIgLSBBbiBvcHRpb25hbCBmdW5jdGlvbiB0aGF0IHdpbGwgcnVuIGJlZm9yZSB0aGUgYWR2ZXJ0aXNlbWVudCByZW5kZXJzLlxuICAqKi9cbiAgZGlzcGxheUFkKHtcbiAgICBpZCxcbiAgICBzbG90TmFtZSxcbiAgICBkaW1lbnNpb25zLFxuICAgIHRhcmdldGluZyxcbiAgICBzaXplbWFwID0gZmFsc2UsXG4gICAgYmlkZGluZyA9IGZhbHNlLFxuICAgIHByZXJlbmRlciA9IG51bGxcbiAgfSkge1xuICAgIGNvbnN0IGZ1bGxTbG90TmFtZSA9IGRldGVybWluZVNsb3ROYW1lKHRoaXMuZGZwSWQsIHNsb3ROYW1lKTtcbiAgICBjb25zdCBwYXJzZWREaW1lbnNpb25zID0gIWRpbWVuc2lvbnMubGVuZ3RoID8gbnVsbCA6IEpTT04ucGFyc2UoZGltZW5zaW9ucyk7XG4gICAgY29uc3QgYWQgPSAhZGltZW5zaW9ucyA/IHdpbmRvdy5nb29nbGV0YWcuZGVmaW5lT3V0T2ZQYWdlU2xvdChmdWxsU2xvdE5hbWUsIGlkKVxuICAgICAgOiB3aW5kb3cuZ29vZ2xldGFnLmRlZmluZVNsb3QoZnVsbFNsb3ROYW1lLCBwYXJzZWREaW1lbnNpb25zLCBpZCk7XG5cbiAgICBpZiAoc2l6ZW1hcCAmJiBzaXplbWFwLmJyZWFrcG9pbnRzICYmIGRpbWVuc2lvbnMpIHtcbiAgICAgIGNvbnN0IHsgbWFwcGluZywgYnJlYWtwb2ludHMsIGNvcnJlbGF0b3JzIH0gPSBwcmVwYXJlU2l6ZU1hcHMocGFyc2VkRGltZW5zaW9ucywgc2l6ZW1hcC5icmVha3BvaW50cyk7XG5cbiAgICAgIGFkLmRlZmluZVNpemVNYXBwaW5nKG1hcHBpbmcpO1xuXG4gICAgICBpZiAoc2l6ZW1hcC5yZWZyZXNoKSB7XG4gICAgICAgIHNldFJlc2l6ZUxpc3RlbmVyKHtcbiAgICAgICAgICBhZCxcbiAgICAgICAgICBzbG90TmFtZTogZnVsbFNsb3ROYW1lLFxuICAgICAgICAgIGJyZWFrcG9pbnRzLFxuICAgICAgICAgIGlkLFxuICAgICAgICAgIG1hcHBpbmcsXG4gICAgICAgICAgY29ycmVsYXRvcnMsXG4gICAgICAgICAgYmlkZGluZyxcbiAgICAgICAgICB3cmFwcGVyOiB0aGlzLndyYXBwZXIsXG4gICAgICAgICAgcHJlcmVuZGVyXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGFkLmFkZFNlcnZpY2Uod2luZG93Lmdvb2dsZXRhZy5wdWJhZHMoKSk7XG5cbiAgICBzZXRUYXJnZXRpbmcoYWQsIHRhcmdldGluZyk7XG5cbiAgICBpZiAoYmlkZGluZyAmJiBkaW1lbnNpb25zKSB7XG4gICAgICBmZXRjaEJpZHMoe1xuICAgICAgICBhZCxcbiAgICAgICAgaWQsXG4gICAgICAgIHNsb3ROYW1lOiBmdWxsU2xvdE5hbWUsXG4gICAgICAgIGRpbWVuc2lvbnM6IHBhcnNlZERpbWVuc2lvbnMsXG4gICAgICAgIHdyYXBwZXI6IHRoaXMud3JhcHBlcixcbiAgICAgICAgcHJlcmVuZGVyLFxuICAgICAgICBiaWRkaW5nXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVmcmVzaFNsb3Qoe1xuICAgICAgICBhZCxcbiAgICAgICAgcHJlcmVuZGVyLFxuICAgICAgICBpbmZvOiB7XG4gICAgICAgICAgYWRVbml0OiBhZCxcbiAgICAgICAgICBhZFNsb3Q6IGZ1bGxTbG90TmFtZSxcbiAgICAgICAgICBhZERpbWVuc2lvbnM6IHBhcnNlZERpbWVuc2lvbnMsXG4gICAgICAgICAgYWRJZDogaWRcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvaW5kZXguanMiLCIvKiogQGRlc2MgVXRpbGl0eSBjbGFzcyB0aGF0IGRldGVybWluZXMgdGhlIGVuZCB1c2VycyBicm93c2VyIHVzZXIgYWdlbnQuICoqL1xuZXhwb3J0IGNsYXNzIE1vYmlsZURldGVjdGlvbiB7XG4gIC8qKlxuICAqIEBkZXNjIERldGVybWluZXMgaWYgdGhlIHVzZXIgaXMgdXNpbmcgYW4gQW5kcm9pZCBkZXZpY2UuXG4gICoqL1xuICBzdGF0aWMgQW5kcm9pZCgpIHtcbiAgICByZXR1cm4gISFuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9BbmRyb2lkL2kpO1xuICB9XG5cbiAgLyoqXG4gICogQGRlc2MgRGV0ZXJtaW5lcyBpZiB0aGUgdXNlciBpcyB1c2luZyBhbiBvbGQgQW5kcm9pZCBkZXZpY2UuXG4gICoqL1xuICBzdGF0aWMgQW5kcm9pZE9sZCgpIHtcbiAgICByZXR1cm4gISFuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9BbmRyb2lkIDIuMy4zL2kpO1xuICB9XG5cbiAgLyoqXG4gICogQGRlc2MgRGV0ZXJtaW5lcyBpZiB0aGUgdXNlciBpcyB1c2luZyBhbiBBbmRyb2lkIHRhYmxldCBkZXZpY2UuXG4gICoqL1xuICBzdGF0aWMgQW5kcm9pZFRhYmxldCgpIHtcbiAgICByZXR1cm4gISEobmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvQW5kcm9pZC9pKSAmJiAhbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvTW9iaWxlL2kpKTtcbiAgfVxuXG4gIC8qKlxuICAqIEBkZXNjIERldGVybWluZXMgaWYgdGhlIHVzZXIgaXMgdXNpbmcgYSBLaW5kbGUuXG4gICoqL1xuICBzdGF0aWMgS2luZGxlKCkge1xuICAgIHJldHVybiAhIW5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL0tpbmRsZS9pKTtcbiAgfVxuXG4gIC8qKlxuICAqIEBkZXNjIERldGVybWluZXMgaWYgdGhlIHVzZXIgaXMgdXNpbmcgYSBLaW5kbGUgRmlyZS5cbiAgKiovXG4gIHN0YXRpYyBLaW5kbGVGaXJlKCkge1xuICAgIHJldHVybiAhIW5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL0tGT1QvaSk7XG4gIH1cblxuICAvKipcbiAgKiBAZGVzYyBEZXRlcm1pbmVzIGlmIHRoZSB1c2VyIGlzIHVzaW5nIFNpbGsuXG4gICoqL1xuICBzdGF0aWMgU2lsaygpIHtcbiAgICByZXR1cm4gISFuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9TaWxrL2kpO1xuICB9XG5cbiAgLyoqXG4gICogQGRlc2MgRGV0ZXJtaW5lcyBpZiB0aGUgdXNlciBpcyB1c2luZyBhIEJsYWNrQmVycnkgZGV2aWNlXG4gICoqL1xuICBzdGF0aWMgQmxhY2tCZXJyeSgpIHtcbiAgICByZXR1cm4gISFuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9CbGFja0JlcnJ5L2kpO1xuICB9XG5cbiAgLyoqXG4gICogQGRlc2MgRGV0ZXJtaW5lcyBpZiB0aGUgdXNlciBpcyB1c2luZyBhbiBpT1MgZGV2aWNlLlxuICAqKi9cbiAgc3RhdGljIGlPUygpIHtcbiAgICByZXR1cm4gISFuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9pUGhvbmV8aVBhZHxpUG9kL2kpO1xuICB9XG5cbiAgLyoqXG4gICogQGRlc2MgRGV0ZXJtaW5lcyBpZiB0aGUgdXNlciBpcyB1c2luZyBhbiBpUGhvbmUgb3IgaVBvZC5cbiAgKiovXG4gIHN0YXRpYyBpUGhvbmUoKSB7XG4gICAgcmV0dXJuICEhbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvaVBob25lfGlQb2QvaSk7XG4gIH1cblxuICAvKipcbiAgKiBAZGVzYyBEZXRlcm1pbmVzIGlmIHRoZSB1c2VyIGlzIHVzaW5nIGFuIGlQYWQuXG4gICoqL1xuICBzdGF0aWMgaVBhZCgpIHtcbiAgICByZXR1cm4gISFuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9pUGFkL2kpO1xuICB9XG5cbiAgLyoqXG4gICogQGRlc2MgRGV0ZXJtaW5lcyBpZiB0aGUgdXNlciBpcyB1c2luZyBhIFdpbmRvd3MgTW9iaWxlIGRldmljZS5cbiAgKiovXG4gIHN0YXRpYyBXaW5kb3dzKCkge1xuICAgIHJldHVybiAhIW5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL0lFTW9iaWxlL2kpO1xuICB9XG5cbiAgLyoqXG4gICogQGRlc2MgRGV0ZXJtaW5lcyBpZiB0aGUgdXNlciBpcyB1c2luZyBGaXJlRm94T1MuXG4gICoqL1xuICBzdGF0aWMgRmlyZWZveE9TKCkge1xuICAgIHJldHVybiAhIW5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL01vemlsbGEvaSkgJiYgISFuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9Nb2JpbGUvaSk7XG4gIH1cblxuICAvKipcbiAgKiBAZGVzYyBEZXRlcm1pbmVzIGlmIHRoZSB1c2VyIGlzIHVzaW5nIGEgUmV0aW5hIGRpc3BsYXkuXG4gICoqL1xuICBzdGF0aWMgUmV0aW5hKCkge1xuICAgIHJldHVybiAod2luZG93LnJldGluYSB8fCB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyA+IDEpO1xuICB9XG5cbiAgLyoqXG4gICogQGRlc2MgRGV0ZXJtaW5lcyBpZiB0aGUgdXNlciBpcyB1c2luZyBhbnkgdHlwZSBvZiBtb2JpbGUgZGV2aWNlLlxuICAqKi9cbiAgc3RhdGljIGFueSgpIHtcbiAgICByZXR1cm4gKHRoaXMuQW5kcm9pZCgpIHx8IHRoaXMuS2luZGxlKCkgfHwgdGhpcy5LaW5kbGVGaXJlKCkgfHwgdGhpcy5TaWxrKCkgfHwgdGhpcy5CbGFja0JlcnJ5KCkgfHwgdGhpcy5pT1MoKSB8fCB0aGlzLldpbmRvd3MoKSB8fCB0aGlzLkZpcmVmb3hPUygpKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBNb2JpbGVEZXRlY3Rpb247XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvdXRpbC9tb2JpbGUuanMiLCIvKipcbiogQGRlc2MgQWNjZXB0cyBhIGtleSBhcyBhIHN0cmluZyBhbmQgcmV0dXJucyB0aGUgdmFsdWUgb2YgYSBxdWVyeSBwYXJhbWV0ZXIgb24gdGhlIHBhZ2UgcmVxdWVzdC5cbiogQHBhcmFtIHtzdHJpbmd9IHBhcmFtIC0gQSBzdHJpbmcgdGhhdCByZXByZXNlbnRzIHRoZSBrZXkgb2YgYSBxdWVyeSBwYXJhbXRlciwgZm9yIGV4YW1wbGUgJ2Fkc2xvdCcgd2lsbCByZXR1cm4gJ2hlbGxvJyBpZiB0aGUgdXJsIGhhcyAnP2Fkc2xvdD1oZWxsbycgYXQgdGhlIGVuZCBvZiBpdC5cbiogQHJldHVybiAtIFJldHVybnMgYSBzdHJpbmcgY29udGFpbmluZyB0aGUgdmFsdWUgb2YgYSBxdWVyeSBwYXJhbXRlci5cbioqL1xuZXhwb3J0IGZ1bmN0aW9uIGV4cGFuZFF1ZXJ5U3RyaW5nKHBhcmFtKSB7XG4gIGNvbnN0IHVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICBjb25zdCBuYW1lID0gcGFyYW0ucmVwbGFjZSgvW1tcXF1dL2csICdcXFxcJCYnKTtcbiAgY29uc3QgcmVnZXggPSBuZXcgUmVnRXhwKGBbPyZdJHtuYW1lfSg9KFteJiNdKil8JnwjfCQpYCk7XG4gIGNvbnN0IHJlc3VsdHMgPSByZWdleC5leGVjKHVybCk7XG5cbiAgaWYgKCFyZXN1bHRzKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBpZiAoIXJlc3VsdHNbMl0pIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbiAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChyZXN1bHRzWzJdLnJlcGxhY2UoL1xcKy9nLCAnICcpKTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy91dGlsL3F1ZXJ5LmpzIiwiLyoqXG4qIEBkZXNjIEZldGNoZXMgYSBiaWQgZm9yIGFuIGFkdmVydGlzZW1lbnQgYmFzZWQgb24gd2hpY2ggc2VydmljZXMgYXJlIGVuYWJsZWQgb24gdW5pdCBhbmQgdGhlIHdyYXBwZXIuXG4qIEBwYXJhbSB7c3RyaW5nfSBpZCAtIEEgc3RyaW5nIGNvbnRhaW5pbmcgdGhlIGFkdmVydGlzZW1lbnQgaWQgY29ycmVzcG9uZGluZyB0byB0aGUgZGl2IHRoZSBhZHZlcnRpc2VtZW50IHdpbGwgbG9hZCBpbnRvLlxuKiBAcGFyYW0ge3N0cmluZ30gc2xvdE5hbWUgLSBBIHN0cmluZyBjb250YWluaW5nIHRoZSBzbG90IG5hbWUgb2YgdGhlIGFkdmVydGlzZW1lbnQsIGZvciBpbnN0YW5jZSAnMTIzNC9hZG4uY29tL2hvbWVwYWdlJy5cbiogQHBhcmFtIHthcnJheX0gZGltZW5zaW9ucyAtIEFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIG9mIHRoZSBhcHBsaWNhYmxlIHNpemVzIHRoZSBhZHZlcnRpc2VtZW50IGNhbiB1c2UuXG4qIEBwYXJhbSB7ZnVuY3Rpb259IGNiIC0gQW4gb3B0aW9uYWwgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBzaG91bGQgZmlyZSB3aGVuZXZlciB0aGUgYmlkZGluZyBoYXMgY29uY2x1ZGVkLlxuKiovXG5leHBvcnQgZnVuY3Rpb24gZmV0Y2hBbWF6b25CaWRzKGlkLCBzbG90TmFtZSwgZGltZW5zaW9ucywgY2IgPSBudWxsKSB7XG4gIHF1ZXVlQW1hem9uQ29tbWFuZCgoKSA9PiB7XG4gICAgY29uc3Qgc2xvdCA9IHtcbiAgICAgIHNsb3ROYW1lLFxuICAgICAgc2xvdElEOiBpZCxcbiAgICAgIHNpemVzOiBkaW1lbnNpb25zXG4gICAgfTtcblxuICAgIC8vIFJldHJpZXZlcyB0aGUgYmlkIGZyb20gQW1hem9uXG4gICAgd2luZG93LmFwc3RhZy5mZXRjaEJpZHMoeyBzbG90czogW3Nsb3RdIH0sICgpID0+IHtcbiAgICAgIC8vIFNldHMgdGhlIHRhcmdldGluZyB2YWx1ZXMgb24gdGhlIGRpc3BsYXkgYmlkIGZyb20gYXBzdGFnXG4gICAgICB3aW5kb3cuYXBzdGFnLnNldERpc3BsYXlCaWRzKCk7XG5cbiAgICAgIGlmIChjYikge1xuICAgICAgICBjYigpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbn1cblxuLyoqXG4qIEBkZXNjIEFkZHMgYW4gQW1hem9uIGNvbW1hbmQgdG8gYSBjYWxsYmFjayBxdWV1ZSB3aGljaCBhd2FpdHMgZm9yIHdpbmRvdy5hcHN0YWdcbiogQHBhcmFtIHtzdHJpbmd9IGNtZCAtIFRoZSBmdW5jdGlvbiB0aGF0IHNob3VsZCB3YWl0IGZvciB3aW5kb3cuYXBzdGFnIHRvIGJlIHJlYWR5LlxuKiovXG5leHBvcnQgZnVuY3Rpb24gcXVldWVBbWF6b25Db21tYW5kKGNtZCkge1xuICBpZiAod2luZG93LmFwc3RhZykge1xuICAgIGNtZCgpO1xuICB9IGVsc2Uge1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgcXVldWVBbWF6b25Db21tYW5kKGNtZCk7XG4gICAgfSwgMjAwKTtcbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3NlcnZpY2VzL2FtYXpvbi5qcyIsImltcG9ydCB7IGRlYm91bmNlIH0gZnJvbSAnLi4vdXRpbC9kZWJvdW5jZSc7XG5pbXBvcnQgeyBmZXRjaEJpZHMgfSBmcm9tICcuL2hlYWRlcmJpZGRpbmcnO1xuaW1wb3J0IHsgcmVmcmVzaFNsb3QgfSBmcm9tICcuL2dwdCc7XG5cbi8qKiBAZGVzYyBBbiBvYmplY3QgY29udGFpbmluZyBhbGwgb2YgdGhlIHNpemUgbWFwIHJlZnJlc2ggZXZlbnQgbGlzdGVuZXJzIGFuZCBjb3JyZWxhdG9ycyBmb3Igc2l6ZSBtYXBwaW5nLiAqKi9cbmV4cG9ydCBjb25zdCBzaXplbWFwTGlzdGVuZXJzID0ge307XG5cbi8qKiBAZGVzYyBBbiBvYmplY3QgY29udGFpbmluZyBhbGwgb2YgdGhlIHNjcmVlbiByZXNpemUgZXZlbnQgbGlzdGVuZXJzIGZvciBzaXplIG1hcHBpbmcuICoqL1xuZXhwb3J0IGNvbnN0IHJlc2l6ZUxpc3RlbmVycyA9IHt9O1xuXG4vKipcbiogQGRlc2MgUHJlcGFyZXMgYSBzZXQgb2YgZGltZW5zaW9ucyBhbmQgdGhlaXIgY29ycmVzcG9uZGluZyBicmVha3BvaW50cyB0byBjcmVhdGUgYSBzaXplbWFwIHdoaWNoIGlzIHJlYWRhYmxlIGJ5IEdQVC5cbiogQHBhcmFtIHthcnJheX0gZGltZW5zaW9ucyAtIEFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIG9mIHRoZSBhcHBsaWNhYmxlIHNpemVzIHRoZSBhZHZlcnRpc2VtZW50IGNhbiB1c2UuXG4qIEBwYXJhbSB7YXJyYXl9IHNpemVtYXAgLSBBbiBhcnJheSBjb250YWluaW5nIGFsbCBvZiB0aGUgYXBwbGljYWJsZSBicmVha3BvaW50cyBmb3IgdGhlIHNpemVtYXBwaW5nLlxuKiovXG5leHBvcnQgZnVuY3Rpb24gcHJlcGFyZVNpemVNYXBzKGRpbWVuc2lvbnMsIHNpemVtYXApIHtcbiAgY29uc3QgbWFwcGluZyA9IFtdO1xuICBjb25zdCBicmVha3BvaW50cyA9IFtdO1xuICBjb25zdCBjb3JyZWxhdG9ycyA9IFtdO1xuICBjb25zdCBwYXJzZWRTaXplbWFwID0gIXNpemVtYXAubGVuZ3RoID8gbnVsbCA6IEpTT04ucGFyc2Uoc2l6ZW1hcCk7XG5cbiAgcGFyc2VkU2l6ZW1hcC5mb3JFYWNoKCh2YWx1ZSwgaW5kZXgpID0+IHtcbiAgICBtYXBwaW5nLnB1c2goW3ZhbHVlLCBkaW1lbnNpb25zW2luZGV4XV0pO1xuXG4gICAgLy8gRmlsdGVycyBkdXBsaWNhdGVzIGZyb20gdGhlIG1hcHBpbmdcbiAgICBpZiAoYnJlYWtwb2ludHMuaW5kZXhPZih2YWx1ZVswXSkgPT09IC0xKSB7XG4gICAgICBicmVha3BvaW50cy5wdXNoKHZhbHVlWzBdKTtcbiAgICAgIGNvcnJlbGF0b3JzLnB1c2goZmFsc2UpO1xuICAgIH1cbiAgfSk7XG5cbiAgYnJlYWtwb2ludHMuc29ydCgoYSwgYikgPT4geyByZXR1cm4gYSAtIGI7IH0pO1xuXG4gIHJldHVybiB7IG1hcHBpbmcsIGJyZWFrcG9pbnRzLCBjb3JyZWxhdG9ycyB9O1xufVxuXG4vKipcbiogQGRlc2MgRGV0ZXJtaW5lcyB3aGljaCBzZXQgb2YgYWQgc2l6ZXMgYXJlIGFib3V0IHRvIGRpc3BsYXkgYmFzZWQgb24gdGhlIHVzZXJzIGN1cnJlbnQgc2NyZWVuIHNpemUuXG4qIEBwYXJhbSB7YXJyYXl9IHNpemVNYXBwaW5ncyAtIEFuIGFycmF5IGNvbnRhaW5pbmcgdGhlIGFkdmVydGlzZW1lbnRzIEdQVCByZWFkYWJsZSBzaXplIG1hcHBpbmcuXG4qIEByZXR1cm4ge2FycmF5fSAtIFJldHVybnMgYW4gYXJyYXkgY29udGFpbmluZyB0aGUgYWQgc2l6ZXMgd2hpY2ggcmVsYXRlIHRvIHRoZSB1c2VycyBjdXJyZW50IHdpbmRvdyB3aWR0aC5cbioqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlU2l6ZU1hcHBpbmdzKHNpemVNYXBwaW5ncykge1xuICB0cnkge1xuICAgIGNvbnN0IHdpZHRoID0gd2luZG93LmlubmVyV2lkdGggfHxcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGggfHxcbiAgICBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoO1xuXG4gICAgY29uc3QgaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0IHx8XG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCB8fFxuICAgIGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0O1xuXG4gICAgY29uc3Qgc2QgPSBbd2lkdGgsIGhlaWdodF07XG5cbiAgICAvKiBGaWx0ZXJzIG1hcHBpbmdzIHRoYXQgYXJlIHZhbGlkIGJ5IGNvbmZpcm1pbmcgdGhhdCB0aGUgY3VycmVudCBzY3JlZW4gZGltZW5zaW9uc1xuICAgICAgYXJlIGJvdGggZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIHRoZSBicmVha3BvaW50IFt4LCB5XSBtaW5pbXVtcyBzcGVjaWZpZWQgaW4gdGhlIGZpcnN0IHBvc2l0aW9uIGluIHRoZSBtYXBwaW5nLlxuICAgICAgUmV0dXJucyB0aGUgbGVmdG1vc3QgbWFwcGluZydzIHNpemVzIG9yIGFuIGVtcHR5IGFycmF5LiAqL1xuICAgIGNvbnN0IHZhbGlkTWFwcGluZ3MgPSBzaXplTWFwcGluZ3MuZmlsdGVyKChtYXBwaW5nKSA9PiB7XG4gICAgICByZXR1cm4gbWFwcGluZ1swXVswXSA8PSBzZFswXSAmJiBtYXBwaW5nWzBdWzFdIDw9IHNkWzFdO1xuICAgIH0pO1xuXG4gICAgbGV0IHJlc3VsdCA9IHZhbGlkTWFwcGluZ3MubGVuZ3RoID4gMCA/IHZhbGlkTWFwcGluZ3NbMF1bMV0gOiBbXTtcblxuICAgIGlmIChyZXN1bHQubGVuZ3RoID4gMCAmJiByZXN1bHRbMF0uY29uc3RydWN0b3IgIT09IEFycmF5KSB7XG4gICAgICAvLyBXcmFwcyB0aGUgMUQgYXJyYXkgaW4gYW5vdGhlciBzZXQgb2YgYnJhY2tldHMgdG8gbWFrZSBpdCAyRFxuICAgICAgcmVzdWx0ID0gW3Jlc3VsdF07XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSBjYXRjaCAoZSkge1xuICAgIC8vIEZhbGxiYWNrIHRvIGxhc3Qgc2l6ZSBtYXBwaW5nIHN1cHBsaWVkIGlmIHRoZXJlJ3MgYW4gaW52YWxpZCBtYXBwaW5nIHByb3ZpZGVkXG4gICAgcmV0dXJuIHNpemVNYXBwaW5nc1tzaXplTWFwcGluZ3MubGVuZ3RoIC0gMV1bMV07XG4gIH1cbn1cblxuLyoqXG4qIEBkZXNjIFJlc2l6ZSBldmVudCB0aGF0IGNoZWNrcyBpZiBhIHVzZXIgaGFzIHJlc2l6ZWQgcGFzdCBhIGJyZWFrcG9pbnQgaW5jbHVkZWQgaW4gdGhlIGFkdmVydGlzZW1lbnRzIHNpemVtYXAuIElmIGl0IGhhcyB0aGUgR1BUXG4qIHJlZnJlc2ggbWV0aG9kIGlzIGNhbGxlZCBzbyB0aGUgc2VydmljZSBjYW4gZmV0Y2ggYSBtb3JlIGFwcm9wcmlhdGVseSBzaXplZCBjcmVhdGl2ZS5cbiogQHBhcmFtIHtvYmplY3R9IHBhcmFtcyAtIEFuIG9iamVjdCBjb250YWluaW5nIGFsbCBvZiB0aGUgYWR2ZXJ0aXNlbWVudCBjb25maWd1cmF0aW9uIHNldHRpbmdzIHN1Y2ggYXMgc2xvdCBuYW1lLCBpZCwgYW5kIHBvc2l0aW9uLlxuKiovXG5leHBvcnQgZnVuY3Rpb24gcnVuUmVzaXplRXZlbnRzKHBhcmFtcykge1xuICBsZXQgbGFzdEJyZWFrcG9pbnQ7XG4gIGxldCBpbml0aWFsTG9hZCA9IGZhbHNlO1xuXG4gIHJldHVybiAoKSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgYWQsXG4gICAgICBicmVha3BvaW50cyxcbiAgICAgIGlkLFxuICAgICAgYmlkZGluZyxcbiAgICAgIG1hcHBpbmcsXG4gICAgICBzbG90TmFtZSxcbiAgICAgIHdyYXBwZXIsXG4gICAgICBwcmVyZW5kZXIgfSA9IHBhcmFtcztcblxuICAgIGNvbnN0IHdpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgbGV0IGJyZWFrcG9pbnQ7XG4gICAgbGV0IG5leHRCcmVha3BvaW50O1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBicmVha3BvaW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgYnJlYWtwb2ludCA9IGJyZWFrcG9pbnRzW2ldO1xuICAgICAgbmV4dEJyZWFrcG9pbnQgPSBicmVha3BvaW50c1tpICsgMV07XG5cbiAgICAgIGlmICgod2lkdGggPiBicmVha3BvaW50ICYmICh3aWR0aCA8IG5leHRCcmVha3BvaW50IHx8ICFuZXh0QnJlYWtwb2ludCkgJiYgbGFzdEJyZWFrcG9pbnQgIT09IGJyZWFrcG9pbnQpIHx8ICh3aWR0aCA9PT0gYnJlYWtwb2ludCAmJiAhaW5pdGlhbExvYWQpKSB7XG4gICAgICAgIGxhc3RCcmVha3BvaW50ID0gYnJlYWtwb2ludDtcbiAgICAgICAgaW5pdGlhbExvYWQgPSB0cnVlO1xuXG4gICAgICAgIC8vIEZldGNoZXMgYSBzZXQgb2YgZGltZW5zaW9ucyBmb3IgdGhlIGFkIHdoaWNoIGlzIGFib3V0IHRvIGRpc3BsYXkuXG4gICAgICAgIGNvbnN0IHBhcnNlZFNpemVNYXBwaW5nID0gcGFyc2VTaXplTWFwcGluZ3MobWFwcGluZyk7XG5cbiAgICAgICAgY29uc3QgYWRJbmZvID0ge1xuICAgICAgICAgIGFkVW5pdDogYWQsXG4gICAgICAgICAgYWRTbG90OiBzbG90TmFtZSxcbiAgICAgICAgICBhZERpbWVuc2lvbnM6IHBhcnNlZFNpemVNYXBwaW5nLFxuICAgICAgICAgIGFkSWQ6IGlkXG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gSWYgaXQncyBpbmNsdWRlZCBpbiBhIGhlYWRlci1iaWRkaW5nIHNlcnZpY2Ugd2UgcmUtZmV0Y2ggYmlkcyBmb3IgdGhlIGdpdmVuIHNsb3QsIG90aGVyd2lzZSBpdCByZWZyZXNoZXMgYXMgbm9ybWFsLlxuICAgICAgICBpZiAoKGJpZGRpbmcucHJlYmlkICYmIGJpZGRpbmcucHJlYmlkLmVuYWJsZWQpIHx8IChiaWRkaW5nLmFtYXpvbiAmJiBiaWRkaW5nLmFtYXpvbi5lbmFibGVkKSkge1xuICAgICAgICAgIGZldGNoQmlkcyh7XG4gICAgICAgICAgICBhZCxcbiAgICAgICAgICAgIGlkLFxuICAgICAgICAgICAgc2xvdE5hbWUsXG4gICAgICAgICAgICBkaW1lbnNpb25zOiBwYXJzZWRTaXplTWFwcGluZyxcbiAgICAgICAgICAgIGJpZGRpbmcsXG4gICAgICAgICAgICB3cmFwcGVyLFxuICAgICAgICAgICAgcHJlcmVuZGVyLFxuICAgICAgICAgICAgY29ycmVsYXRvcjogc2l6ZW1hcExpc3RlbmVyc1tpZF0uY29ycmVsYXRvcnNbaV1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZWZyZXNoU2xvdCh7XG4gICAgICAgICAgICBhZCxcbiAgICAgICAgICAgIGNvcnJlbGF0b3I6IHNpemVtYXBMaXN0ZW5lcnNbaWRdLmNvcnJlbGF0b3JzW2ldLFxuICAgICAgICAgICAgcHJlcmVuZGVyLFxuICAgICAgICAgICAgaW5mbzogYWRJbmZvXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgc2l6ZW1hcExpc3RlbmVyc1tpZF0uY29ycmVsYXRvcnNbaV0gPSB0cnVlO1xuICAgIH1cbiAgfTtcbn1cblxuLyoqXG4qIEBkZXNjIEFzc2lnbnMgYW4gZXZlbnQgbGlzdGVuZXIgZm9yIGEgc2l6ZSBtYXBwZWQgYWQgd2hpY2ggZGV0ZWN0cyB3aGVuIHRoZSBzY3JlZW4gcmVzaXplcyBwYXN0IGEgYnJlYWtwb2ludCBpbiB0aGUgc2l6ZW1hcC5cbiogQWxzbyBzdG9yZXMgdGhlIGV2ZW50IGxpc3RlbmVyIGluIGFuIG9iamVjdCBzb3J0ZWQgYnkgdGhlIGFkdmVydGlzZW1lbnQgaWQgc28gaXQgY2FuIGJlIHVuYm91bmQgbGF0ZXIgaWYgbmVlZGVkLlxuKiBAcGFyYW0ge29iamVjdH0gcGFyYW1zIC0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgYWxsIG9mIHRoZSBhZHZlcnRpc2VtZW50IGNvbmZpZ3VyYXRpb24gc2V0dGluZ3Mgc3VjaCBhcyBzbG90IG5hbWUsIGlkLCBhbmQgcG9zaXRpb24uXG4qKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRSZXNpemVMaXN0ZW5lcihwYXJhbXMpIHtcbiAgY29uc3QgeyBpZCwgY29ycmVsYXRvcnMgfSA9IHBhcmFtcztcblxuICByZXNpemVMaXN0ZW5lcnNbaWRdID0gZGVib3VuY2UocnVuUmVzaXplRXZlbnRzKHBhcmFtcyksIDI1MCk7XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCByZXNpemVMaXN0ZW5lcnNbaWRdKTtcblxuICAvLyBBZGRzIHRoZSBsaXN0ZW5lciB0byBhbiBvYmplY3Qgd2l0aCB0aGUgaWQgYXMgdGhlIGtleSBzbyB3ZSBjYW4gdW5iaW5kIGl0IGxhdGVyLlxuICBzaXplbWFwTGlzdGVuZXJzW2lkXSA9IHsgbGlzdGVuZXI6IHJlc2l6ZUxpc3RlbmVyc1tpZF0sIGNvcnJlbGF0b3JzIH07XG59XG5cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9zZXJ2aWNlcy9zaXplbWFwcGluZy5qcyIsIi8qKlxuKiBAZGVzYyBEZWJvdW5jZXMgYSBmdW5jdGlvbiBwcmV2ZW50aW5nIGl0IGZyb20gcnVubmluZyBtb3JlIHRoZW4gZXZlcnkgc28gbWFueSBtaWxsaXNlY2RvbmRzLiBVc2VmdWwgZm9yIHNjcm9sbCBvciByZXNpemUgaGFuZGVscnMuXG4qIEBwYXJhbSB7ZnVuY3Rpb259IGZ1bmMgLSBUaGUgZnVuY3Rpb24gdGhhdCBzaG91bGQgYmUgZGVib3VuY2VkLlxuKiBAcGFyYW0ge251bWJlcn0gd2FpdCAtIFRoZSBhbW91bnQgb2YgdGltZSBhIGZ1bmN0aW9uIHNob3VsZCB3YWl0IGJlZm9yZSBpdCBmaXJlcyBhZ2Fpbi5cbiogQHJldHVybiAtIFJldHVybnMgYSBmdW5jdGlvbiBldmVyeSBzbyBtYW55IG1pbGxpc2Vjb25kcyBiYXNlZCBvbiB0aGUgcHJvdmlkZWQgcGFyYW1ldGVycy5cbioqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlYm91bmNlKGZ1bmMsIHdhaXQpIHtcbiAgbGV0IHRpbWVvdXQ7XG4gIHJldHVybiBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICB0aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgIGZ1bmMuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfSwgd2FpdCk7XG4gIH07XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvdXRpbC9kZWJvdW5jZS5qcyIsIi8qKlxuKiBAZGVzYyBJZiBhIGRpZmZlcmVudCBrZXkgaXMgcmVxdWlyZWQgdG8gc2VydmUgcG9zaXRpb24gdGFyZ2V0aW5nIGZvciBvbGRlciBjcmVhdGl2ZXMsIHJlbmFtZSBpdCBoZXJlLlxuKiBAcGFyYW0ge29iamVjdH0gdGFyZ2V0aW5nIC0gVGFyZ2V0aW5nIG9iamVjdCBwYXNzZWQgaW4gZnJvbSB0aGUgYWQgb2JqZWN0LlxuKiBAcGFyYW0ge251bWJlcn0gcG9zaXRpb25WYWx1ZSAtIFRoZSBudGggbnVtYmVyIG9mIGFkVHlwZSBpbmNsdWRlZC5cbiogQHJldHVybiAtIFJldHVybnMgdGhlIHRhcmdldGluZyBvYmplY3Qgd2l0aCB0aGUgb2xkIHBvc2l0aW9uIHZhbHVlIHN0cmlwcGVkIG91dCwgYW5kIHRoZSBuZXcgb25lIHdpdGggdGhlIGRlc2lyZWQga2V5IGluIGl0cyBwbGFjZS5cbioqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlbmFtZVBvc2l0aW9uS2V5KHRhcmdldGluZywgcG9zaXRpb25WYWx1ZSkge1xuICBjb25zdCBuZXdUYXJnZXRpbmdPYmplY3QgPSB0YXJnZXRpbmc7XG4gIGNvbnN0IGtleU5hbWUgPSB0YXJnZXRpbmcucG9zaXRpb24uYXM7XG4gIGRlbGV0ZSBuZXdUYXJnZXRpbmdPYmplY3QucG9zaXRpb247XG4gIG5ld1RhcmdldGluZ09iamVjdFtrZXlOYW1lXSA9IHBvc2l0aW9uVmFsdWU7XG4gIE9iamVjdC5hc3NpZ24odGFyZ2V0aW5nLCBuZXdUYXJnZXRpbmdPYmplY3QpO1xuICByZXR1cm4gdGFyZ2V0aW5nO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3V0aWwvY3VzdG9tVGFyZ2V0aW5nLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==