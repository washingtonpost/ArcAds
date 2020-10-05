import {
    initializeBiddingServices
  } from '../services/headerbidding';

  describe('initializeBiddingServices', function () {
    afterEach(() => {
      window.apstag = false;
      window.arcBiddingReady = true;
      jest.restoreAllMocks();
    });

    it('return while window.arcBiddingReady is already set in initializeBiddingServices', () => {
      Object.defineProperty(window, 'arcBiddingReady', {
        writable: true,
        value: true,
      });
      const mockSetting = {
        prebid: false,
        amazon: false,
      };
      const result = initializeBiddingServices(mockSetting);
      expect(result).toEqual(undefined);
    });

    it('set arcBiddingReady to false while no prebid or amazon were set in initializeBiddingServices', () => {
      Object.defineProperty(window, 'arcBiddingReady', {
        writable: true,
        value: false,
      });
      const mockSetting = {
        prebid: false,
        amazon: false,
      };
      initializeBiddingServices(mockSetting);
      expect(window.arcBiddingReady).toEqual(false);
    });

    it('enable prebid ', () => {
      Object.defineProperty(window, 'arcBiddingReady', {
        writable: true,
        value: false,
      });
      Object.defineProperty(window, 'apstag', {
        writable: true,
        value: true,
      });

      const mockSetting = {
        prebid: {
          enabled: true,
        },
        amazon: {
          enabled: false,
        }
      };

      initializeBiddingServices(mockSetting);
      expect(window.arcBiddingReady).toEqual(false);
    });

    it('arcBiddingReady set to false while no pbjs available', () => {
      global.pbjs = undefined;
      const mockSetting = {
        prebid: {
          enabled: true,
        },
      };
      initializeBiddingServices(mockSetting);
      setTimeout(() => {
        expect(window.arcBiddingReady).toEqual(false);
      }, 2000);
    });

    it('enable Amazon ', () => {
      Object.defineProperty(window, 'arcBiddingReady', {
        writable: true,
        value: false,
      });
      Object.defineProperty(window, 'apstag', {
        writable: true,
        value: true,
      });
      const mockSetting = {
        prebid: false,
        amazon: {
          enabled: true,
          id: 'mock-id'
        },
      };
      initializeBiddingServices(mockSetting);
      setTimeout(() => {
        expect(window.arcBiddingReady).toEqual(false);
      }, 2000);
    });

    it('enable Amazon without id ', () => {
      Object.defineProperty(window, 'arcBiddingReady', {
        writable: true,
        value: false,
      });
      Object.defineProperty(window, 'apstag', {
        writable: true,
        value: true,
      });
      const mockSetting = {
        prebid: false,
        amazon: {
          enabled: true,
          id: ''
        },
      };
      initializeBiddingServices(mockSetting);

      setTimeout(() => {
        expect(window.arcBiddingReady).toEqual(false);
      }, 2000);
    });
  });