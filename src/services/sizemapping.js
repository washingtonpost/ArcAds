import { debounce } from '../util/debounce';
import { fetchBids } from './headerbidding';
import { refreshSlot } from './gpt';

/** @desc An object containing all of the size map refresh event listeners and correlators for size mapping. **/
export const sizemapListeners = {};

/** @desc An object containing all of the screen resize event listeners for size mapping. **/
export const resizeListeners = {};

/**
* @desc Prepares a set of dimensions and their corresponding breakpoints to create a sizemap which is readable by GPT.
* @param {array} dimensions - An array containing all of the applicable sizes the advertisement can use.
* @param {array} sizemap - An array containing all of the applicable breakpoints for the sizemapping.
**/
export function prepareSizeMaps(dimensions, sizemap) {
  const mapping = [];
  const breakpoints = [];
  const correlators = [];
  const parsedSizemap = !sizemap.length ? null : sizemap;

  parsedSizemap.forEach((value, index) => {
    mapping.push([value, dimensions[index]]);

    // Filters duplicates from the mapping
    if (breakpoints.indexOf(value[0]) === -1) {
      breakpoints.push(value[0]);
      correlators.push(false);
    }
  });

  breakpoints.sort((a, b) => { return a - b; });

  return { mapping, breakpoints, correlators };
}

/**
* @desc Determines which set of ad sizes are about to display based on the users current screen size.
* @param {array} sizeMappings - An array containing the advertisements GPT readable size mapping.
* @return {array} - Returns an array containing the ad sizes which relate to the users current window width.
**/
export function parseSizeMappings(sizeMappings) {
  try {
    const width = window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

    const height = window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;

    const sd = [width, height];

    /* Filters mappings that are valid by confirming that the current screen dimensions
      are both greater than or equal to the breakpoint [x, y] minimums specified in the first position in the mapping.
      Returns the leftmost mapping's sizes or an empty array. */
    const validMappings = sizeMappings.filter((mapping) => {
      return mapping[0][0] <= sd[0] && mapping[0][1] <= sd[1];
    });

    let result = validMappings.length > 0 ? validMappings[0][1] : [];

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
export function runResizeEvents(params) {
  let lastBreakpoint;
  let initialLoad = false;

  return () => {
    const {
      ad,
      breakpoints,
      id,
      bidding,
      mapping,
      slotName,
      wrapper,
      prerender } = params;

    const width = window.innerWidth;
    let breakpoint;
    let nextBreakpoint;

    for (let i = 0; i < breakpoints.length; i++) {
      breakpoint = breakpoints[i];
      nextBreakpoint = breakpoints[i + 1];

      if ((width > breakpoint && (width < nextBreakpoint || !nextBreakpoint) && lastBreakpoint !== breakpoint) || (width === breakpoint && !initialLoad)) {
        lastBreakpoint = breakpoint;
        initialLoad = true;

        // Fetches a set of dimensions for the ad which is about to display.
        const parsedSizeMapping = parseSizeMappings(mapping);

        const adInfo = {
          adUnit: ad,
          adSlot: slotName,
          adDimensions: parsedSizeMapping,
          adId: id
        };

        // If it's included in a header-bidding service we re-fetch bids for the given slot, otherwise it refreshes as normal.
        if ((bidding.prebid && bidding.prebid.enabled) || (bidding.amazon && bidding.amazon.enabled)) {
          fetchBids({
            ad,
            id,
            slotName,
            dimensions: parsedSizeMapping,
            bidding,
            wrapper,
            prerender,
            correlator: sizemapListeners[id].correlators[i],
            breakpoints
          });
        } else {
          refreshSlot({
            ad,
            correlator: sizemapListeners[id].correlators[i],
            prerender,
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
export function setResizeListener(params) {
  const { id, correlators } = params;

  resizeListeners[id] = debounce(runResizeEvents(params), 250);
  window.addEventListener('resize', resizeListeners[id]);

  // Adds the listener to an object with the id as the key so we can unbind it later.
  sizemapListeners[id] = { listener: resizeListeners[id], correlators };
}

