import { ArcAds } from '../index';
import  * as gptService from '../services/gpt.js';
import  * as prebidService from '../services/prebid.js';
import * as  mobileDetection from '../util/mobile.js';
import * as sizemappingService from '../services/sizemapping.js'

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

});