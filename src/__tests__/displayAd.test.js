/**
 * @jest-environment jsdom
 */

import { ArcAds } from '../index';
import  * as gptService from '../services/gpt.js';
import * as sizemappingService from '../services/sizemapping.js'
import * as headerBidding from '../services/headerbidding.js';

describe('displayAd ', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const defineOutOfPageSlotMock = jest.fn();
    const defineSlotMock = jest.fn();

    window.googletag= {
        defineOutOfPageSlot: defineOutOfPageSlotMock,
        defineSlot: defineSlotMock, 
        pubads: jest.fn(),
    };
    const refreshSlotSpy = jest.spyOn(gptService, 'refreshSlot');
    const setResizeListenerSpy = jest.spyOn(sizemappingService, 'setResizeListener');
    const fetchBidsSpy = jest.spyOn(headerBidding, 'fetchBids');


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

    it('if does not have dimensions should call defineOutOfPageSlot', () => {
        const adParams = {
            id: "testID",
            slotName: 'testSlotname',
            dimensions: null,
            targeting: null,
            sizemap: {breakpoints:[0, 50]},
            bidding: false,
            prerender: null,
        };
        window.blockArcAdsPrebid = false;
        const result = arcAds.displayAd(adParams);

        expect(result).toEqual(undefined);
        expect(defineOutOfPageSlotMock).toHaveBeenCalledTimes(1);
        expect(defineOutOfPageSlotMock).toHaveBeenCalledWith("/123/testSlotname",  "testID");
        expect(defineSlotMock).toHaveBeenCalledTimes(0);

        expect(refreshSlotSpy).toHaveBeenCalledTimes(1);
        const expectedRefreshSLotParams = {"ad": undefined, "info": {"adDimensions": null, "adId": "testID", "adSlot": "/123/testSlotname", "adUnit": undefined}, "prerender": null};
        expect(refreshSlotSpy).toHaveBeenCalledWith(expectedRefreshSLotParams);
          
    });

    it('if no ad object return false', () => {
        const adParams = {
            id: "testID",
            slotName: 'testSlotname',
            dimensions: [100,40],
            targeting: null,
            sizemap: {breakpoints:[0, 50]},
            bidding: false,
            prerender: null,
        };

        defineOutOfPageSlotMock.mockReturnValue(null);
        window.blockArcAdsPrebid = false;
        const result = arcAds.displayAd(adParams);

        expect(result).toEqual(false);
        expect(defineOutOfPageSlotMock).toHaveBeenCalledTimes(0);
        expect(defineSlotMock).toHaveBeenCalledTimes(1);
        expect(defineSlotMock).toHaveBeenCalledWith( "/123/testSlotname", [100, 40], "testID");

        expect(refreshSlotSpy).toHaveBeenCalledTimes(0);
    });

    it('if sizemap.refresh call resize listener', () => {
        const adParams = {
            id: "testID",
            slotName: 'testSlotname',
            dimensions: [100,40],
            targeting: null,
            sizemap: {breakpoints:[0, 50], refresh: true},
            bidding: false,
            prerender: null,
        };

        window.blockArcAdsPrebid = true;

        const defineSizeMappingMock = jest.fn();
        defineSlotMock.mockReturnValue({
            defineSizeMapping: defineSizeMappingMock,
            addService: jest.fn()
        });
        const result = arcAds.displayAd(adParams);

        expect(result).toEqual(undefined);
        expect(defineOutOfPageSlotMock).toHaveBeenCalledTimes(0);

        expect(defineSlotMock).toHaveBeenCalledTimes(1);
        expect(defineSlotMock).toHaveBeenCalledWith( "/123/testSlotname", [100, 40], "testID");
 
        expect(refreshSlotSpy).toHaveBeenCalledTimes(0);

        expect(defineSizeMappingMock).toHaveBeenCalledTimes(1);
        expect(defineSizeMappingMock).toHaveBeenCalledWith([[0, 100], [50, 40]]);

        expect(setResizeListenerSpy).toHaveBeenCalledTimes(1);

        expect(setResizeListenerSpy.mock.calls[0][0]).toEqual(
            expect.objectContaining({
            "bidding": false, 
            "breakpoints": [undefined], 
            "correlators": [false], 
            "id": "testID", 
            "mapping": [[0, 100], [50, 40]], 
            "prerender": null, 
            "slotName": "/123/testSlotname", 
            "wrapper": {"amazon": {"enabled": true, "id": "123"}, "prebid": {"enabled": true}}}
        )
        );
    });

    it('if no sizemap.refresh, do NOT call resize listener', () => {
        const adParams = {
            id: "testID",
            slotName: 'testSlotname',
            dimensions: [100,40],
            targeting: null,
            sizemap: {breakpoints:[0, 50], refresh: false},
            bidding: false,
            prerender: null,
        };

        window.blockArcAdsPrebid = true;

        const defineSizeMappingMock = jest.fn();
        defineSlotMock.mockReturnValue({
            defineSizeMapping: defineSizeMappingMock,
            addService: jest.fn()
        });
        arcAds.displayAd(adParams);
        expect(setResizeListenerSpy).toHaveBeenCalledTimes(0);
    });

    it('if has adsList and ad push ad to adsList', () => {
        const adParams = {
            id: "testID",
            slotName: 'testSlotname',
            dimensions: [100,40],
            targeting: null,
            sizemap: {breakpoints:[0, 50], refresh: false},
            bidding: false,
            prerender: null,
        };

        window.blockArcAdsPrebid = true;
        window.adsList = [];

        const defineSizeMappingMock = jest.fn();
        defineSlotMock.mockReturnValue({
            defineSizeMapping: defineSizeMappingMock,
            addService: jest.fn()
        });
        arcAds.displayAd(adParams);
        expect(window.adsList.length).toEqual(1);
    });

    it('if has bidding.prebid.enabled call fetchBids', () => {
        const adParams = {
            id: "testID",
            slotName: 'testSlotname',
            dimensions: [100,40],
            targeting: null,
            sizemap: {breakpoints:[0, 50], refresh: false},
            bidding: {prebid: {enabled: true}},
            prerender: null,
        };

        window.blockArcAdsPrebid = false;
        arcAds.displayAd(adParams);

        expect(refreshSlotSpy).toHaveBeenCalledTimes(0);
        expect(fetchBidsSpy).toHaveBeenCalledTimes(1);
    });

    it('handles non-null dimnsions length 0 case', () => {
        const adParams = {
            id: "testID",
            slotName: 'testSlotname',
            dimensions: [],
            targeting: null,
            sizemap: {breakpoints:[0, 50], refresh: false},
            bidding: {prebid: {enabled: true}},
            prerender: null,
        };

        const defineSizeMappingMock = jest.fn();
        defineSlotMock.mockReturnValue({
            defineSizeMapping: defineSizeMappingMock,
            addService: jest.fn()
        });

        const result = arcAds.displayAd(adParams);

        expect(result).toEqual(undefined);
        expect(defineOutOfPageSlotMock).toHaveBeenCalledTimes(0);

        expect(defineSlotMock).toHaveBeenCalledTimes(1);
        expect(defineSlotMock).toHaveBeenCalledWith( "/123/testSlotname", null, "testID");
 
        expect(refreshSlotSpy).toHaveBeenCalledTimes(0);

        expect(defineSizeMappingMock).toHaveBeenCalledTimes(1);
        expect(defineSizeMappingMock).toHaveBeenCalledWith([]);

        expect(setResizeListenerSpy).toHaveBeenCalledTimes(0);

    });

});
