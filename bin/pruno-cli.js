import program from 'commander';
import requireDir from 'require-dir';

let {version} = require('../package.json');

program.version(version);

let commands = requireDir('./commands');

Object.keys(commands).forEach(cmd => {
  commands[cmd](program);
});

program.parse(process.argv);
