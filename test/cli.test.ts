import { expect, test } from 'bun:test'
import { execSync } from 'node:child_process'
import { chmodSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import packageContents from '../package.json'

test('All scripts are available in the package.', () => {
  expect(packageContents.bin).toBeObject()
  expect(existsSync(packageContents.bin['check-runtime'])).toBe(true)
  expect(existsSync(packageContents.bin['go-bun'])).toBe(true)
  expect(existsSync(packageContents.bin['go-node'])).toBe(true)
})

test('Node.js is installed.', () => {
  const binPathMac = '/usr/local/bin'
  expect(existsSync(join(binPathMac, 'node'))).toBe(true)

  // const currentChmod = (statSync('./scripts/package.js').mode & 0o777).toString(8)

  chmodSync('./scripts/package.js', 0o755)
  chmodSync('./scripts/process.js', 0o755)
  chmodSync('./scripts/script.js', 0o755)

  const output = execSync(`bun ${packageContents.bin['check-runtime']}`, {
    stdio: 'pipe',
  }).toString()

  console.log(output)

  expect(output).toContain(`"node" points to ${join(binPathMac, 'node')}`)
  expect(output).toContain('Node.js version: v')
  // expect(output).toContain('✅ Regular script with node shebang executed with Bun')
}, 60000)
