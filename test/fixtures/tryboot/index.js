const Helper = require('../../helper')

global.Pear = new class API {
  static RTI = { checkout: { } }
  exit (code) { global.Bare.exit(code) }
}()

let resolve = () => {}
const spawnCalled = new Promise((_resolve) => {
  resolve = _resolve
})
const restore = Helper.override('bare-daemon', {
  spawn: (cmd, args, options) => {
    resolve({ cmd, args, options })
    return { unref: () => {} }
  }
})
global.Bare.on('beforeExit', restore)

const tryboot = require('../../..')
tryboot()

const pipe = require('pear-pipe')()
pipe.on('data', async () => {
  const res = await spawnCalled
  pipe.write(JSON.stringify(res) + '\n')
})
