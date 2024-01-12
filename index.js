#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const baseDir = process.cwd();

require("for-more");

const spawnSync = require('./spawnSync.js');

const gitRepositories = fs.readdirSync(baseDir).filter((dir) => {
  dir = path.join(baseDir, dir);
  const dirStat = fs.statSync(dir);
  if (!dirStat.isDirectory()) {
    return false;
  }
  const gitConfigFile = path.join(dir, ".git/config");
  return fs.existsSync(gitConfigFile);
});

const argv = process.argv.slice(2);

if (gitRepositories.length) {
  gitRepositories.forMore(1, async (rep) => {
    let res = null;
    const repDir = path.join(baseDir, rep);
    try {
      res = await spawnSync('git', argv, {
        cwd: repDir,
        detached: true,
      });
    } catch (e) {
      res = e;
    }
    const { stdout, stderr, error, code } = res;
    console.log(`Workspace: ${rep}\n`)
    if (stdout) {
      console.log(stdout);
    }
    if (stderr) {
      console.error(stderr);
    }
    if (error) {
      console.error(error);
    }
    if (error) {
      console.error(error);
    }
    console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-");
    if (code !== 0) {
      process.exit(code);
    }
  });
}
