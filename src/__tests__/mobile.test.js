
import { MobileDetection } from '../util/mobile.js';

describe('MobileDetection', () => {
  afterAll(() => {
    window.__defineGetter__('navigator', function () {
      return {};
    });

    window.navigator.__defineGetter__('userAgent', function () {
      return null;
    });

    window.__defineGetter__('retina', function () {
      return false;
    });

    window.__defineGetter__('devicePixelRatio', function () {
      return 0;
    });
  });

  describe('Android()', () => {
    it('returns true if user agent contains Android', () => {
      window.navigator.__defineGetter__('userAgent', function () {
        return 'Android';
      });

      const result = MobileDetection.Android();
      expect(result).toEqual(true);
    });

    it('returns false if user agent does not contains Android', () => {
      window.navigator.__defineGetter__('userAgent', function () {
        return 'that which shall not be named';
      });

      const result = MobileDetection.Android();
      expect(result).toEqual(false);
    });
  });

  describe('AndroidOld()', () => {
    it('returns true if user agent contains Android 2.3.3', () => {
      window.navigator.__defineGetter__('userAgent', function () {
        return 'Android 2.3.3';
      });

      const result = MobileDetection.AndroidOld();
      expect(result).toEqual(true);
    });

    it('returns false if user agent does not contain Android 2.3.3', () => {
      window.navigator.__defineGetter__('userAgent', function () {
        return 'that which shall not be named';
      });

      const result = MobileDetection.AndroidOld();
      expect(result).toEqual(false);
    });
  });

  describe('AndroidTablet()', () => {
    it('returns true if user agent contains Android Mobile', () => {
      window.navigator.__defineGetter__('userAgent', function () {
        return 'Android';
      });

      const result = MobileDetection.AndroidTablet();
      expect(result).toEqual(true);
    });

    it('returns false if user agent does not contain Android Mobile', () => {
      window.navigator.__defineGetter__('userAgent', function () {
        return 'that which shall not be named';
      });

      const result = MobileDetection.AndroidTablet();
      expect(result).toEqual(false);
    });
  });

  describe('Kindle()', () => {
    it('returns true if user agent contains Kindle', () => {
      window.navigator.__defineGetter__('userAgent', function () {
        return 'Kindle';
      });

      const result = MobileDetection.Kindle();
      expect(result).toEqual(true);
    });

    it('returns false if user agent does not contain Kindle', () => {
      window.navigator.__defineGetter__('userAgent', function () {
        return 'that which shall not be named';
      });

      const result = MobileDetection.Kindle();
      expect(result).toEqual(false);
    });
  });

  describe('KindleFire()', () => {
    it('returns true if user agent contains KFOT', () => {
      window.navigator.__defineGetter__('userAgent', function () {
        return 'KFOT';
      });

      const result = MobileDetection.KindleFire();
      expect(result).toEqual(true);
    });

    it('returns false if user agent does not contain Kindle', () => {
      window.navigator.__defineGetter__('userAgent', function () {
        return 'that which shall not be named';
      });

      const result = MobileDetection.KindleFire();
      expect(result).toEqual(false);
    });
  });


  describe('Silk()', () => {
    it('returns true if user agent contains Silk', () => {
      window.navigator.__defineGetter__('userAgent', function () {
        return 'Silk';
      });

      const result = MobileDetection.Silk();
      expect(result).toEqual(true);
    });

    it('returns false if user agent does not contain Silk', () => {
      window.navigator.__defineGetter__('userAgent', function () {
        return 'that which shall not be named';
      });

      const result = MobileDetection.Silk();
      expect(result).toEqual(false);
    });
  });

  describe('BlackBerry()', () => {
    it('returns true if user agent contains BlackBerry', () => {
      window.navigator.__defineGetter__('userAgent', function () {
        return 'BlackBerry';
      });

      const result = MobileDetection.BlackBerry();
      expect(result).toEqual(true);
    });

    it('returns false if user agent does not contain BlackBerry', () => {
      window.navigator.__defineGetter__('userAgent', function () {
        return 'that which shall not be named';
      });

      const result = MobileDetection.BlackBerry();
      expect(result).toEqual(false);
    });
  });

  describe('iOS()', () => {
    it('returns true if user agent contains iPhone', () => {
      window.navigator.__defineGetter__('userAgent', function () {
        return 'iPhone';
      });

      const result = MobileDetection.iOS();
      expect(result).toEqual(true);
    });

    it('returns true if user agent contains iPad', () => {
      window.navigator.__defineGetter__('userAgent', function () {
        return 'iPad';
      });

      const result = MobileDetection.iOS();
      expect(result).toEqual(true);
    });

    it('returns true if user agent contains iPod', () => {
      window.navigator.__defineGetter__('userAgent', function () {
        return 'iPod';
      });

      const result = MobileDetection.iOS();
      expect(result).toEqual(true);
    });

    it('returns false if user agent does not contain iPhone/iPad/iPod', () => {
      window.navigator.__defineGetter__('userAgent', function () {
        return 'that which shall not be named';
      });

      const result = MobileDetection.iOS();
      expect(result).toEqual(false);
    });
  });

  describe('iPhone()', () => {
    it('returns true if user agent contains iPhone', () => {
      window.navigator.__defineGetter__('userAgent', function () {
        return 'iPhone';
      });

      const result = MobileDetection.iPhone();
      expect(result).toEqual(true);
    });


    it('returns true if user agent contains iPod', () => {
      window.navigator.__defineGetter__('userAgent', function () {
        return 'iPod';
      });

      const result = MobileDetection.iPhone();
      expect(result).toEqual(true);
    });

    it('returns false if user agent does not contain iPhone/iPad/iPod', () => {
      window.navigator.__defineGetter__('userAgent', function () {
        return 'iPad';
      });

      const result = MobileDetection.iPhone();
      expect(result).toEqual(false);
    });
  });

  describe('iPad()', () => {
    it('returns true if user agent contains iPad', () => {
      window.navigator.__defineGetter__('userAgent', function () {
        return 'iPad';
      });

      const result = MobileDetection.iPad();
      expect(result).toEqual(true);
    });

    it('returns false if user agent does not contain iPad', () => {
      window.navigator.__defineGetter__('userAgent', function () {
        return 'that which shall not be named';
      });

      const result = MobileDetection.iPad();
      expect(result).toEqual(false);
    });
  });

  describe('Windows()', () => {
    it('returns true if user agent contains IEMobile', () => {
      window.navigator.__defineGetter__('userAgent', function () {
        return 'IEMobile';
      });

      const result = MobileDetection.Windows();
      expect(result).toEqual(true);
    });

    it('returns false if user agent does not contain IEMobile', () => {
      window.navigator.__defineGetter__('userAgent', function () {
        return 'that which shall not be named';
      });

      const result = MobileDetection.Windows();
      expect(result).toEqual(false);
    });
  });

  describe('FirefoxOS()', () => {
    it('returns true if user agent contains Mozilla and Mobile', () => {
      window.navigator.__defineGetter__('userAgent', function () {
        return 'Mozilla Mobile';
      });

      const result = MobileDetection.FirefoxOS();
      expect(result).toEqual(true);
    });

    it('returns false if user agent contains Mozilla and not Mobile', () => {
      window.navigator.__defineGetter__('userAgent', function () {
        return 'Mozilla';
      });

      const result = MobileDetection.FirefoxOS();
      expect(result).toEqual(false);
    });

    it('returns false if user agent contains not Mozilla but Mobile', () => {
      window.navigator.__defineGetter__('userAgent', function () {
        return 'Mobile';
      });

      const result = MobileDetection.FirefoxOS();
      expect(result).toEqual(false);
    });

    it('returns false if user agent contains neither Mozilla or Mobile', () => {
      window.navigator.__defineGetter__('userAgent', function () {
        return 'that which shall not be named';
      });

      const result = MobileDetection.FirefoxOS();
      expect(result).toEqual(false);
    });
  });

  describe('any()', () => {
    it('returns true if user agent contains Android', () => {
      window.navigator.__defineGetter__('userAgent', function () {
        return 'Android';
      });

      const result = MobileDetection.any();
      expect(result).toEqual(true);
    });

    it('returns true if user agent contains Kindle', () => {
      window.navigator.__defineGetter__('userAgent', function () {
        return 'Kindle';
      });

      const result = MobileDetection.any();
      expect(result).toEqual(true);
    });

    it('returns true if user agent contains KindleFire', () => {
      window.navigator.__defineGetter__('userAgent', function () {
        return 'KFOT';
      });

      const result = MobileDetection.any();
      expect(result).toEqual(true);
    });

    it('returns true if user agent contains Silk', () => {
      window.navigator.__defineGetter__('userAgent', function () {
        return 'Silk';
      });

      const result = MobileDetection.any();
      expect(result).toEqual(true);
    });

    it('returns true if user agent contains BlackBerry', () => {
      window.navigator.__defineGetter__('userAgent', function () {
        return 'BlackBerry';
      });

      const result = MobileDetection.any();
      expect(result).toEqual(true);
    });

    it('returns true if user agent contains iPad', () => {
      window.navigator.__defineGetter__('userAgent', function () {
        return 'iPad';
      });

      const result = MobileDetection.any();
      expect(result).toEqual(true);
    });

    it('returns true if user agent contains iPod', () => {
      window.navigator.__defineGetter__('userAgent', function () {
        return 'iPod';
      });

      const result = MobileDetection.any();
      expect(result).toEqual(true);
    });

    it('returns true if user agent contains iPhone', () => {
      window.navigator.__defineGetter__('userAgent', function () {
        return 'iPhone';
      });

      const result = MobileDetection.any();
      expect(result).toEqual(true);
    });

    it('returns true if user agent contains IEMobile', () => {
      window.navigator.__defineGetter__('userAgent', function () {
        return 'IEMobile';
      });

      const result = MobileDetection.any();
      expect(result).toEqual(true);
    });

    it('returns true if user agent contains Mozilla Mobile', () => {
      window.navigator.__defineGetter__('userAgent', function () {
        return 'Mozilla Mobile';
      });

      const result = MobileDetection.any();
      expect(result).toEqual(true);
    });

    it('returns false if user agent contains invalid mobile userAgent', () => {
      window.navigator.__defineGetter__('userAgent', function () {
        return 'no no no';
      });

      const result = MobileDetection.any();
      expect(result).toEqual(false);
    });
  });
});
