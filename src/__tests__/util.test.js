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
