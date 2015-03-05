"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var notify = _interopRequire(require("gulp-notify"));

var Notification = (function () {
  function Notification() {
    _classCallCheck(this, Notification);

    this.title = "Pruno";
  }

  _prototypeProperties(Notification, null, {
    message: {
      value: function message(subtitle) {
        return notify({
          title: this.title,
          subtitle: subtitle,
          message: " "
        });
      },
      writable: true,
      configurable: true
    },
    error: {
      value: function error(e, subtitle) {
        return notify.onError({
          title: this.title,
          subtitle: subtitle,
          message: "Error: <%= error.message %>"
        })(e);
      },
      writable: true,
      configurable: true
    }
  });

  return Notification;
})();

module.exports = Notification;