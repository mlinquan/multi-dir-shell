#!/usr/bin/env node

const {
  isMainThread,
  Worker,
  parentPort,
  threadId,
} = require('worker_threads');

const fs = require('fs');
const path = require('path')
const baseDir = process.cwd()
const { spawn } = require('child_process')

const argv = require('./argv.js')
const args = process.argv.slice(2)

const execSync = function(command, options) {
  options = {...options}
  return new Promise((resolve, reject) => {
      exec(command, options, (error, stdout, stderr) => {
          if (error) {
              error.stdout = error.stdout || stdout
              error.stderr = error.stderr || stderr
              return reject(error)
          }
          resolve({
            stdout,
            stderr
          })
      })
  })
};

const dirList = fs.readdirSync(baseDir).filter((dir) => {
  dir = path.join(baseDir, dir)
  const dirStat = fs.statSync(dir)
  if (!dirStat.isDirectory()) {
      return false
  }
  const gitConfigFile = path.join(dir, '.git/config')
  return fs.existsSync(gitConfigFile)
})

const WORKER_NUM = dirList.length; // 线程数
let Completed = 0;

function doWork(subDir, args, index, startTime) {
  console.log(subDir, args, index, startTime);
  return execSync(args.join(' '), {
    cwd: subDir
  })
}

if (isMainThread) {
  createChildThread();
} else {
  // 主线程告诉子线程可以开始工作了
  parentPort.on('message', async ({ subDir, args, index, startTime }) => {
    const data = await doWork(subDir, args, index, startTime);
    parentPort.postMessage({
      payload: 'finish',
      data: {
        data,
        usedTime: Date.now() - startTime,
        subDir,
        args,
        index,
        startTime
      }
    });
    setTimeout(() => {
      process.exit(threadId);
    }, 0);
  });

  // 告诉主线程准备就绪
  parentPort.postMessage({
    payload: 'ready'
  });
}

// 创建线程方法
function createChildThread() {
  const startTime = Date.now();
  if (!WORKER_NUM) {
    return console.error('No matched directory.')
  }
  for (let x = 0; x < WORKER_NUM; x++) {
    const worker = new Worker(__filename, {});
    const subDir = path.join(baseDir, dirList[x]);
    worker.on('message', ({ payload, data }) => {
      if (payload === 'ready') {
        worker.postMessage({
          subDir,
          args,
          index: x,
          startTime,
          data
        });
      }
      if (payload === 'finish') {
        const { usedTime, subDir, data: aData } = data
        const { stdout, stderr } = aData
        console.log(subDir);
        // console.log('Used time: ', usedTime);
        if(stdout) {
          console.log(stdout);
        }
        if(stderr) {
          console.error(stderr);
        }
        console.log('===========================');
        if(++Completed === WORKER_NUM) {
          console.log('Total time: ', Date.now() - startTime);
        }
      }
    });
  }
}
