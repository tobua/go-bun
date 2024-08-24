#!/usr/bin/env node
import { execSync } from 'node:child_process'

try {
    console.log(execSync('npm pm', { encoding: 'utf-8' }).includes('bun pm'))
} catch(_error) {
    console.log('fail')
}
