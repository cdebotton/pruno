import {pwd, cp} from "shelljs";
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
  save(['react', 'react-router', 'fluxd'])
    .then(() => log('Installed React and ReactRouter'))
    .catch(err => log(err));

  buildPath(options.src);
  cp(
    '-R',
    join(__dirname, '..', 'statics', 'react', '*'),
    join(pwd(), options.src)
  );
}
