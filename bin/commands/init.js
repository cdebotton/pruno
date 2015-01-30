import {resolve} from "path";
import {pwd} from "shelljs";
import npm from "npm";
import {log} from "../logger";
import {saveDev} from "../utils/install";
import Generator from "../generator";
import scaffolder from "../utils/scaffolder";

let init = (program) => program.command('init <name> [scaffold]')
  .description('Initialize Pruno for this project.')
  .option('-s, --src <src>', 'Where would you like to store the pre-compiled source files?', './src')
  .option('-d, --dist <dist>', 'Where would you like to store the compiled project files?', './dist')
  .option('-c, --config <config>', 'Where is the pruno config located?', './config')
  .action((name, scaffold = false, options = {}) => {
    // Load NPM
    npm.load(npm.config, (err, npm) => {
      log('Initializing pruno.');
      let initFile = resolve(process.env.HOME, '.npm-init');

      // Create package.json file
      npm.commands.init(pwd(), (err, data) => {
        // Generate config file
        Generator.config(options);

        // Scaffold React project
        scaffolder(scaffold, options);
      });
    });
  });

export default init;
