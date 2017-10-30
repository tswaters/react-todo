
const config = require('./webpack')

const testConfig = config(true)

testConfig.output.devtoolModuleFilenameTemplate = '[absolute-resource-path]'
testConfig.output.devtoolFallbackModuleFilenameTemplate = '[absolute-resource-path]?[hash]'

testConfig.devtool = 'cheap-module-source-map'


module.exports = testConfig
