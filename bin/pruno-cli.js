import program from 'commander';
import Generator from './generator';
import {join} from 'path';
import {pwd} from 'shelljs';

let {version} = require('../package.json');

program.version(version);

program.command('init')
  .description('Initialize Pruno for this project.')
  .option(
    '-s, --src [src]',
    'Where would you like to store the pre-compiled source files?'
  )
  .option(
    '-d, --dist [dist]',
    'Where would you like to store the compiled project files?'
  )
  .option(
    '-c, --config [cfg]',
    'Where is the pruno config located?'
  )
  .action(({
    src = './src',
    dist = './dist',
    cfg = './config'
  }) => {
    try {
      let config = Generator.config(
        join(pwd(), cfg, 'pruno.yaml'),
        {src, dist, cfg}
      );
    }
    catch (err) {
      throw err;
    }
  });

program.parse(process.argv);
