import {
  fetchAmazonBids,
  queueAmazonCommand,
} from '../services/amazon';

describe('amazon service', () => {
  beforeEach(() => {
    global.amazonTest = {
      cmd: () => jest.fn().mockName('cmd'),
      queueAmazonCommand: () => jest.fn().mockName('queueAmazonCommand'),
    };
  });

  afterEach(() => {
    window.apstag = false;
    jest.restoreAllMocks();
  });

  it('fetchAmazonBids', () => {
    window.innerWidth = '1280';
    window.apstag = {
      fetchBids: () => jest.fn(),
    };
    const mockSpy = jest.spyOn(window.apstag, 'fetchBids');
    fetchAmazonBids(
      'id', 'slotname',
      [
        [[728, 90], 90],
        [728, 90],
        [468, 60]
      ], [[728, 90], 1080]
    );
    expect(mockSpy).toHaveBeenCalled();
  });

  it('call passed in function in queueAmazonCommand', () => {
    window.apstag = true;
    const spy = jest.spyOn(amazonTest, 'cmd');
    queueAmazonCommand(global.amazonTest.cmd);
    expect(spy).toHaveBeenCalled();
  });
});