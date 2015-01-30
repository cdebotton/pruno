"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var notify = _interopRequire(require("gulp-notify"));

var Notification = (function () {
  function Notification() {
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
      enumerable: true,
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
      enumerable: true,
      configurable: true
    }
  });

  return Notification;
})();

module.exports = Notification;