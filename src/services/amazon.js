/**
* @desc Fetches a bid for an advertisement based on which services are enabled on unit and the wrapper.
* @param {string} id - A string containing the advertisement id corresponding to the div the advertisement will load into.
* @param {string} slotName - A string containing the slot name of the advertisement, for instance '1234/adn.com/homepage'.
* @param {array} dimensions - An array containing all of the applicable sizes the advertisement can use.
* @param {function} cb - An optional callback function that should fire whenever the bidding has concluded.
**/
export function fetchAmazonBids(id, slotName, dimensions, breakpoints, cb = null) {
  // pass in breakpoints array
  let sizeArray = dimensions;

  if (breakpoints && typeof window.innerWidth !== 'undefined' && dimensions[0][0][0] !== undefined) {
    const viewPortWidth = window.innerWidth;
    let useIndex = -1;
    const breakpointsLength = breakpoints.length;

    for (let ind = 0; ind < breakpointsLength; ind++) {
      if (viewPortWidth >= breakpoints[ind][0]) {
        useIndex = ind;
        break;
      }
    }

    sizeArray = dimensions[useIndex];
  }

  queueAmazonCommand(() => {
    const slot = {
      slotName,
      slotID: id,
      sizes: sizeArray
    };

    // Retrieves the bid from Amazon
    window.apstag.fetchBids({ slots: [slot] }, () => {
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
export function queueAmazonCommand(cmd) {
  if (window.apstag) {
    cmd();
  }
}
