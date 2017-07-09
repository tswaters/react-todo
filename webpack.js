/**
 * This outputs the config  used by various webpack.*.js files
 */

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const StatsPlugin = require('stats-webpack-plugin')
const {parseSync} = require('env-file-parser')
const webpackNodeExternals = require('webpack-node-externals')

const env = parseSync(`./.env/${process.env.NODE_ENV}.env`)

const cssUse = server => ([
  {
    loader: server ? 'css-loader/locals' : 'css-loader',
    options: {
      modules: true,
      camelCase: true,
      importLoaders: 1,
      localIdentName: '[path][name]__[local]--[hash:base64:5]'
    }
  },
  {
    loader: 'less-loader',
    options: {
      relativeUrls: true,
      noIeCompat: true
    }
  }
])

const config = server => {

  const name = server ? 'back-end' : 'front-end'
  const identifier = server ? 'server' : 'client'
  const target = server ? 'node' : 'web'

  // Configure externals
  const externals = []
  const cssLoader = cssUse(server)

  if (server) {
    externals.push(webpackNodeExternals())
  }

  // Configure loaders
  const loaders = [{
    test: /\.jsx?$/,
    exclude: /node_modules/,
    loader: 'babel-loader'
  }, {
    test: /\.json$/,
    loader: 'json-loader'
  }, {
    test: /\.ejs$/,
    loader: 'html-loader'
  }, {
    test: /\.(woff2?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
    loader: 'file-loader'
  }, {
    test: /\.(css|less)$/,
    use: server ? cssLoader : ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: cssUse(server)
    })
  }]

  if (!server) {
    loaders.push({
      test: /\.js$/,
      include: /node_modules/,
      loader: 'strip-sourcemap-loader'
    })
  }

  // Configure plugins
  const plugins = [
    new webpack.DefinePlugin(Object.keys(env).reduce((memo, item) => {
      memo[`process.env.${item}`] = JSON.stringify(env[item])
      return memo
    }, {}))
  ]

  if (!server) {
    plugins.push(
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: ({resource}) => (/node_modules/).test(resource),
        filename: 'vendor.bundle.js'
      }),
      // uncomment this when react-router-server is sorted
      // new webpack.optimize.CommonsChunkPlugin({
      //   async: 'common',
      //   children: true,
      //   minChunks: 3
      // }),
      new HtmlWebpackPlugin({
        template: 'src/server/views/index.ejs',
        filename: '../server/views/index.ejs',
        favicon: 'src/client/favicon.ico',
        minify: {
          collapseWhitespace: true
        }
      }),
      new ExtractTextPlugin({
        filename: 'styles.css',
        allChunks: true
      }),
      new StatsPlugin('../server/stats.json', {
        chunkModules: true,
        exclude: [/^\.\/~/]
      })
    )
  }

  return {
    name,
    entry: {
      [identifier]: `./src/${identifier}/index`
    },
    target,
    node: {
      __dirname: false
    },
    output: {
      path: path.resolve(`./dist/${identifier}`),
      filename: `${identifier}.js`,
      chunkFilename: `${identifier}.[name].[chunkhash].js`,
      publicPath: '/'
    },
    externals,
    resolve: {
      alias: {
        client: path.resolve('./src/client'),
        common: path.resolve('./src/common'),
        server: path.resolve('./src/server'),
        i18n: path.resolve('./src/i18n')
      },
      extensions: [
        '.webpack.js',
        '.web.js',
        '.js',
        '.jsx',
        '.less',
        '.json'
      ]
    },
    module: {
      loaders
    },
    plugins
  }
}

module.exports = config
