#!/usr/bin/env bun
import { existsSync, readdirSync, renameSync, rmSync, symlinkSync } from 'node:fs'

const binPathMac = '/usr/local/bin'

function getBinFiles() {
  const result: string[] = []

  try {
    const files = readdirSync(binPathMac)
    for (const file of files) {
      result.push(file)
    }
  } catch (_error) {
    console.error(`Error reading directory ${binPathMac}.`)
  }

  return result
}

const binFiles = getBinFiles()

if (!binFiles.includes('_node')) {
  console.error(`node executable backup not found in ${binPathMac}.`)
  console.error('Please reinstall Node.js manually.')
  process.exit(0)
}

const getBinPath = (bin: 'node' | 'npm' | 'npx') => `${binPathMac}/${bin}`

if (existsSync(getBinPath('node'))) {
  rmSync(getBinPath('node'))
}

try {
  // Restore backup created with "go-bun"
  renameSync(`${binPathMac}/_node`, getBinPath('node'))
} catch (error) {
  if ((error as { code: string }).code === 'EACCES') {
    console.error('Permission denied. Please run the script with sudo "sudo go-node".')
  } else if (error instanceof Error) {
    console.error(`Error renaming file: ${error.message}`)
  }
  process.exit(0)
}

function createSymlink(from: 'node' | 'npm' | 'npx', to: string) {
  try {
    const binPath = getBinPath(from)
    if (existsSync(binPath)) {
      rmSync(binPath)
      console.log(`Removed existing file or link at ${binPath}`)
    }
    symlinkSync(to, binPath)
    console.log(`Symlink created from ${binPath} to ${to}`)
  } catch (error) {
    if ((error as { code: string }).code === 'EACCES') {
      console.error('Permission denied. Please run the script with sudo "sudo go-bun".')
    } else {
      console.error('Error creating symlink.')
    }
    process.exit(0)
  }
}

createSymlink('npm', '/usr/local/lib/node_modules/npm/bin/npm-cli.js')
createSymlink('npx', '/usr/local/lib/node_modules/npm/bin/npx-cli.js')
