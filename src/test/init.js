
const {parseSync} = require('env-file-parser')
const env = parseSync(`./.env/${process.env.NODE_ENV}.env`)

for (const [key, value] of Object.entries(env)) {
  process.env[key] = value
}

require.extensions['.less'] = () => {}
