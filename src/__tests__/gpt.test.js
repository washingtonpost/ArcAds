import { ArcAds } from '../index';
import * as gpt from '../services/gpt';
import * as headerbidding from '../services/headerbidding';
import * as sizemap from '../services/sizemapping';

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
        dimensions: '[[300, 250], [300, 600]]',
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
        dimensions: '[[300, 250], [300, 600]]',
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
        dimensions: '[ [[970, 250], [970, 90], [728, 90]], [[728, 90]], [[320, 100], [320, 50]] ]',
        targeting: {
          section: 'weather'
        },
        sizemap: {
          breakpoints: '[ [1280, 0], [800, 0], [0, 0] ]',
          refresh: 'true'
        }
      });
    
      expect(methods.prepareSizeMaps.mock.calls.length).toBe(1);
      expect(methods.setResizeListener.mock.calls.length).toBe(1);
    });
  });
});
