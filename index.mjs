import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const assets = path.join(__dirname, 'assets')

export default async function ithRinPlugin() {
  return {
    config: (cfg) => {
      cfg.skills ??= {}
      cfg.skills.paths ??= []
      const skills = path.join(assets, 'skills')
      if (!cfg.skills.paths.includes(skills)) cfg.skills.paths.push(skills)

      cfg.instructions ??= []
      const bootstrap = path.join(assets, 'docs', 'kernel', 'bootstrap.md')
      if (!cfg.instructions.includes(bootstrap)) cfg.instructions.push(bootstrap)
    },
  }
}
