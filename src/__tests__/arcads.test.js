import { ArcAds } from '../index';
import  * as gptService from '../services/gpt.js';
import  * as prebidService from '../services/prebid.js';

describe('arcads', () => {
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
      expect(consoleMock).toHaveBeenCalledWith("ArcAds: DFP id is missing from the arcads initialization script.", '\n',
      "Documentation: https://github.com/wapopartners/arc-ads#getting-started");
    });
  });

  


});
