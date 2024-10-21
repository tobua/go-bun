#!/usr/bin/env bun
import { execSync } from 'node:child_process'
import { styleText } from 'node:util'

console.log(styleText('bold', 'Checking JavaScript runtime...'))

console.log('')

try {
  // readlink also resolves symlinks.
  const bunPath = execSync('readlink -f $(which bun)', { encoding: 'utf-8' })
  const nodePath = execSync('readlink -f $(which node)', { encoding: 'utf-8' })

  console.log(`"bun" points to ${bunPath.trim()}`)
  console.log(`"node" points to ${nodePath.trim()}`)
} catch (_error) {
  console.error('Failed to find Node.js or Bun runtime installation.')
}

console.log(`Bun version: ${execSync('bun --version', { encoding: 'utf-8' }).trim()}`)
console.log(`Node.js version: ${execSync('node --version', { encoding: 'utf-8' }).trim()}`)
console.log('Make sure to update bun with "bun upgrade".')

console.log('')

const regularScript = execSync('bun scripts/script.js', { encoding: 'utf-8' }).trim() === 'true'

if (regularScript) {
  console.log('✅ Regular script with node shebang executed with Bun')
} else {
  console.log('❌ Regular script with node shebang executed with Node.js')
}

const processScripts = execSync('bun scripts/process.js', { encoding: 'utf-8' }).trim() === 'true\ntrue'

if (processScripts) {
  console.log('✅ execSync and spawnSync scripts executed with Bun')
} else {
  console.log('❌ execSync and spawnSync scripts executed with Node.js')
}

const packageManagerScript = execSync('bun scripts/package.js', { encoding: 'utf-8' }).trim() === 'true'

if (packageManagerScript) {
  console.log("✅ npm executed with Bun's package manager")
} else {
  console.log('❌ npm filed to link')
}
