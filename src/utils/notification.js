import notify from 'gulp-notify';

export default class Notification {
  constructor() {
    this.title = 'Pruno';
  }

  message(subtitle) {
    return notify({
      title: this.title,
      subtitle: subtitle,
      message: ' '
    });
  }

  error(e, subtitle) {
    return notify.onError({
      title: this.title,
      subtitle: subtitle,
      message: 'Error: <%= error.message %>'
    })(e);
  }
}
