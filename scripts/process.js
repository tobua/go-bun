#!/usr/bin/env node
import { execSync, spawnSync } from 'node:child_process'

console.log(execSync('node scripts/script.js', { encoding: 'utf-8' }).trim())
console.log(spawnSync('node', ['scripts/script.js'], { encoding: 'utf-8' }).stdout.trim())
