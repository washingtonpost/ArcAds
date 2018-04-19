/** @desc Utility class that determines the end users browser user agent. **/
export class MobileDetection {
  /**
  * @desc Determines if the user is using an Android device.
  **/
  static Android() {
    return !!navigator.userAgent.match(/Android/i);
  }

  /**
  * @desc Determines if the user is using an old Android device.
  **/
  static AndroidOld() {
    return !!navigator.userAgent.match(/Android 2.3.3/i);
  }

  /**
  * @desc Determines if the user is using an Android tablet device.
  **/
  static AndroidTablet() {
    return !!(navigator.userAgent.match(/Android/i) && !navigator.userAgent.match(/Mobile/i));
  }

  /**
  * @desc Determines if the user is using a Kindle.
  **/
  static Kindle() {
    return !!navigator.userAgent.match(/Kindle/i);
  }

  /**
  * @desc Determines if the user is using a Kindle Fire.
  **/
  static KindleFire() {
    return !!navigator.userAgent.match(/KFOT/i);
  }

  /**
  * @desc Determines if the user is using Silk.
  **/
  static Silk() {
    return !!navigator.userAgent.match(/Silk/i);
  }

  /**
  * @desc Determines if the user is using a BlackBerry device
  **/
  static BlackBerry() {
    return !!navigator.userAgent.match(/BlackBerry/i);
  }

  /**
  * @desc Determines if the user is using an iOS device.
  **/
  static iOS() {
    return !!navigator.userAgent.match(/iPhone|iPad|iPod/i);
  }

  /**
  * @desc Determines if the user is using an iPhone or iPod.
  **/
  static iPhone() {
    return !!navigator.userAgent.match(/iPhone|iPod/i);
  }

  /**
  * @desc Determines if the user is using an iPad.
  **/
  static iPad() {
    return !!navigator.userAgent.match(/iPad/i);
  }

  /**
  * @desc Determines if the user is using a Windows Mobile device.
  **/
  static Windows() {
    return !!navigator.userAgent.match(/IEMobile/i);
  }

  /**
  * @desc Determines if the user is using FireFoxOS.
  **/
  static FirefoxOS() {
    return !!navigator.userAgent.match(/Mozilla/i) && !!navigator.userAgent.match(/Mobile/i);
  }

  /**
  * @desc Determines if the user is using a Retina display.
  **/
  static Retina() {
    return (window.retina || window.devicePixelRatio > 1);
  }

  /**
  * @desc Determines if the user is using any type of mobile device.
  **/
  static any() {
    return (this.Android() || this.Kindle() || this.KindleFire() || this.Silk() || this.BlackBerry() || this.iOS() || this.Windows() || this.FirefoxOS());
  }
}

export default MobileDetection;
