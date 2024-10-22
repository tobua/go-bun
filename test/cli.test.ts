import { expect, test } from 'bun:test'
import { execSync } from 'node:child_process'
import { chmodSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { getRuntimePath } from '../helper'
import packageContents from '../package.json'

test('All scripts are available in the package.', () => {
  expect(packageContents.bin).toBeObject()
  expect(existsSync(packageContents.bin['check-runtime'])).toBe(true)
  expect(existsSync(packageContents.bin['go-bun'])).toBe(true)
  expect(existsSync(packageContents.bin['go-node'])).toBe(true)
})

test('helper: Runtime points to proper location.', () => {
  const runtimePath = getRuntimePath('bun')
  const runtimePathNode = getRuntimePath('node')

  expect(runtimePath).not.toEndWith('/bun')
  expect(existsSync(runtimePath)).toBe(true)
  expect(runtimePathNode).not.toEndWith('/node')
  expect(existsSync(runtimePathNode)).toBe(true)
})

test('Node.js is installed.', () => {
  chmodSync('./scripts/package.js', 0o755)
  chmodSync('./scripts/process.js', 0o755)
  chmodSync('./scripts/script.js', 0o755)

  const output = execSync(`bun ${packageContents.bin['check-runtime']}`, {
    stdio: 'pipe',
  }).toString()

  console.log(output)

  expect(output).toContain(`"node" points to ${join(getRuntimePath('node'), 'node')}`)
  expect(output).toContain('Node.js version: v')
  // node and npm not yet redirected to bun.
  expect(output).toContain('❌ Regular script with node shebang executed with Node.js')
  expect(output).toContain('❌ execSync and spawnSync scripts executed with Node.js')
  expect(output).toContain('❌ npm filed to link')
  // expect(output).toContain('✅ Regular script with node shebang executed with Bun')
}, 60000)
