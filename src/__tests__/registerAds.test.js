import { ArcAds } from '../index';
import  * as gptService from '../services/gpt.js';
import  * as prebidService from '../services/prebid.js';
import * as  mobileDetection from '../util/mobile.js';


describe('registerAds dimensions branches', () => {

    global.pbjs = {
        que: [],
        addAdUnits: () => jest.fn().mockName('addAdUnits'),
        requestBids: () => jest.fn().mockName('requestBids'),
        setConfig: () => jest.fn().mockName('setConfig'),
        setTargetingForGPTAsync: jest.fn().mockName('setTargetingForGPTAsync'),
      };

    const setConfigSpy = jest.spyOn(pbjs, 'setConfig');

    //queueGoogletagCommand mock
    jest.spyOn(gptService, 'queueGoogletagCommand');
   // jest.spyOn(prebidService, 'queuePrebidCommand');
    const queuePrebidCommandMock = jest.fn();
        const queuePrebidCommandBindMock = jest.fn();
        prebidService.queuePrebidCommand = queuePrebidCommandBindMock;
        prebidService.queuePrebidCommand.bind = queuePrebidCommandBindMock;

    //   prebidService.queuePrebidCommand.bind = queuePrebidCommandBindMock;
    const addUnitMock = jest.fn();
    prebidService.addUnit = addUnitMock;

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

    //displayAd mock
    const displayAdMock = jest.fn();
    const displayAdBindMock = jest.fn().mockReturnValue(jest.fn());
    arcAds.displayAd = displayAdMock;
    arcAds.displayAd.bind = displayAdBindMock;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should should call prebid setConfig if has bidding configs and prebid lib is present', () => {
      //ArcAds obj
        const adParams = {
            id: "testID",
            slotname: "testSlotname",
            dimensions: [[300, 50], [300, 250]]
        }

        arcAds.registerAd(adParams);

        expect(gptService.queueGoogletagCommand).toHaveBeenCalledTimes(1);
        expect(prebidService.queuePrebidCommand).toHaveBeenCalledTimes(0);

    });

    it('should add single level dimensions appropriately', () => {
        const adParams = {
            id: "testID",
            slotname: "testSlotname",
            dimensions: [300, 50],
        }
        arcAds.registerAd(adParams);

        expect(arcAds.displayAd.bind).toHaveBeenCalledTimes(1);

        const expectedArg1 = {"adsList": [],
            "collapseEmptyDivs": undefined,
            "dfpId": "123",
            "displayAd": displayAdMock,
            "positions": [],
            "wrapper": {"amazon": {"enabled": true, "id": "123"},
            "prebid": {"enabled": true}}
        };
        const expectedArg2 = {"dimensions": [300, 50], "id": "testID", "slotname": "testSlotname"};

        expect(displayAdBindMock).toHaveBeenCalledWith(expectedArg1, expectedArg2);

    });

    it('should add two level dimensions appropriately', () => {

        const adParams = {
            id: "testID",
            slotname: "testSlotname",
            dimensions: [[300, 50], [250, 100]],
        }

        arcAds.registerAd(adParams);

        expect(displayAdBindMock).toHaveBeenCalledTimes(1);

        const expectedArg1 = {"adsList": [],
            "collapseEmptyDivs": undefined,
            "dfpId": "123",
            "displayAd": displayAdMock,
            "positions": [],
            "wrapper": {"amazon": {"enabled": true, "id": "123"},
            "prebid": {"enabled": true}}
        };
        const expectedArg2 = {"dimensions": [[300, 50], [250, 100]], "id": "testID", "slotname": "testSlotname"};
        expect(displayAdBindMock).toHaveBeenCalledWith(expectedArg1, expectedArg2);

    });

    it('should add no dimensions appropriately', () => {
        const adParams = {
            id: "testID",
            slotname: "testSlotname",
            dimensions: undefined,
        }
        arcAds.registerAd(adParams);

        expect(displayAdBindMock).toHaveBeenCalledTimes(1);

        const expectedArg1 = {"adsList": [],
            "collapseEmptyDivs": undefined,
            "dfpId": "123",
            "displayAd": displayAdMock,
            "positions": [],
            "wrapper": {"amazon": {"enabled": true, "id": "123"},
            "prebid": {"enabled": true}}};
        const expectedArg2 = {"dimensions": undefined, "id": "testID", "slotname": "testSlotname"};
        expect(displayAdBindMock).toHaveBeenCalledWith(expectedArg1, expectedArg2);
    });

    it('should add non 1 or 2 level dimensions appropriately', () => {
        const adParams = {
            id: "testID",
            slotname: "testSlotname",
            dimensions: [[[100,50]]],
            targeting:{},
            adType: true,
            display: 'mobile',
            bidding:{prebid:{bids:['bid1']}}
        }

        const mobileAny = jest.fn().mockReturnValue(true);
        global.isMobile = {any: mobileAny};
    
        arcAds.registerAd(adParams);
        
        expect(setConfigSpy).toHaveBeenCalledTimes(1);
        expect(setConfigSpy.mock.calls[0][0]).toEqual(
            expect.objectContaining({
                "userSync": {
                    "filterSettings": {
                        "iframe": {
                            "bidders": ["openx"], "filter": "include"}
                        }, 
                    "iframeEnabled": true
                    }
            })
        );

        expect(displayAdBindMock).toHaveBeenCalledTimes(1);
        const expectedArg2 = {
            "adType": true,
            "bidding": {"prebid": {"bids": ["bid1"]}},
            "dimensions": [[[100, 50]]],
            "display": "mobile",
            "id": "testID",
            "slotname": "testSlotname",
            "targeting": {"position": 1}
        };
        expect(displayAdBindMock.mock.calls[0][1]).toEqual( expectedArg2);
    });

    it('wrapper has useSlotForAdUnit for caclulating prebid code', () => {
        arcAds.wrapper = { 
                amazon: {
                enabled: true,
                id: '123'
                },
                prebid: {
                enabled: true,
                useSlotForAdUnit: true,
                }
        };
        const adParams = {
            id: "testID",
            slotname: "testSlotname",
            dimensions: [[[100,50]]],
            targeting:{},
            adType: true,
            display: 'mobile',
            bidding:{prebid:{bids:['bid1']}}
        }

        const mobileAny = jest.fn().mockReturnValue(true);
        global.isMobile = {any: mobileAny};
    
        arcAds.registerAd(adParams);

        expect(addUnitMock).toHaveBeenCalledTimes(1);
        expect(addUnitMock.mock.calls[0][0]).toEqual("/123/undefined");

        expect(queuePrebidCommandBindMock).toHaveBeenCalledTimes(1);
    });

    it('handles no display case', () => {
        arcAds.wrapper = { 
                amazon: {
                enabled: true,
                id: '123'
                },
                prebid: {
                enabled: true,
                useSlotForAdUnit: true,
                }
        };
        const adParams = {
            id: "testID",
            slotname: "testSlotname",
            dimensions: [[[100,50]]],
            targeting:{},
            adType: true,
            display: 'other',
            bidding:{prebid:{bids:['bid1']}}
        }

        const mobileAny = jest.fn().mockReturnValue(true);
        global.isMobile = {any: mobileAny};
    
        arcAds.registerAd(adParams);

        expect(queuePrebidCommandBindMock).toHaveBeenCalledTimes(0);
        expect(displayAdBindMock).toHaveBeenCalledTimes(0);
    });

    it('handles iframeBidders case', () => {
        arcAds.wrapper = { 
                amazon: {
                enabled: true,
                id: '123'
                },
                prebid: {
                enabled: true,
                useSlotForAdUnit: true,
                }
        };
        const adParams = {
            id: "testID",
            slotname: "testSlotname",
            dimensions: [[[100,50]]],
            targeting:{},
            adType: true,
            display: 'all',
            bidding:{prebid:{bids:['bid1']}},
            iframeBidders:[],
        }

        const mobileAny = jest.fn().mockReturnValue(true);
        global.isMobile = {any: mobileAny};
    
        arcAds.registerAd(adParams);

        expect(setConfigSpy).toHaveBeenCalledTimes(0);
    });

    it('if no processDisplayAd do not call queueGoogletagCommand' , () => {
        arcAds.wrapper = { 
                amazon: {
                enabled: true,
                id: '123'
                },
                prebid: {
                enabled: true,
                useSlotForAdUnit: true,
                }
        };
        const adParams = {
            id: "testID",
            slotname: "testSlotname",
            dimensions: [[[100,50]]],
            targeting:{},
            adType: true,
            display: 'all',
            bidding:{prebid:{bids:['bid1']}},
            iframeBidders:[],
        }
        arcAds.displayAd.bind = jest.fn().mockReturnValue(null);

        arcAds.registerAd(adParams);

        expect(gptService.queueGoogletagCommand).toHaveBeenCalledTimes(0);
    });

    it('if try error write console error' , () => {
        arcAds.wrapper = { 
                amazon: {
                enabled: true,
                id: '123'
                },
                prebid: {
                enabled: true,
                useSlotForAdUnit: true,
                }
        };
        const adParams = {
            id: "testID",
            slotname: "testSlotname",
            dimensions: [[[100,50]]],
            targeting:{},
            adType: true,
            display: 'all',
            bidding:{prebid:{bids:['bid1']}},
            iframeBidders:[],
        }
        arcAds.displayAd.bind.mockImplementation(() => {
            throw new Error('test error msg');
        });

        const errorMock = jest.fn();
        console.error = errorMock;

        arcAds.registerAd(adParams);

        expect(errorMock).toHaveBeenCalledTimes(1);
        expect(errorMock.mock.calls[0][0]).toEqual('ads error');
    });

});