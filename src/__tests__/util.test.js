/**
 * @jest-environment jsdom
 */

import anylogger from 'anylogger';
import 'anylogger-console';
import { renamePositionKey } from '../util/customTargeting';
import { debounce } from '../util/debounce';
import { sendLog } from '../util/log';

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

describe('debounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  test('debounce', () => {
    const func = jest.fn();
    const debouncedFunc = debounce(func, 1000);

    // Call debounced function immediately
    debouncedFunc();
    expect(func).toHaveBeenCalledTimes(0);

    // Call debounced function several times with 500ms between each call
    for (let i = 0; i < 10; i += 1) {
      setTimeout(() => {}, 500);
      debouncedFunc();
    }

    // Verify debounced function was not called yet
    expect(func).toHaveBeenCalledTimes(0);

    // Fast forward time
    jest.runAllTimers();

    // Verify debounced function was only called once
    expect(func).toHaveBeenCalledTimes(1);
  });
});

describe('sendLog', () => {
  test('sendLog', () => {
    const location = {
      ...window.location,
      search: '?debug=true'
    };

    Object.defineProperty(window, 'location', {
      writable: true,
      value: location
    });

    const DATE_TO_USE = new Date('Thu Feb 04 2021 11:04:05 GMT-0500');
    global.Date = jest.fn(() => DATE_TO_USE);
    anylogger.log = jest.fn();
    sendLog('testFunc()', 'a test of the send log', null);
    setTimeout(() => {
      expect(anylogger.log).toHaveBeenCalledWith('arcads.js', [{
        description: 'a test of the send log',
        'logging from': 'testFunc()',
        service: 'ArcAds',
        slotName: null,
        timestamp: 'Thu Feb 04 2021 11:04:05 GMT-0500 (Eastern Standard Time)'
      }]);
    }, 500);
  });

  test('sendLog if window undefined', () => {
    delete global.window;
    sendLog('testFunc()', 'a test of the send log', null);
    setTimeout(() => {
      expect(console.error).toHaveBeenCalled();
    }, 500);
  });
});
