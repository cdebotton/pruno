import {spawn} from 'child_process';

export let save = (packages) => {
  return install('--save', packages);
};

export let saveDev = (packages) => {
  return install('--save-dev', packages);
};

let install = (method, packages) => {
  packages = Array.isArray(packages) ? packages : [packages];

  return new Promise((resolve, reject) => {
    spawn('npm', ['install', method].concat(packages), {stdio: 'inherit'})
      .on('exit', (err, response) => {
        if (err) reject(err);
        resolve(response);
      });
  });
};
