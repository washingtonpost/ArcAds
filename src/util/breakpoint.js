/** @desc Utility class that determines the breakpoint based on window width. **/
export class BreakpointDetection {
  /**
   * @desc Constructor.
   * @param {number} desktopBreakpoint The minimum width at which the browser is considered desktop.
   **/
  constructor(desktopBreakpoint) {
    this.desktopBreakpoint = desktopBreakpoint;
  }

  /**
   * @desc Determines if the user is using a mobile device.
   **/
  any() {
    return (window.innerWidth < this.desktopBreakpoint);
  }
}
