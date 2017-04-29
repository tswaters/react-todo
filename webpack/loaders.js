
module.exports = [
  {test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader'},
  {test: /\.js$/, include: /node_modules/, loaders: ['strip-sourcemap-loader']},
  {test: /\.json$/, loader: 'json-loader'}
]
