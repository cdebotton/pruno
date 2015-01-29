import colors from 'colors';

export default class Logger {
  static log(...args) {
    console.log.apply(console, ['[pruno]'.green].concat(args));
  }

  constructor() {
    throw new Error(
      'Generator should not be instantiated, please use ' +
      'the static methods that it provides.'
    );
  }
}
