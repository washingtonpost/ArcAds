import { appendResource } from '../util/resources.js';

describe('appendResource', () => {
  const cbMock = jest.fn();
  const appendChildMock = jest.fn();
  const saveDocument = global.document;

  afterAll(() => {
    delete global.document;
    global.document = saveDocument;
  });

  beforeAll(() => {
    delete global.document;
    global.document = {
      documentElement: {
        appendChild: appendChildMock,
      },
      createElement: jest.fn().mockReturnValue({}),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('if tag is script create tag and append child tag', () => {
    appendResource('script', 'www.test.com', true, true, cbMock);
    expect(appendChildMock).toHaveBeenCalledTimes(1);
    const expectedParams = { async: true, defer: true, src: 'www.test.com' };
    expect(appendChildMock).toHaveBeenCalledWith(expectedParams);
    expect(cbMock).toHaveBeenCalledTimes(1);
  });

  it('if tag is not script do nothing', () => {
    appendResource('div', 'www.test.com', true, true, cbMock);
    expect(appendChildMock).toHaveBeenCalledTimes(0);
    expect(cbMock).toHaveBeenCalledTimes(0);
  });

  it('if no async or defer assume false for those values', () => {
    appendResource('script', 'www.test.com', null, null, cbMock);
    expect(appendChildMock).toHaveBeenCalledTimes(1);
    const expectedParams = { async: false, defer: false, src: 'www.test.com' };
    expect(appendChildMock).toHaveBeenCalledWith(expectedParams);
    expect(cbMock).toHaveBeenCalledTimes(1);
  });
});
