
module.exports = [
  {test: /\.jsx?$/, loader: ['babel-loader', 'strip-sourcemap-loader']},
  {test: /\.json$/, loader: 'json-loader'}
]
