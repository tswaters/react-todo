
const config = require('./webpack')

const testConfig = config(true)

testConfig.output = {
  devtoolModuleFilenameTemplate: '[absolute-resource-path]',
  devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]'
}

testConfig.devtool = 'cheap-module-source-map'

delete testConfig.entry

module.exports = testConfig
