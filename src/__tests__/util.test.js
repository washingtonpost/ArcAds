import { BreakpointDetection } from '../util/breakpoint';
import { renamePositionKey } from '../util/customTargeting';

describe('The CustomTargeting.js functions', () => {
  it('should take targeting and position value, and rename the key as posn', () => {
    const targeting = {
      position: {
        as: 'posn'
      }
    };

    const positionValue = 2;
    const updatedTargeting = renamePositionKey(targeting, positionValue);
    const newTargeting = {
      posn: positionValue
    };

    expect(updatedTargeting).toEqual(newTargeting);
  });
});

describe('BreakpointDetection', () => {
  it('should initialize', () => {
    const breakpointDetection = new BreakpointDetection(720);
    expect(breakpointDetection).not.toBeUndefined();
  });

  it('should detect small devices as mobile', () => {
    window.innerWidth = 320;
    const breakpointDetection = new BreakpointDetection(720);
    const isMobile = breakpointDetection.any();
    expect(isMobile).toBeTrue();
  });

  it('should detect large devices as desktop', () => {
    window.innerWidth = 1044;
    const breakpointDetection = new BreakpointDetection(720);
    const isMobile = breakpointDetection.any();
    expect(isMobile).toBeFalse();
  });
});
