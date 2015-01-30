"use strict";

import {spawn} from "child_process";
import {log} from "../logger";

let watch = (program) => program.command('[...commands]')
  .option('-e, --env <env>', 'Environment to run pruno in.', 'development')
  .action((commands, env) => {
    let cmd = spawn(`NODE_ENV=${env} gulp ${commands}`);
    cmd.on('exit', (err) => {
      log("Pruno watch stopped.");
    });
  });

export default watch;
