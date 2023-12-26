#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const baseDir = process.cwd()
const util = require('util')
const child_process = require('child_process')
const exec = util.promisify(require('child_process').exec)
const spawn = child_process.spawn

const forMore = require('for-more')

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
    gitRepositories.forMore(1, async (rep) => {
        let res = null
		const repDir = path.join(baseDir, rep)
		let arg = argv.join(' ')
		try {
			res = await execSync(`git ${arg}`, {
				cwd: repDir
			})
		} catch(e) {
			res = e
		}
		console.log(`【${rep}】：\n${res}\n----------`)
    })
}

//console.log(, process.argv)