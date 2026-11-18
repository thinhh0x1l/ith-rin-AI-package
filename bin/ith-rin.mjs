#!/usr/bin/env node
import { main } from '../lib/cli.mjs'

main(process.argv.slice(2)).catch((error) => {
  console.error(`error: ${error.message}`)
  process.exit(1)
})
