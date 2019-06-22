import { ArcAds } from '../index';
import * as prebid from '../services/prebid';

describe('arcads', () => {
  const methods = {
    addUnit: jest.spyOn(prebid, 'addUnit'),
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

  global.pbjs = {
    addAdUnits: (slot) => { global.slot = slot; },
    setConfig: () => global.pbjs,
    setTargetingForGPTAsync: () => global.pbjs,
    requestBids: () => global.pbjs,
    que: []
  };

  describe('prebid', () => {
    it('should push a function to the pbjs queue', () => {
      const fn = () => 'montezuma';
      prebid.queuePrebidCommand(fn);

      expect(global.pbjs.que.length).toBe(1);
      expect(global.pbjs.que[0]).toBe(fn);
    });

    it('should use dimensions for sizes by default', () => {
      arcAds.registerAd({
        id: 'div-id-123',
        slotName: 'hp/hp-1',
        adType: 'cube',
        dimensions: [[300, 250], [300, 600]],
        display: 'all',
        targeting: {
          section: 'weather'
        },
        bidding: {
          prebid: {
            enabled: true,
            bids: [{
              bidder: 'appnexus',
              labels: ['desktop', 'tablet', 'phone'],
              params: {
                placementId: '10433394'
              }
            }]
          }
        }
      });
      expect(methods.addUnit.mock.calls.length).toBe(1);
      expect(global.slot.mediaTypes.banner.sizes).toEqual([[300, 250], [300, 600]]);
    });

    it('should use mediaTypes for sizes if defined', () => {
      arcAds.registerAd({
        id: 'div-id-123',
        slotName: 'hp/hp-1',
        adType: 'cube',
        dimensions: [[300, 250], [300, 600]],
        display: 'all',
        targeting: {
          section: 'weather'
        },
        bidding: {
          prebid: {
            enabled: true,
            mediaTypes: {
              banner: {
                sizes: [980, 300]
              }
            },
            bids: [{
              bidder: 'appnexus',
              labels: ['desktop', 'tablet', 'phone'],
              params: {
                placementId: '10433394'
              }
            }]
          }
        }
      });
      expect(methods.addUnit.mock.calls.length).toBe(2);
      expect(global.slot.mediaTypes.banner.sizes).toEqual([980, 300]);
    });
  });
});
