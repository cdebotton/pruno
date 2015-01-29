import {join} from 'path';
import {mkdir, pwd, cd} from 'shelljs';
import {existsSync} from 'fs';
import Logger from '../logger';

export default function(target, callback) {
  try {
    let path = join(pwd(), target);

    path.split('/').reduce((memo, part) => {
      memo = join(memo, part);
      let exists = existsSync(memo);

      if (! exists) {
        mkdir(memo);
        Logger.log('Creating directory', memo.underline.yellow);
      }

      return memo;
    }, '/');

    if (callback) callback(null, path);
  }
  catch (err) {
    if (callback) callback(err, null);
  }
}
