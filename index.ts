#!/usr/bin/env bun
import { execSync } from 'node:child_process'
import { existsSync, readdirSync, renameSync, rmSync, symlinkSync } from 'node:fs'
import { platform } from 'node:os'
import { join } from 'node:path'
import Bun from 'bun'
import { getRuntimePath } from './helper'

const commands = process.argv
const fileInPackage = (fileName: string) => join(__dirname, fileName)
const { bin, name } = await Bun.file(fileInPackage('package.json')).json()

// No way to run other bin scripts with bunx directly.
function runOtherBinScripts(scriptName: string) {
  if (!commands.includes(scriptName)) {
    return
  }

  execSync(fileInPackage(bin[scriptName]), { stdio: 'inherit' })
  process.exit(0)
}

Object.keys(bin)
  .filter((scriptName) => scriptName !== name)
  .forEach(runOtherBinScripts)

const binPath = getRuntimePath('node')

if (platform() !== 'darwin') {
  console.warn('Warning: This script has only been tested on macOS.')
}

function getBinFiles() {
  const result: string[] = []

  try {
    const files = readdirSync(binPath)
    for (const file of files) {
      result.push(file)
    }
  } catch (_error) {
    console.error(`Error reading directory ${binPath}.`)
  }

  return result
}

const binFiles = getBinFiles()

if (!(binFiles.includes('node') && binFiles.includes('npx') && binFiles.includes('npm'))) {
  console.log(`node installation not found in ${binPath}`)
  process.exit(0)
}

const getBinPath = (bin: 'node' | 'npm' | 'npx') => `${binPath}/${bin}`

if (!binFiles.includes('_node')) {
  try {
    renameSync(getBinPath('node'), `${binPath}/_node`)
  } catch (error) {
    if ((error as { code: string }).code === 'EACCES') {
      console.error('Permission denied. Please run the script with sudo "sudo go-bun".')
    } else if (error instanceof Error) {
      console.error(`Error renaming file: ${error.message}`)
    }
    process.exit(0)
  }
}

if (existsSync(getBinPath('node'))) {
  rmSync(getBinPath('node'))
}

function getUserHomeDirectory() {
  try {
    const userHomeDir = execSync('echo ${SUDO_USER}').toString().trim()
    return `/Users/${userHomeDir}`
  } catch (_error) {
    console.error('Error getting user home directory.')
    process.exit(0)
  }
}

const bunBinPath = (bin: 'bun' | 'bunx') => join(getUserHomeDirectory(), `.bun/bin/${bin}`)

if (!existsSync(bunBinPath('bun'))) {
  console.log(`bun installation not found in ${bunBinPath('bun')}`)
  process.exit(0)
}

function createSymlink(from: 'node' | 'npm' | 'npx', to: 'bun' | 'bunx') {
  try {
    const binPath = getBinPath(from)
    if (existsSync(binPath)) {
      rmSync(binPath)
      console.log(`Removed existing file or link at ${binPath}`)
    }
    symlinkSync(bunBinPath(to), binPath)
    console.log(`Symlink created from ${binPath} to ${bunBinPath(to)}`)
  } catch (error) {
    if ((error as { code: string }).code === 'EACCES') {
      console.error('Permission denied. Please run the script with sudo "sudo go-bun".')
    } else {
      console.error('Error creating symlink.')
    }
    process.exit(0)
  }
}

createSymlink('node', 'bun')
createSymlink('npm', 'bun')
createSymlink('npx', 'bunx')
