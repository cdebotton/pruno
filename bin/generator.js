import {compile} from "handlebars";
import {join} from "path";
import {pwd} from "shelljs";
import buildPath from "./utils/build-path";
import {readFileSync, existsSync} from "fs";
import Logger from "./logger";

export default class Generator {
  static config(params) {
    let hbsPath = join(__dirname, 'templates', 'pruno.yaml.hbs');
    let hbs = readFileSync(hbsPath).toString();
    let tpl = compile(hbs);

    buildPath(params.config);
    Logger.log('Creating config file', join(params.config, 'pruno.yaml').underline.yellow);
    tpl(params).to(join(params.config, 'pruno.yaml'));
  }

 static gulpfile(params) {
  let hbsPath = join(__dirname, 'templates', 'gulpfile.js.hbs');
  let hbs = readFileSync(hbsPath).toString();
  let tpl = compile(hbs);

  let opts = Object.assign({}, params, {
    config: params.config.match(/^(?:\.)(.+)$/)[1]
  });

  Logger.log('Creating gulpfile', join(pwd(), 'gulpfile.js').underline.yellow);
  tpl(opts).to(join(pwd(), 'gulpfile.js'));
 }

  constructor() {
    throw new Error(
      'Generator should not be instantiated, please use ' +
      'the static methods that it provides.'
    );
  }
}
