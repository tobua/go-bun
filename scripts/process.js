#!/usr/bin/env node
import { execSync, spawnSync } from 'node:child_process'
// NOTE execSync('node script.js') will ignore the shebang.
console.log(execSync('scripts/script.js', { encoding: 'utf-8' }).trim())
console.log(spawnSync('scripts/script.js', [], { encoding: 'utf-8' }).stdout.trim())
