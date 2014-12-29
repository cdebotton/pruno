var notify = require('gulp-notify');

module.exports = function Notification() {
  this.title = 'Pruno';

  this.message = function(subtitle) {
    return notify({
      title: this.title,
      subtitle: subtitle,
      message: ' '
    });
  };

  this.error = function(e, subtitle) {
    return notify.onError({
      title: this.title,
      subtitle: subtitle,
      message: 'Error: <%= error.message %>'
    })(e);
  };
};
