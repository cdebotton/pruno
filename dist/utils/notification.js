"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var notify = _interopRequire(require("gulp-notify"));

var Notification = function Notification() {
  this.title = "Pruno";
};

Notification.prototype.message = function (subtitle) {
  return notify({
    title: this.title,
    subtitle: subtitle,
    message: " "
  });
};

Notification.prototype.error = function (e, subtitle) {
  return notify.onError({
    title: this.title,
    subtitle: subtitle,
    message: "Error: <%= error.message %>"
  })(e);
};

module.exports = Notification;