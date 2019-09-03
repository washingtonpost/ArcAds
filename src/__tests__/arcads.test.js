import { ArcAds } from '../index';

describe('arcads', () => {
  const arcAds = new ArcAds({
    dfp: {
      id: '123',
    },
    bidding: {
      amazon: {
        enabled: true,
        id: '123',
      },
      prebid: {
        enabled: true,
      },
    },
  });

  describe('#constructor', () => {
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
  });
});
