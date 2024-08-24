#!/usr/bin/env bun
import { execSync } from 'node:child_process'
import { styleText } from 'node:util'

console.log(styleText('bold', 'Checking JavaScript runtime...'))

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
console.log(`Node.js version: ${execSync('bun --version', { encoding: 'utf-8' }).trim()}`)
console.log('Make sure to update bun with "bun upgrade".')
