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
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const env = parseSync(`./.env/${process.env.NODE_ENV}.env`)

const cssUse = (server, isProd) => ([
  {
    loader: server ? 'css-loader/locals' : 'css-loader',
    options: {
      sourceMap: true,
      modules: true,
      camelCase: true,
      importLoaders: 1,
      localIdentName: isProd ? '[hash:base64:5]' : '[path][name]__[local]--[hash:base64:5]'
    }
  },
  {
    loader: 'less-loader',
    options: {
      sourceMap: true,
      relativeUrls: true,
      noIeCompat: true
    }
  }
])

const config = (server, isProd = false) => {

  const name = server ? 'back-end' : 'front-end'
  const identifier = server ? 'server' : 'client'
  const target = server ? 'node' : 'web'

  // Configure externals
  const externals = []
  const cssLoader = cssUse(server, isProd)

  if (server) {
    externals.push(webpackNodeExternals())
  }

  // Configure loaders
  const loaders = [{
    test: /\.jsx?$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: [
          ['env', {
            targets: server
              ? {node: 'current'}
              : {browsers: ['last 2 versions', 'IE 11']}
          }],
          'react'
        ],
        plugins: [
          'transform-runtime',
          'transform-decorators-legacy',
          'transform-class-properties',
          'transform-object-rest-spread'
        ]
      }
    }
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
      use: cssLoader
    })
  }]

  // Configure plugins

  // Need to make sure not to emit certain env variables to client.
  // Only include the whitelisted variables in the array on client.
  // Server gets everything.

  const includeOnClient = ['BASE_URL', 'NODE_ENV']
  const plugins = [
    new webpack.DefinePlugin({
      'process.env': Object.keys(env).reduce((memo, item) => {
        if (!server && includeOnClient.indexOf(item) === -1) { return memo }
        memo[`${item}`] = JSON.stringify(env[item])
        return memo
      }, {})
    })
  ]

  if (!server) {
    plugins.push(
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: ({resource}) => (/node_modules/).test(resource),
        filename: 'vendor.bundle.[chunkhash].js'
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
        filename: 'styles.[chunkhash].css',
        allChunks: true
      }),
      new StatsPlugin('../server/stats.json', {
        chunkModules: true,
        exclude: [/^\.\/~/]
      })
    )
  }

  if (!server && isProd) {
    plugins.push(
      new webpack.LoaderOptionsPlugin({
        minimize: true
      }),
      new UglifyJSPlugin({
        sourceMap: true,
        compress: {
          warnings: false,
          screw_ie8: true,
          conditionals: true,
          unused: true,
          comparisons: true,
          sequences: true,
          dead_code: true,
          evaluate: true,
          if_return: true,
          join_vars: true
        },
        output: {
          comments: false
        }
      })
    )
  }

  let devtool = null
  if (server) {
    devtool = 'inline-cheap-module-source-map'
  } else if (isProd && !server) {
    devtool = 'hidden-source-map'
  } else {
    devtool = 'eval-source-map'
  }

  return {
    name,
    devtool,
    entry: {
      [identifier]: `./src/${identifier}/index`
    },
    target,
    node: {
      __dirname: false
    },
    output: {
      path: path.resolve(`./dist/${identifier}`),
      filename: `${identifier}${server ? '' : '[chunkhash]'}.js`,
      chunkFilename: `${identifier}.[name]${server ? '' : '[chunkhash]'}.js`,
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
