# go-bun

<img align="right" src="https://github.com/tobua/go-bun/raw/main/logo.png" width="30%" alt="Bun/Node.js logo" />

Bun aims to be a compatible JavaScript runtime with Node.js. Since the ecosystem is largely built on top of Node.js scripts will often switch to be executed with Node.js in the background. This small plugin will make it easy to point the **node** executable to **bun** so that you can be sure everything runs with Bun. While compatibility can still be an issue it's also easy to restore the node exectuable.

```sh
bun install -g go-bun # Global installation
bunx go-bun # One-time usage
```

The following commands are available to switch and verify executables.

```sh
# Link "node", "npm" and "npx" executables to Bun.
go-bun / bunx go-bun
# Link "node", "npm" and "npx" back to Node.js.
go-node / bunx go-bun go-node
# Check where current executables point to.
check-runtime / bunx go-bun check-runtime
```

Once switched anything should run with Bun also bin scripts with the `#!/usr/bin/env node` shebang or `execSync('node index.js')` somewhere deep down in the code.