import {
    queuePrebidCommand,
    fetchPrebidBids,
    addUnit,
  } from '../services/prebid';

  const setpbjs = () => {
    global.pbjs = {
      que: [],
      addAdUnits: () => jest.fn().mockName('addAdUnits'),
      requestBids: () => jest.fn().mockName('requestBids'),
      setConfig: () => jest.fn().mockName('setConfig'),
      setTargetingForGPTAsync: jest.fn().mockName('setTargetingForGPTAsync'),
    };
  };

  describe('pbjs', () => {
    const info = {
      bids: [],
    };

    beforeEach(() => {
      setpbjs();
    });

    afterEach(() => {
      window.blockArcAdsPrebid = false;
      global.pbjs = {};
      jest.restoreAllMocks();
    });

    it('fetchPrebidBidsArray', () => {
      const spy = jest.spyOn(pbjs, 'requestBids');
      fetchPrebidBids({}, {}, {}, info, {});
      expect(spy).toHaveBeenCalled();
    });

    it('return undefined while window blockArcAdsPrebid is set to true', () => {
      window.blockArcAdsPrebid = true;
      const result = fetchPrebidBids({}, {}, {}, info, {});
      expect(result).toEqual(undefined);
    });

    it('push fn into queuePrebidCommand', () => {
      const mockFn = jest.fn();
      queuePrebidCommand(mockFn);
      expect(pbjs.que.length).toEqual(1);
    });

    it('addUnit while slot is available', () => {
      const spy = jest.spyOn(pbjs, 'addAdUnits');
      addUnit('', '', {}, {}, {});
      expect(spy).toHaveBeenCalled();
    });

    it('called config  while sizeConfig is passed ', () => {
      const spy = jest.spyOn(pbjs, 'setConfig');
      addUnit('', '', {}, { config: { sample: 'test' } }, {});
      expect(spy).toHaveBeenCalled();
    });

    it('called setConfig  while sizeConfig is passed ', () => {
      const spy = jest.spyOn(pbjs, 'setConfig');
      addUnit('', '', {}, { sizeConfig: { sample: 'test' } }, {});
      expect(spy).toHaveBeenCalled();
    });
  });
