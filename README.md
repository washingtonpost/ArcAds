# ArcAds
[![CircleCI](https://circleci.com/gh/washingtonpost/ArcAds.svg?style=shield)](https://circleci.com/gh/washingtonpost/ArcAds)

ArcAds is a [DFP](https://www.google.com/dfp) wrapper created by [Arc Publishing](https://www.arcpublishing.com/) with publishers in mind, using ArcAds you can selectivley make use of many Google Publisher Tag (GPT) features such as size mapping, refreshing, and slot targeting. In addition you can also make use of a series of header bidding vendors such as [Prebid.js](http://prebid.org/) and [Amazon A9/TAM](https://www.a9.com/) by passing in some optional parameters.

## Getting Started
To get started you must include the script tag for ArcAds in your page header, located [here](dist/arcads.js). You can also optionally run `yarn install` followed by `yarn build` to compile it yourself incase you need to make any modifications. Once included you can initialize the ArcAds wrapper class like so in your page header.

```javascript
<script src="path/to/arcads.js"></script>

<script type="text/javascript">
  const arcAds = new ArcAds({
    dfp: {
      id: '123'
    }
  })
</script>
```

Additionally you can install the package with npm. This is mostly useful for when you're integrating ArcAds into a single page application or a JavaScript heavy project. Most implementations should just include the script in the page header.

```
npm install arcads 
```

You can then include it in your own JavaScript projects like so.

```javascript
import { ArcAds } from 'arcads'
```

## Displaying an Advertisement
You can display an advertisement by calling the `registerAd` method, this can be called as many times and wherever you'd like as required.

```javascript
arcAds.registerAd({
  id: 'div-id-123',
  slotName: 'hp/hp-1',
  dimensions: [[300, 250], [300, 600]],
  display: 'desktop'
})
```

Along with the `registerAd` call you also need a div on the page with the same id.

```html
<div id="div-id-123"></div>
```

If you are using an external service to manage initial ad load (like Didomi), set `window.blockArcAdsLoad = true` on page load to block ArcAds from refreshing ads. Set `window.blockArcAdsLoad = false` when you want ArcAds to control refreshing ads again.

The following table shows all of the possible parameters the `registerAd` method accepts.

| Parameter | Description | Type | Requirement |
| ------------- | ------------- | ------------- | ------------- |
| `id`  | The `id` parameter corresponds to a div id on the page that the advertisement should render into. | `String` | `Required` | 
| `slotName`  | The `slotName` parameter is equal to the slot name configured within DFP, for example `sitename/hp/hp-1`. The publisher ID gets attached to the slot name within the ArcAds logic. | `String` | `Required` |
| `dimensions`  | The `dimensions` parameter should be an array with array of arrays containing the advertisement sizes the slot can load. If left empty the advertisement will be considered as an out of page unit. | `Array` | `Optional` |
| `adType`  | The `adType` parameter should describe the type of advertisement, for instance `leaderboard` or `cube`.  | `String` | `Optional` |
| `display`  | The `display` paramter determines which user agents can render the advertisement. The available choices are `desktop`, `mobile`, or `all`. If a value is not provided it will default to `all`. | `String` | `Optional` |
| `targeting`  | The `targeting` paramter accepts an object containing key/value pairs which should attached to the advertisement request. | `Object` | `Optional` |
| `sizemap`  | The `sizemap` paramter accepts an object containing information about the advertisements size mapping, for more information refer to the [Size Mapping portion of the readme](https://github.com/washingtonpost/arcads#size-mapping). | `Object` | `Optional` |
| `bidding`  | The `bidding` paramter accepts an object containing information about the advertisements header bidding vendors, for more information refer to the [Header Bidding portion of the readme](https://github.com/washingtonpost/arcads#header-bidding). | `Object` | `Optional` | 
| `prerender`  | The `prerender` parameter accepts an a function that should fire before the advertisement loads, for more information refer to the [Prerender Hook portion of the readme](https://github.com/washingtonpost/arcads/tree/master#prerender-hook). | `Function` | `Optional` | 

### Out of Page Ads
If an advertisement has an empty or missing `dimensions` parameter it will be considered as a [DFP Out of Page creative](https://support.google.com/dfp_premium/answer/6088046?hl=en) and rendered as such.

### Callback
Whenever an advertisement loads you can access data about the advertisement such as its size and id by passing in an optional callback to the initialization of ArcAds. This ties a handler to the `slotRenderEnded` event that DFP emits and is called everytime an advertisement is about to render, allowing you to make any page layout modifications to accomodate a specific advertisement.

```javascript
const arcAds = new ArcAds({
  dfp: {
    id: '123'
  }
}, (event) => {
  console.log('Advertisement has loaded...', event)
})
```

#### Refreshing an Advertisement
If you require the ability to refresh a specific advertisement you can do so via the googletag library, providing it the slot object from GPT. You can get access to the slot object in the callback of ArcAds via `event.slot`.

```javascript
const arcAds = new ArcAds({
  dfp: {
    id: '123'
  }
}, (event) => {
  window.adSlot = event.slot
})

// Refresh a single ad slot
window.googletag.pubads().refresh([window.adSlot])

// Refresh all ad slots on the page
window.googletag.pubads().refresh()
```

### Targeting
Advertisement targeting parameters can be passed to the registration call via the `targeting` object.

```javascript
arcAds.registerAd({
  id: 'div-id-123',
  slotName: 'hp/hp-1',
  adType: 'cube',
  dimensions: [[300, 250], [300, 600]],
  display: 'all',
  targeting: {
    section: 'weather'
  }
})
```

The service will automatically give the advertisement a `position` target key/value pair if either the `targeting` object or `position` key of the targeting object are not present. The position value will incriment by 1 in sequence for each of the same `adType` on the page. This is a common practice between ad traffickers so this behavior is baked in, only if the trafficker makes use of this targeting will it have any effect on the advertisement rendering. 

If `adType` is exluded from the `registerAd` call the automatic position targeting will not be included.

## Size Mapping
You can configure DFP size mapped ads with the same registration call by adding a `sizemap` object. To utilize size mapping the `dimensions` key should be updated to include an array representing a nested array of arrays containing the applicable sizes for a specific breakpoint.

```javascript
[ [[970, 250], [970, 90], [728, 90]],
  [[728, 90]],
  [[320, 100], [320, 50]] ]
```

Followed by an array of equal lengths of breakpoints which will sit within `sizemap.breakpoints`.

```javascript
[ [1280, 0], [800, 0], [0, 0] ]
```

When put together this will mean that at a window width of 1280 wide, the service can load a `970x250`, `970x90` or a `728x90` advertisement. At 800 wide, it can load a `728x90`, and anything below 800 it will load a `320x90` or a `320x50`.

If the advertisement should refresh dynamically when the user resizes the screen after the initial load you can toggle `refresh` to `true`. otherwise it should be `false`.

```javascript
arcAds.registerAd({
  id: 'div-id-123',
  slotName: 'hp/hp-1',
  adType: 'cube',
  dimensions: [ [[970, 250], [970, 90], [728, 90]], [[728, 90]], [[320, 100], [320, 50]] ],
  targeting: {
    section: 'weather'
  },
  sizemap: {
    breakpoints: [ [1280, 0], [800, 0], [0, 0] ],
    refresh: true
  }
})
```

## Prerender Hook
ArcAds provides a way for you to get information about an advertisement before it loads, which is useful for attaching targeting data from third party vendors.

You can setup a function within the `registerAd` call by adding a `prerender` paramter, the value of which being the function you'd like to fire before the advertisement loads. This function will also fire before the advertisement refreshes if you're using sizemapping.

```javascript
arcAds.registerAd({
  id: 'div-id-123',
  slotName: 'hp/hp-1',
  dimensions: [[300, 250], [300, 600]],
  display: 'desktop',
  prerender: window.adFunction
})
```

Your `prerender` function must return a promise. Once it's resolved the advertisement will display. If you do not resolve the promise the advertisement will *not* render.

```javascript
window.adFunction = function(ad) {
  return new Promise(function(resolve, reject) {
    // The 'ad' arguement will provide information about the unit
    console.log(ad)
    // If you do not resolve the promise the advertisement will not display
    resolve()
  });
}
```

You can gather information about the advertisement by accessing the `ad` argument/object.

| Key  | Description |
| ------------- | ------------- |
| `adUnit`  | An object containing the GPT ad slot. This can be used when calling other GPT methods.  |
| `adSlot`  | Contains a string with the full slot name of the advertisement.  |
| `adDimensions`  | Contains an array with the size of the advertisement which is about to load.   |
| `adId`  | Contains a string with the id of the advertisement.  |

For a more detailed example of how to utilize this functionality [please see the wiki](https://github.com/washingtonpost/arcads/wiki/Utilizing-a-Prerender-Hook).

## Header Bidding
ArcAds supports Prebid.js and Amazon TAM/A9. To enable these services you must first enable them when you configure the wrapper.

### Prebid.js
If you'd like to include Prebid.js you must include the library before `arcads.js`. You can get a customized version of Prebid.js with the adapters your site needs from their website [here](http://prebid.org/download.html).

```javascript
<script src="path/to/prebid.js"></script>
<script src="path/to/arcads.js"></script>

<script type="text/javascript">
  const arcAds = new ArcAds({
    dfp: {
      id: '123'
    }, 
    bidding: {
      prebid: {
        enabled: true
      }
    }
  })
</script>

```
You can enable Prebid.js on the wrapper by adding a `prebid` object to the wrapper initialization and setting `enabled: true`. You can also optionally pass it a `timeout` value which corresponds in milliseconds how long Prebid.js will wait until it closs out the bidding for the advertisements on the page. By default the timeout will be set to `700`.

```javascript
const arcAds = new ArcAds({
  dfp: {
    id: '123'
  },
  bidding: {
    prebid: {
      enabled: true,
      timeout: 1000
    }
  }
}
```

If you want to use the slotName instead of the ad id when registering ads, pass `useSlotForAdUnit: true`.

```javascript
const arcAds = new ArcAds({
  dfp: {
    id: '123'
  },
  bidding: {
    prebid: {
      enabled: true,
      timeout: 1000,
      useSlotForAdUnit: true
    }
  }
}
```

On the wrapper you can also configure a size mapping configuration, which will provide information to Prebid.js on which sized advertisements it should fetch bids for on each breakpoint. For more information on what needs to be configured within the `sizeConfig` array click [here](http://prebid.org/dev-docs/examples/size-mapping.html).

```javascript
const arcAds = new ArcAds({
  dfp: {
    id: '123'
  },
  bidding: {
    prebid: {
      enabled: true,
      timeout: 1000,
      sizeConfig: [
        {
          'mediaQuery': '(min-width: 1024px)',
          'sizesSupported': [
            [970, 250],
            [970, 90],
            [728, 90]
          ],
          'labels': ['desktop']
        }, 
        {
          'mediaQuery': '(min-width: 480px) and (max-width: 1023px)',
          'sizesSupported': [
            [728, 90]
          ],
          'labels': ['tablet']
        }, 
        {
          'mediaQuery': '(min-width: 0px)',
          'sizesSupported': [
            [320, 100],
            [320, 50]
          ],
          'labels': ['phone']
        }
      ]
    }
  }
})
```

On the advertisement registration you can then provide information about which bidding services that specific advertisement should use. You can find a list of paramters that Prebid.js accepts for each adapter on the [Prebid.js website](http://prebid.org/dev-docs/publisher-api-reference.html). Additionally you can turn on [Prebid.js debugging](http://prebid.org/dev-docs/toubleshooting-tips.html) by adding `?pbjs_debug=true` to the url.

```javascript
arcAds.registerAd({
  id: 'div-id-123',
  slotName: 'hp/hp-1',
  adType: 'cube',
  display: 'desktop',
  dimensions: [ [[970, 250], [970, 90], [728, 90]], [[728, 90]], [[320, 100], [320, 50]] ],
  sizemap: {
    breakpoints: [ [1280, 0], [800, 0], [0, 0] ],
    refresh: 'true'
  },
  bidding: {
    prebid: {
      enabled: true,
      bids: [{
        bidder: 'appnexus',
        labels: ['desktop', 'tablet', 'phone'],
        params: {
          placementId: '10433394' 
        }
      }]
    }
  }
})
```

### Amazon TAM/A9
You can enable Amazon A9/TAM on the service by adding an `amazon` object to the wrapper initialization and then passing it `enabled: true`. You must also include the `apstag` script on your page with: 
```
<script src="https://c.amazon-adsystem.com/aax2/apstag.js"></script>
```

You must also provide your publication id that corresponds to the owners Amazon account.

```javascript
const arcAds = new ArcAds({
  dfp: {
    id: '123'
  },
  bidding: {
    amazon: {
      enabled: true,
      id: '123'
    }
  }
})
```

On the advertisement registration you simply provide `enabled: true` for the specific advertisement within the `bidding` object. There are no additional properties which are required.

```javascript
arcAds.registerAd({
  id: 'div-id-123',
  slotName: 'hp/hp-1',
  adType: 'cube',
  display: 'desktop',
  dimensions: '[ [[970, 250], [970, 90], [728, 90]], [[728, 90]], [[320, 100], [320, 50]] ]',
  sizemap: {
    breakpoints: '[ [1280, 0], [800, 0], [0, 0] ]',
    refresh: 'true'
  },
  bidding: {
    amazon: {
      enabled: true
    }
  }
})
```

## Registering Multiple Ads
You can display multiple ads at once using the `registerAdCollection` method. This is useful if you're initializing multiple advertisements at once in the page header. To do this you can pass an array of advertisement objects similar to the one you would with the `registerAd` call.

```javascript
const ads = [{
    id: 'div-id-123',
    slotName: 'hp/hp-1',
    adType: 'cube',
    display: 'desktop',
    dimensions: '[ [[970, 250], [970, 90], [728, 90]], [[728, 90]], [[320, 100], [320, 50]] ]',
    sizemap: {
      breakpoints: '[ [1280, 0], [800, 0], [0, 0] ]',
      refresh: 'true'
    },
    bidding: {
      prebid: {
        enabled: true,
        bids: [{
          bidder: 'appnexus',
          labels: ['desktop', 'tablet', 'phone'],
          params: {
            placementId: '10433394' 
          }
        }]
      }
  },
  {
    id: 'div-id-456',
    slotName: 'hp/hp-2',
    adType: 'square',
    display: 'mobile',
    dimensions: '[ [300, 250], [300, 600] ]',
    bidding: {
      prebid: {
        enabled: true,
        bids: [{
          bidder: 'appnexus',
          labels: ['desktop', 'tablet', 'phone'],
          params: {
            placementId: '10433394' 
          }
        }]
      }
  }
]


arcAds.registerAdCollection(ads)
```

## Developer Tools
There's a series developer tools availble, to get started run `yarn install`.

| Command  | Description |
| ------------- | ------------- |
| `yarn dev`  | Runs the development command, watches for changes and compiles the changes down to the `dist` directory.  |
| `yarn build`  | Builds the project into the `dist` directory with minification.  |
| `yarn docs`  | Generates ESDoc documentation in the `docs` directory on-demand.  |
| `yarn test`  | Runs a series of unit tests with Jest. Tests are automatically validated during a pull request.  |
| `yarn debug`  | Starts a local http server so you can link directly to the script during development. For example `<script src="http://localhost:9000/dist/arcads.js"></script> |

### Slot Override
You can override the slot name of every advertisement on the page by appending `?adslot=` to the URL. This will override whatever is placed inside of the `slotName` field when invoking the `registerAd` method. For example if you hit the URL `arcpublishing.com/?adslot=homepage/myad`, the full ad slot path will end up being your DFP id followed by the value: `123/homepage/myad`.

You can also debug slot names and GPT in general by typing `window.googletag.openConsole()` into the browsers developer console.

## Contributing
If you'd like to contribute to ArcAds please read our [contributing guide](https://github.com/washingtonpost/ArcAds/blob/master/CONTRIBUTING.md).
