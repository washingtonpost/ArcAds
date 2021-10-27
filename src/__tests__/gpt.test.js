import { ArcAds } from '../index';
import * as gpt from '../services/gpt';
import * as headerbidding from '../services/headerbidding';
import * as sizemap from '../services/sizemapping';
import * as queryUtil from '../util/query';

describe('arcads', () => {
  const methods = {
    queueGoogletagCommand: jest.spyOn(gpt, 'queueGoogletagCommand'),
    setTargeting: jest.spyOn(gpt, 'setTargeting'),
    refreshSlot: jest.spyOn(gpt, 'refreshSlot'),
    fetchBids: jest.spyOn(headerbidding, 'fetchBids'),
    prepareSizeMaps: jest.spyOn(sizemap, 'prepareSizeMaps'),
    setResizeListener: jest.spyOn(sizemap, 'setResizeListener')
  };

  const arcAds = new ArcAds({
    dfp: {
      id: '123'
    },
    bidding: {
      amazon: {
        enabled: true,
        id: '123'
      },
      prebid: {
        enabled: true
      }
    }
  });

  global.googletag = {
    defineSlot: () => global.googletag,
    defineOutOfPageSlot: () => global.googletag,
    defineSizeMapping: () => global.googletag,
    addService: () => global.googletag,
    setTargeting: () => global.googletag,
    pubads: () => global.googletag,
    refresh: () => global.googletag,
    cmd: []
  };

  describe('google publisher tag', () => {
    it('should push a function to the gpt queue', () => {
      const fn = () => 'montezuma';
      gpt.queueGoogletagCommand(fn);

      expect(global.googletag.cmd.length).toBe(1);
      expect(global.googletag.cmd[0]).toBe(fn);
    });

    it('should display a regular advertisement', () => {
      arcAds.displayAd({
        id: 'div-id-123',
        slotName: 'hp/hp-1',
        adType: 'cube',
        dimensions: [[300, 250], [300, 600]],
        display: 'all',
        targeting: {
          section: 'weather'
        }
      });

      expect(methods.setTargeting.mock.calls.length).toBe(1);
      expect(methods.refreshSlot.mock.calls.length).toBe(1);
    });

    it('should display a header bidding enabled advertisement', () => {
      arcAds.displayAd({
        id: 'div-id-123',
        slotName: 'hp/hp-1',
        adType: 'cube',
        dimensions: [[300, 250], [300, 600]],
        display: 'all',
        targeting: {
          section: 'weather'
        },
        bidding: {
          amazon: {
            enabled: true
          }
        }
      });

      expect(methods.setTargeting.mock.calls.length).toBe(2);
      expect(methods.fetchBids.mock.calls.length).toBe(1);
    });

    it('should display a size mapped advertisement', () => {
      arcAds.displayAd({
        id: 'div-id-123',
        slotName: 'hp/hp-1',
        adType: 'cube',
        dimensions: [[[970, 250], [970, 90], [728, 90]], [[728, 90]], [[320, 100], [320, 50]]],
        targeting: {
          section: 'weather'
        },
        sizemap: {
          breakpoints: [[1280, 0], [800, 0], [0, 0]],
          refresh: 'true'
        }
      });

      expect(methods.prepareSizeMaps.mock.calls.length).toBe(1);
      expect(methods.setResizeListener.mock.calls.length).toBe(1);
    });
  });

  it('if has prerender that resolves call refresh', () => {
    window.googletag.pubadsReady = true;
    const prerenderFnc = jest.fn();
    gpt.refreshSlot({ ad: { name: 'ad' }, correlator: false, prerender: prerenderFnc, info: {} });
    expect(prerenderFnc).toHaveBeenCalledTimes(1);
  });

  it('if blockarcAds load is set do not call pubads refresh', () => {
    window.googletag.pubadsReady = true;
    window.blockArcAdsLoad = true;
    const prerenderFnc = jest.fn();

    const refreshMock = jest.fn();
    global.googletag.pubads = jest.fn().mockReturnValue({
      refresh: refreshMock,
    });
    gpt.refreshSlot({ ad: { name: 'ad' }, correlator: false, prerender: prerenderFnc, info: {} });
    expect(refreshMock).toHaveBeenCalledTimes(0);
  });

  describe('setTargeting', () => {
    it('if options has key and value call ad SetTargeting', () => {
      const setTargetingMock = jest.fn();
      const ad = { setTargeting: setTargetingMock };
      gpt.setTargeting(ad, { testKey: 'testValue' });
      expect(setTargetingMock).toHaveBeenCalledTimes(1);
      expect(setTargetingMock).toHaveBeenCalledWith('testKey', 'testValue');
    });

    it('if options has NOT key and value call ad SetTargeting', () => {
      const setTargetingMock = jest.fn();
      const ad = { setTargeting: setTargetingMock };
      gpt.setTargeting(ad, { testKey: null });
      expect(setTargetingMock).toHaveBeenCalledTimes(0);
    });
  });

  describe('dfpSettings', () => {
    const disableInitialLoadMock = jest.fn();
    const enableSingleRequestMock = jest.fn();
    const enableAsyncRenderingMock = jest.fn();
    const enableServicesMock = jest.fn();
    const collapseEmptyDivsMock = jest.fn();
    const addEventListenerMock = jest.fn();

    beforeAll(() => {
      global.googletag.pubads = jest.fn().mockReturnValue({
        disableInitialLoad: disableInitialLoadMock,
        enableSingleRequest: enableSingleRequestMock,
        enableAsyncRendering: enableAsyncRenderingMock,
        collapseEmptyDivs: collapseEmptyDivsMock,
        addEventListener: addEventListenerMock,
      });

      global.googletag.enableServices = enableServicesMock;
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('call non-logic dependent pubads setup functions', () => {
      gpt.dfpSettings();
      expect(disableInitialLoadMock).toHaveBeenCalledTimes(1);
      expect(enableSingleRequestMock).toHaveBeenCalledTimes(1);
      expect(enableAsyncRenderingMock).toHaveBeenCalledTimes(1);
      expect(enableServicesMock).toHaveBeenCalledTimes(1);
      expect(enableAsyncRenderingMock).toHaveBeenCalledTimes(1);
      expect(collapseEmptyDivsMock).toHaveBeenCalledTimes(0);
      expect(addEventListenerMock).toHaveBeenCalledTimes(0);
    });

    it('if  handleSlotRenderEnded function calls addEventListener', () => {
      const handleMock = jest.fn();
      gpt.dfpSettings(handleMock);
      expect(disableInitialLoadMock).toHaveBeenCalledTimes(1);
      expect(enableSingleRequestMock).toHaveBeenCalledTimes(1);
      expect(enableAsyncRenderingMock).toHaveBeenCalledTimes(1);
      expect(enableServicesMock).toHaveBeenCalledTimes(1);
      expect(enableAsyncRenderingMock).toHaveBeenCalledTimes(1);
      expect(addEventListenerMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('determineSlotName', () => {
    it('return slotname based on dfpCode and slotname args', () => {
      const result = gpt.determineSlotName('dfpCode', 'testSlotname');
      expect(result).toEqual('/dfpCode/testSlotname');
    });

    it('ifAdsSlot override then use that value for slotaName', () => {
      jest.spyOn(queryUtil, 'expandQueryString').mockReturnValue('overrideSlotname');
      const result = gpt.determineSlotName('dfpCode', 'testSlotname');
      expect(result).toEqual('/dfpCode/overrideSlotname');
    });
  });
});
