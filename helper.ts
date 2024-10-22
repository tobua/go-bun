import { execSync } from 'node:child_process'
import { platform } from 'node:os'

export function getRuntimePath(runtime: 'node' | 'bun') {
  const currentPlatform = platform()
  let command = ''

  if (currentPlatform === 'darwin' || currentPlatform === 'linux') {
    command = `readlink -f $(which ${runtime})`
  } else if (currentPlatform === 'win32') {
    command = `where.exe ${runtime}`
  } else {
    throw new Error(`Unsupported platform: ${currentPlatform}`)
  }

  const path = execSync(command, { encoding: 'utf-8' })
    .trim()
    .replace(new RegExp(`/${runtime}$`), '')
    .replace(new RegExp(`\\${runtime}.exe$`), '') // Windows

  return path
}
