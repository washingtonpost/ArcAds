/**
 * @jest-environment jsdom
 */

import { expandQueryString } from '../util/query.js';

describe('expandQueryString', () => {

    const saveLocation = global.window.location;

    afterAll(() => {
        delete global.window.location;
        global.window.location = saveLocation;
    });

    it('gets url value for param name passed', () => {
        delete global.window.location;
        global.window = Object.create(window);
        global.window.location = {
          href:'http://www.test.com?adslot=hello',
        };

      const result = expandQueryString('adslot');
      expect(result).toEqual('hello');
    });

    it('if no result return empty string', () => {
        delete global.window.location;
        global.window = Object.create(window);
        global.window.location = {
          href:'http://www.test.com?adslot=',
        };

      const result = expandQueryString('adslot');
      expect(result).toEqual('');
    });
  });
