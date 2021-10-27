import { ArcAds } from '../index';
import * as gptService from '../services/gpt.js';
import * as prebidService from '../services/prebid.js';

describe('arcads', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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

  let registerAdCollectionSingleCallMock;

  describe('constructor', () => {
    it('should initialize arc ads', () => {
      expect(arcAds).not.toBeUndefined();
    });

    it('should initialize googletag', () => {
      const { googletag } = global;
      expect(googletag).toBeDefined();
    });

    it('should initialize header bidding serivces', () => {
      const { arcBiddingReady } = global;
      expect(arcBiddingReady).toBeDefined();
    });

    it('should console warn if no dfpID provided', () => {
      const consoleMock = jest.fn();
      console.warn = consoleMock;
      const arcAds = new ArcAds({
        dfp: {
        }
      });

      expect(consoleMock).toHaveBeenCalledTimes(1);
      expect(consoleMock).toHaveBeenCalledWith(
        'ArcAds: DFP id is missing from the arcads initialization script.', '\n',
        'Documentation: https://github.com/washingtonpost/arcads#getting-started'
      );
    });
  });

  describe('registerAdCollection', () => {
    it('calls registerAd for each advert in the collection param', () => {
      const registerAdMock = jest.fn();
      arcAds.registerAd = registerAdMock;

      const adCollection = ['ad1', 'ad2'];
      arcAds.registerAdCollection(adCollection);

      expect(registerAdMock).toHaveBeenCalledTimes(2);
    });
  });

  describe('registerAdCollectionSingleCall', () => {
    it('calls registerAd, requestBids, refresh', () => {
      const registerAdMock = jest.fn();
      arcAds.registerAd = registerAdMock;

      const refreshMock = jest.fn();
      window.googletag.pubads = jest.fn().mockReturnValue({ refresh: refreshMock });

      const requestBidsMock = jest.fn();
      global.pbjs = { requestBids: requestBidsMock };

      const adCollection = ['ad1', 'ad2'];

      arcAds.registerAdCollectionSingleCall(adCollection);


      expect(registerAdMock).toHaveBeenCalledTimes(2);
      expect(refreshMock).toHaveBeenCalledTimes(0);
      expect(requestBidsMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('setAdsBlockGate', () => {
    it('sets blockArcAdsLoad to true if has window', () => {
      ArcAds.setAdsBlockGate();
      expect(window.blockArcAdsLoad).toEqual(true);
    });

    it('does nothing if no window', () => {
      const saveGetWindow = ArcAds.getWindow;
      const getWindowMock = jest.fn().mockReturnValue(undefined);
      ArcAds.getWindow = getWindowMock;

      ArcAds.setAdsBlockGate();
      expect(getWindowMock()).toEqual(undefined);
      ArcAds.getWindow = saveGetWindow;
    });
  });

  describe('releaseAdsBlockGate', () => {
    it('sets blockArcAdsLoad to false if has window', () => {
      ArcAds.releaseAdsBlockGate();
      expect(window.blockArcAdsLoad).toEqual(false);
    });

    it('does nothing if no window', () => {
      const getWindowMock = jest.fn().mockReturnValue(undefined);
      ArcAds.getWindow = getWindowMock;

      ArcAds.releaseAdsBlockGate();
      expect(getWindowMock()).toEqual(undefined);
      getWindowMock.mockRestore();
    });
  });

  describe('sendSingleCallAds', () => {
    beforeAll(() => {
      registerAdCollectionSingleCallMock = jest.fn();
      arcAds.registerAdCollectionSingleCall = registerAdCollectionSingleCallMock;
    });

    it('if has  nothing in adsList return', () => {
      arcAds.adsList = [];
      const result = arcAds.sendSingleCallAds();
      expect(result).toEqual(false);
    });

    it('if has adsList elems and pubads do SRA call', () => {
      arcAds.adsList = ['ad1', 'ad2'];
      window.googletag.pubadsReady = true;
      window.googletag.pubads = jest.fn().mockReturnValue({
        disableInitialLoad: jest.fn(),
        enableSingleRequest: jest.fn(),
        enableAsyncRendering: jest.fn(),
      });

      arcAds.sendSingleCallAds();
      expect(registerAdCollectionSingleCallMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('reserveAd', () => {
    it('sets block and adds ad to adsList', () => {
      const gateSetSpy = jest.spyOn(ArcAds, 'setAdsBlockGate');
      arcAds.adsList = [];
      arcAds.reserveAd({ example: true });
      expect(gateSetSpy).toHaveBeenCalledTimes(1);
      expect(arcAds.adsList.length).toEqual(1);
    });
  });

  describe('setPageLeveTargeting', () => {
    it('sets block and adds ad to adsList', () => {
      const setTargetingMock = jest.fn();

      window.googletag.pubads = jest.fn().mockReturnValue({
        setTargeting: setTargetingMock,
      });

      arcAds.setPageLeveTargeting('testKey', 'testValue');
      expect(setTargetingMock).toHaveBeenCalledTimes(1);
      expect(setTargetingMock).toHaveBeenCalledWith('testKey', 'testValue');
    });
  });
});
