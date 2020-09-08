import { ArcAds } from '../index';
import  * as gptService from '../services/gpt.js';
import  * as prebidService from '../services/prebid.js';


describe('registerAds dimensions branches', () => {
    //pbjs setConfig mock setup
    let setConfigMock = jest.fn();
    global.pbjs = {
    setConfig: () => setConfigMock,
    };

    //queueGoogletagCommand mock
    jest.spyOn(gptService, 'queueGoogletagCommand');

    jest.spyOn(prebidService, 'queuePrebidCommand');

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
    const displayAdBindMock = jest.fn();
    arcAds.displayAd = displayAdMock;
    arcAds.displayAd.bind = displayAdBindMock;
    // jest.spyOn(arcAds, 'displayAd');
    // jest.spyOn(arcAds, 'displayAd.bind');

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it.skip('should should call prebid setConfig if has bidding configs and prebid lib is present', () => {
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

        console.log('displayAd', arcAds.displayAd)
        console.log('displayAdbind', arcAds.displayAd.bind)

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
        const expectedArg2 = {"dimensions": [[[100, 50]]], "id": "testID", "slotname": "testSlotname"};
        expect(displayAdBindMock).toHaveBeenCalledWith(expectedArg1, expectedArg2);
    });

});