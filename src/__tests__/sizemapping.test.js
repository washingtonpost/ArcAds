import {
    prepareSizeMaps,
    parseSizeMappings,
    runResizeEvents,
    setResizeListener,
    sizemapListeners,
  } from '../services/sizemapping';
  import { fetchBids } from '../services/headerbidding';
  const mockSizeMap = [[468, 60], [728, 90]];
  describe('prepareSizeMaps', () => {
    it('return sizeMap object', () => {
      const mockDimensions = [[1000, 300], [970, 90], [728, 90], [300, 250]];
      const result = prepareSizeMaps(mockDimensions, mockSizeMap);
      expect(result.mapping.length).toEqual(2);
      expect(result.breakpoints.length).toEqual(2);
      expect(result.correlators.length).toEqual(2);
    });
  });
  describe('parseSizeMappings', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 1080,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      value: 680,
    });
    it('return sizeMap object', () => {
      const result = parseSizeMappings(mockSizeMap);
      expect(result).toEqual([]);
    });
  });
  describe('setResizeListener', () => {
    const mockParams = {
      id: '123',
      correlators: [1, 2]
    };
    beforeEach(() => {
      global.window = {
        addEventListener: () => jest.fn().mockName('addEventListener'),
      };
    });
    it('return sizeMap object', () => {
      const mockSpy = jest.spyOn(global.window, 'addEventListener');
      setResizeListener(mockParams);
      expect(mockSpy).toHaveBeenCalled();
    });
  });
  describe('runResizeEvents', () => {
    beforeEach(() => {
      global.runResizeEvents = {
        fetchBids: () => jest.fn().mockName('fetchBids'),
        refreshSlot: () => jest.fn().mockName('fetchBids'),
        parseSizeMappings: () => jest.fn().mockName('parseSizeMappings'),
      };
      Object.assign(sizemapListeners, { abc: { correlators: [1, 2, 3] } });
    });
    afterEach(() => {
      global = {};
    });
    const mockParams = {
      ad: {},
      breakpoints: [768, 1080],
      id: 'abc',
      bidding: {
        prebid: {
          enabled: true,
        },
        amazon: {
          enabled: false,
        }
      },
      mapping: mockSizeMap,
      slotName: 'mockSlotName',
      wrapper: {},
      prerender: false,
    };
    it('set ad correlators to true', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 1024,
      });
      const result = runResizeEvents(mockParams);
      const resultFn = result();
      expect(sizemapListeners.abc.correlators[0]).toEqual(true);
    });
  });