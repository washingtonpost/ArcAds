!function(e,n){if("object"==typeof exports&&"object"==typeof module)module.exports=n();else if("function"==typeof define&&define.amd)define([],n);else{var i=n();for(var t in i)("object"==typeof exports?exports:e)[t]=i[t]}}("undefined"!=typeof self?self:this,function(){return function(e){var n={};function i(t){if(n[t])return n[t].exports;var r=n[t]={i:t,l:!1,exports:{}};return e[t].call(r.exports,r,r.exports,i),r.l=!0,r.exports}return i.m=e,i.c=n,i.d=function(e,n,t){i.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:t})},i.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(n,"a",n),n},i.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},i.p="",i(i.s=3)}([function(e,n,i){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.initializeGPT=function(){window.googletag=window.googletag||{},window.googletag.cmd=window.googletag.cmd||[],(0,t.appendResource)("script","//www.googletagservices.com/tag/js/gpt.js",!0,!0)},n.refreshSlot=function(e){var n=e.ad,i=e.correlator,t=void 0!==i&&i,r=e.prerender,o=void 0===r?null:r,a=e.info,d=void 0===a?{}:a;new Promise(function(e){if(o)try{o(d).then(function(){e("Prerender function has completed.")})}catch(n){console.warn("ArcAds: Prerender function did not return a promise or there was an error.\n          Documentation: https://github.com/wapopartners/arc-ads/wiki/Utilizing-a-Prerender-Hook"),e("Prerender function did not return a promise or there was an error, ignoring.")}else e("No Prerender function was provided.")}).then(function(){!function e(){window.googletag&&googletag.pubadsReady?window.googletag.pubads().refresh([n],{changeCorrelator:t}):setTimeout(function(){e()},200)}()})},n.queueGoogletagCommand=function(e){window.googletag.cmd.push(e)},n.setTargeting=function(e,n){for(var i in n)n.hasOwnProperty(i)&&n[i]&&e.setTargeting(i,n[i])},n.dfpSettings=function(e){window.googletag.pubads().disableInitialLoad(),window.googletag.pubads().enableSingleRequest(),window.googletag.pubads().enableAsyncRendering(),window.googletag.enableServices(),e&&window.googletag.pubads().addEventListener("slotRenderEnded",e)},n.determineSlotName=function(e,n){var i=(0,r.expandQueryString)("adslot");if(i&&(""!==i||null!==i))return e+"/"+i;return e+"/"+n};var t=i(5),r=i(6)},function(e,n,i){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.initializeBiddingServices=function(e){var n=e.prebid,i=void 0!==n&&n,t=e.amazon,o=void 0!==t&&t;window.arcBiddingReady=!1;var a=new Promise(function(e){if(i&&i.enabled){if(!pbjs){var n=n||{};n.que=n.que||[]}e("Prebid has been initialized")}else e("Prebid is not enabled on the wrapper...")}),d=new Promise(function(e){o&&o.enabled&&window.apstag?o.id&&""!==o.id?(0,r.queueAmazonCommand)(function(){window.apstag.init({pubID:o.id,adServer:"googletag"}),e("Amazon scripts have been added onto the page!")}):(console.warn("ArcAds: Missing Amazon account id. \n          Documentation: https://github.com/wapopartners/arc-ads#amazon-tama9"),e("Amazon is not enabled on the wrapper...")):e("Amazon is not enabled on the wrapper...")});Promise.all([a,d]).then(function(){window.arcBiddingReady=!0})},n.fetchBids=function e(n){var i=this;var a=n.ad,d=n.id,s=n.slotName,u=n.dimensions,c=n.wrapper,l=n.bidding,p=n.correlator,f=void 0!==p&&p,g=n.prerender,v=n.breakpoints;var h={adUnit:a,adSlot:s,adDimensions:u,adId:d};var b=new Promise(function(e){if(c.prebid&&c.prebid.enabled){var n=c.prebid.timeout||700;t.queuePrebidCommand.bind(i,(0,t.fetchPrebidBids)(a,d,n,h,g,function(){e("Fetched Prebid ads!")}))}else e("Prebid is not enabled on the wrapper...")});var m=new Promise(function(e){c.amazon&&c.amazon.enabled?(0,r.fetchAmazonBids)(d,s,u,v,function(){e("Fetched Amazon ads!")}):e("Amazon is not enabled on the wrapper...")});window.arcBiddingReady?Promise.all([b,m]).then(function(){(0,o.refreshSlot)({ad:a,correlator:f,prerender:g,info:h})}):setTimeout(function(){e({ad:a,id:d,slotName:s,dimensions:u,wrapper:c,bidding:l,correlator:f,prerender:g})},200)};var t=i(2),r=i(7),o=i(0)},function(e,n,i){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.queuePrebidCommand=function(e){pbjs.que.push(e)},n.fetchPrebidBids=function(e,n,i,r,o){var a=arguments.length>5&&void 0!==arguments[5]?arguments[5]:null;pbjs.requestBids({timeout:i,adUnitCodes:[n],bidsBackHandler:function(){pbjs.setTargetingForGPTAsync([n]),a?a():(0,t.refreshSlot)({ad:e,info:r,prerender:o})}})},n.addUnit=function(e,n,i){var t=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{},r={code:e,bids:i};r.mediaTypes={banner:{sizes:n}};var o=t.sizeConfig;pbjs.addAdUnits(r),o&&pbjs.setConfig({sizeConfig:o})};var t=i(0)},function(e,n,i){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.ArcAds=void 0;var t=function(){function e(e,n){for(var i=0;i<n.length;i++){var t=n[i];t.enumerable=t.enumerable||!1,t.configurable=!0,"value"in t&&(t.writable=!0),Object.defineProperty(e,t.key,t)}}return function(n,i,t){return i&&e(n.prototype,i),t&&e(n,t),n}}(),r=i(4),o=i(1),a=i(0),d=i(2),s=i(8);function u(e){if(Array.isArray(e)){for(var n=0,i=Array(e.length);n<e.length;n++)i[n]=e[n];return i}return Array.from(e)}n.ArcAds=function(){function e(n){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;!function(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}(this,e),this.dfpId=n.dfp.id||"",this.wrapper=n.bidding||{},this.positions=[],window.isMobile=r.MobileDetection,""===this.dfpId?console.warn("ArcAds: DFP id is missing from the arcads initialization script. \n        Documentation: https://github.com/wapopartners/arc-ads#getting-started"):((0,a.initializeGPT)(),(0,a.queueGoogletagCommand)(a.dfpSettings.bind(this,i)),(0,o.initializeBiddingServices)(this.wrapper))}return t(e,[{key:"registerAd",value:function(e){var n=e.id,i=e.dimensions,t=e.adType,r=void 0!==t&&t,o=e.targeting,s=void 0===o?{}:o,c=e.display,l=void 0===c?"all":c,p=e.bidding,f=void 0!==p&&p,g=e.iframeBidders,v=void 0===g?["openx"]:g,h=[],b=!1;if(i&&void 0!==i&&i.length>0&&void 0===i[0][0][0]?h.push.apply(h,u(i)):i&&i.forEach(function(e){h.push.apply(h,u(e))}),!(s&&s.hasOwnProperty("position")||!1===r)){var m=this.positions[r]+1||1;this.positions[r]=m;var w=Object.assign(s,{position:m});Object.assign(e,{targeting:w})}(isMobile.any()&&"mobile"===l||!isMobile.any()&&"desktop"===l||"all"===l)&&(f.prebid&&f.prebid.bids&&this.wrapper.prebid&&this.wrapper.prebid.enabled&&h&&(pbjs&&v.length>0&&pbjs.setConfig({userSync:{iframeEnabled:!0,filterSettings:{iframe:{bidders:v,filter:"include"}}}}),d.queuePrebidCommand.bind(this,(0,d.addUnit)(n,h,f.prebid.bids,this.wrapper.prebid))),(b=this.displayAd.bind(this,e))&&(0,a.queueGoogletagCommand)(b))}},{key:"registerAdCollection",value:function(e){var n=this;e.forEach(function(e){n.registerAd(e)})}},{key:"displayAd",value:function(e){var n=e.id,i=e.slotName,t=e.dimensions,r=e.targeting,d=e.sizemap,u=void 0!==d&&d,c=e.bidding,l=void 0!==c&&c,p=e.prerender,f=void 0===p?null:p,g=(0,a.determineSlotName)(this.dfpId,i),v=t&&!t.length?null:t,h=t?window.googletag.defineSlot(g,v,n):window.googletag.defineOutOfPageSlot(g,n);if(u&&u.breakpoints&&t){var b=(0,s.prepareSizeMaps)(v,u.breakpoints),m=b.mapping,w=b.breakpoints,y=b.correlators;if(!h)return!1;h.defineSizeMapping(m),u.refresh&&(0,s.setResizeListener)({ad:h,slotName:g,breakpoints:w,id:n,mapping:m,correlators:y,bidding:l,wrapper:this.wrapper,prerender:f})}h.addService(window.googletag.pubads()),(0,a.setTargeting)(h,r);var A=u&&u.breakpoints?u.breakpoints:[];l&&t?(0,o.fetchBids)({ad:h,id:n,slotName:g,dimensions:v,wrapper:this.wrapper,prerender:f,bidding:l,breakpoints:A}):(0,a.refreshSlot)({ad:h,prerender:f,info:{adUnit:h,adSlot:g,adDimensions:v,adId:n}})}}]),e}()},function(e,n,i){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var t=function(){function e(e,n){for(var i=0;i<n.length;i++){var t=n[i];t.enumerable=t.enumerable||!1,t.configurable=!0,"value"in t&&(t.writable=!0),Object.defineProperty(e,t.key,t)}}return function(n,i,t){return i&&e(n.prototype,i),t&&e(n,t),n}}();var r=n.MobileDetection=function(){function e(){!function(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}(this,e)}return t(e,null,[{key:"Android",value:function(){return!!navigator.userAgent.match(/Android/i)}},{key:"AndroidOld",value:function(){return!!navigator.userAgent.match(/Android 2.3.3/i)}},{key:"AndroidTablet",value:function(){return!(!navigator.userAgent.match(/Android/i)||navigator.userAgent.match(/Mobile/i))}},{key:"Kindle",value:function(){return!!navigator.userAgent.match(/Kindle/i)}},{key:"KindleFire",value:function(){return!!navigator.userAgent.match(/KFOT/i)}},{key:"Silk",value:function(){return!!navigator.userAgent.match(/Silk/i)}},{key:"BlackBerry",value:function(){return!!navigator.userAgent.match(/BlackBerry/i)}},{key:"iOS",value:function(){return!!navigator.userAgent.match(/iPhone|iPad|iPod/i)}},{key:"iPhone",value:function(){return!!navigator.userAgent.match(/iPhone|iPod/i)}},{key:"iPad",value:function(){return!!navigator.userAgent.match(/iPad/i)}},{key:"Windows",value:function(){return!!navigator.userAgent.match(/IEMobile/i)}},{key:"FirefoxOS",value:function(){return!!navigator.userAgent.match(/Mozilla/i)&&!!navigator.userAgent.match(/Mobile/i)}},{key:"Retina",value:function(){return window.retina||window.devicePixelRatio>1}},{key:"any",value:function(){return this.Android()||this.Kindle()||this.KindleFire()||this.Silk()||this.BlackBerry()||this.iOS()||this.Windows()||this.FirefoxOS()}}]),e}();n.default=r},function(e,n,i){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.appendResource=function(e,n,i,t,r){var o=document.createElement(e);if("script"!==e)return;o.src=n,o.async=i||!1,o.defer=i||t||!1;(document.head||document.documentElement).appendChild(o),r&&r()}},function(e,n,i){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.expandQueryString=function(e){var n=window.location.href,i=e.replace(/[[\]]/g,"\\$&"),t=new RegExp("[?&]"+i+"(=([^&#]*)|&|#|$)").exec(n);if(!t)return null;if(!t[2])return"";return decodeURIComponent(t[2].replace(/\+/g," "))}},function(e,n,i){"use strict";function t(e){window.apstag&&e()}Object.defineProperty(n,"__esModule",{value:!0}),n.fetchAmazonBids=function(e,n,i,r){var o=arguments.length>4&&void 0!==arguments[4]?arguments[4]:null,a=i;if(r&&void 0!==window.innerWidth&&void 0!==i[0][0][0]){for(var d=window.innerWidth,s=-1,u=r.length,c=0;c<u;c++)if(d>=r[c][0]){s=c;break}a=i[s]}t(function(){var i={slotName:n,slotID:e,sizes:a};window.apstag.fetchBids({slots:[i]},function(){window.apstag.setDisplayBids(),o&&o()})})},n.queueAmazonCommand=t},function(e,n,i){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.resizeListeners=n.sizemapListeners=void 0,n.prepareSizeMaps=function(e,n){var i=[],t=[],r=[];return(n.length?n:null).forEach(function(n,o){i.push([n,e[o]]),-1===t.indexOf(n[0])&&(t.push(n[0]),r.push(!1))}),t.sort(function(e,n){return e-n}),{mapping:i,breakpoints:t,correlators:r}},n.parseSizeMappings=s,n.runResizeEvents=u,n.setResizeListener=function(e){var n=e.id,i=e.correlators;d[n]=(0,t.debounce)(u(e),250),window.addEventListener("resize",d[n]),a[n]={listener:d[n],correlators:i}};var t=i(9),r=i(1),o=i(0),a=n.sizemapListeners={},d=n.resizeListeners={};function s(e){try{var n=[window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth,window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight],i=e.filter(function(e){return e[0][0]<=n[0]&&e[0][1]<=n[1]}),t=i.length>0?i[0][1]:[];return t.length>0&&t[0].constructor!==Array&&(t=[t]),t}catch(n){return e[e.length-1][1]}}function u(e){var n=void 0,i=!1;return function(){for(var t=e.ad,d=e.breakpoints,u=e.id,c=e.bidding,l=e.mapping,p=e.slotName,f=e.wrapper,g=e.prerender,v=window.innerWidth,h=void 0,b=void 0,m=0;m<d.length;m++){if(h=d[m],b=d[m+1],v>h&&(v<b||!b)&&n!==h||v===h&&!i){n=h,i=!0;var w=s(l),y={adUnit:t,adSlot:p,adDimensions:w,adId:u};c.prebid&&c.prebid.enabled||c.amazon&&c.amazon.enabled?(0,r.fetchBids)({ad:t,id:u,slotName:p,dimensions:w,bidding:c,wrapper:f,prerender:g,correlator:a[u].correlators[m],breakpoints:d}):(0,o.refreshSlot)({ad:t,correlator:a[u].correlators[m],prerender:g,info:y})}a[u].correlators[m]=!0}}}},function(e,n,i){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.debounce=function(e,n){var i=void 0;return function(){for(var t=this,r=arguments.length,o=Array(r),a=0;a<r;a++)o[a]=arguments[a];clearTimeout(i),i=setTimeout(function(){i=null,e.apply(t,o)},n)}}}])});