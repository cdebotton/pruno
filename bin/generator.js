import {compile} from 'handlebars';
import {join} from 'path';
import {readFileSync} from 'fs';

export default class Generator {
  static config(target, params) {
    let hbsPath = join(__dirname, 'templates', 'pruno.yaml.hbs');
    let hbs = readFileSync(hbsPath).toString();
    let tpl = compile(hbs);

    tpl(params).to(target);
  }

  constructor() {
    throw new Error(
      'Generator should not be instantiated, please use ' +
      'the static methods that it provides.'
    );
  }
}
