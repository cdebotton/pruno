import {pwd, cp, mv} from "shelljs";
import {join} from "path";
import {save, saveDev} from "../utils/install";
import buildPath from "../utils/build-path";

export default function (scaffold, options) {
  switch(scaffold) {
    case 'react':
      generateReact(options);
      break;
  }
}

var generateReact = (options) => {
  save([
    'react',
    'react-router',
    'fluxd'
    ])
    .then(() => log('Installed front-end assets for React.'))
    .catch(err => log(err));

  saveDev([
    'pruno',
    'gulp',
    'pruno-js',
    'pruno-stylus',
    'pruno-http'
    // 'pruno-publish'
    ])
    .then(() => log('Installed build tools for React.'))
    .catch(err => log(err));

  cp('-R', join(__dirname, '..', 'statics', 'react', '*'), pwd());
  mv('-f', join(pwd(), 'app'), options.src);
  mv('-f', join(pwd(), 'config', options.config));
}
