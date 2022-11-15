const args = process.argv.slice(2)

const argv = {}

args.forEach((arg) => {
  if (/^\-\-\w+(\=.+)?$/.test(arg)) {
    const arg_kv = arg.split('=')
    const key = arg_kv[0].replace(/^\-\-/, '')
    let value = arg_kv[1]
    if (value === undefined || value === 'true') {
      value = true
    }
    if(value === 'false') {
      value = false
    }
    argv[key] = value
  }
})

module.exports = argv
