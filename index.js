#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const baseDir = process.cwd()
const util = require('util')
const child_process = require('child_process')
const exec = util.promisify(require('child_process').exec)
const spawn = child_process.spawn

const forMore = require('for-more')

const gitRepositories = fs.readdirSync(baseDir).filter((dir) => {
    dir = path.join(baseDir, dir)
    const dirStat = fs.statSync(dir)
    if (!dirStat.isDirectory()) {
        return false
    }
    const gitConfigFile = path.join(dir, '.git/config')
    return fs.existsSync(gitConfigFile)
})

const argv = process.argv.slice(2)
console.log(process.argv)

if (gitRepositories.length) {
    gitRepositories.forMore(1, (rep) => {
        return new Promise((resolve, reject) => {
        	const repDir = path.join(baseDir, rep)
        	let arg = argv
        	if(arg[0] == 'rs') {
        		const lslog = spawn('git', ['log'], {
	    			cwd: repDir
		    	})
		    	let commitId = null
		    	lslog.stdout.on('data', (data) => {
				  const logs = data.toString().match(/commit\s+(\w{40,40})/g)
				  let cmId = logs && logs[0].replace(/^commit\s+/, '')
				  if(!commitId && cmId) {
				  	commitId = cmId
				  	const rs = spawn('git', ['reset', '--hard', `${commitId}`], {
		    			cwd: repDir
			    	})
			    	rs.stdout.on('data', (data) => {
					  console.log(`【${rep}】：\n${data}\n----------`);
					});
			    	rs.stderr.on('data', (data) => {
					  console.error(`【${rep}】：\n${data}\n----------`);
					});

					rs.on('close', (code) => {
					  //console.log(`child process exited with code ${code}`);
					  resolve();
					});
				  }
				});

				lslog.stderr.on('data', (data) => {
				  console.error(`【${rep}】：\n${data}\n----------`);
				});
        	} else {
		    	const ls = spawn('git', argv, {
		    		cwd: repDir
		    	})
		    	ls.stdout.on('data', (data) => {
				  console.log(`【${rep}】：\n${data}\n----------`);
				});

				ls.stderr.on('data', (data) => {
				  console.error(`【${rep}】：\n${data}\n----------`);
				});

				ls.on('close', (code) => {
				  //console.log(`child process exited with code ${code}`);
				  resolve();
				});
			}
        })
    })
}

//console.log(, process.argv)