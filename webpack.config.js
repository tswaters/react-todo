/**
 * This outputs the config  used by various webpack.*.js files
 */

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {DefinePlugin} = require('webpack')
const path = require('path')
const {parseSync} = require('env-file-parser')
const webpackNodeExternals = require('webpack-node-externals')

const dotEnv = parseSync(`./.env/${process.env.NODE_ENV}.env`)

const config = server => (_, argv) => {
  const isProd = argv.mode === 'production'
  const chunkhash = isProd === 'production' ? '.[chunkhash]' : ''

  const name = server ? 'back-end' : 'front-end'
  const identifier = server ? 'server' : 'client'
  const target = server ? 'node' : 'web'
  const externals = []

  const css = [
    {
      loader: 'css-loader',
      options: {
        exportOnlyLocals: server,
        sourceMap: true,
        importLoaders: 1,
        modules: true,
        camelCase: true,
        localIdentName: argv.mode === 'production'
          ? '[hash:base64:5]'
          : '[path][name]__[local]--[hash:base64:5]'
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
  ]

  if (!server) css.unshift({loader: MiniCssExtractPlugin.loader})

  if (server) {
    externals.push(webpackNodeExternals())
  }

  const rules = [{
    test: /\.jsx?$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: [
          ['@babel/preset-env', {
            targets: server
              ? {node: 'current'}
              : {browsers: ['last 2 versions', 'IE 11']}
          }],
          '@babel/preset-react'
        ]
      }
    }
  // }, {
  //   test: /\.json$/,
  //   loader: 'json-loader'
  }, {
    test: /\.ejs$/,
    loader: 'html-loader'
  }, {
    test: /\.(woff2?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
    loader: 'file-loader'
  }, {
    test: /\.(css|less)$/,
    use: css
  }]

  // Configure plugins

  // Need to make sure not to emit certain env variables to client.
  // Only include the whitelisted variables in the array on client.
  // Server gets everything.

  const includeOnClient = ['BASE_URL', 'NODE_ENV']
  const plugins = [
    new DefinePlugin({
      'process.env': Object.keys(dotEnv).reduce((memo, item) => {
        if (!server && includeOnClient.indexOf(item) === -1) { return memo }
        memo[`${item}`] = JSON.stringify(dotEnv[item])
        return memo
      }, {})
    }),
    new MiniCssExtractPlugin({
      filename: `[name]${chunkhash}.css`,
      chunkFilename: `[id]${chunkhash}.css`
    })
  ]

  if (!server) {
    plugins.push(
      new HtmlWebpackPlugin({
        template: 'src/server/views/index.ejs',
        filename: '../server/views/index.ejs',
        favicon: 'src/client/favicon.ico',
        minify: {
          collapseWhitespace: true
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

    optimization: {
      splitChunks: server ? false : {
        cacheGroups: {
          vendor: {
            test: /node_modules/,
            chunks: 'initial',
            filename: 'vendor.js',
            name: 'vendor',
            enforce: true
          }
        }
      },
      minimize: !server,
      minimizer: [
        new TerserPlugin(),
        new OptimizeCSSAssetsPlugin({})
      ]
    },
    target,
    node: {
      __dirname: false
    },
    output: {
      path: path.resolve(`./dist/${identifier}`),
      filename: `[name]${chunkhash}.js`,
      chunkFilename: `${identifier}.[name]${server ? '' : '[chunkhash]'}.js`,
      publicPath: '/'
    },
    externals,
    resolve: {
      alias: {
        client: path.resolve('./src/client'),
        common: path.resolve('./src/common'),
        server: path.resolve('./src/server'),
        i18n: path.resolve('./src/i18n'),
        db: path.resolve('./src/db')
      },
      extensions: [
        '.js',
        '.jsx',
        '.less',
        '.json'
      ]
    },
    module: {
      rules
    },
    plugins
  }
}

module.exports = [config(true), config(false)]
