const { spawn } = require("child_process");

const spawnSync = function(command, argv, options) {
    options = { ...options };
    return new Promise((resolve, reject) => {
      const out = {
        stdout: '',
        stderr: '',
        error: null,
      };
  
      const child = spawn(command, argv, options);
  
      child.on('error', (err) => {
        out.error = err;
      });
  
      child.stdout.on('data', (data) => {
        out.stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        out.stderr += data.toString();
      });

      child.on('exit', (code) => {
        out.code = code;
        if (code === 0) {
            resolve(out);
            return;
        }
        reject(out);
      });
    });
  };

  module.exports = spawnSync;