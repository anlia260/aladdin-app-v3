const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const { DefinePlugin } = require('webpack')


let plugins = [
  new SimpleProgressWebpackPlugin(),
  new DefinePlugin({ 'process.env.NETWORK_ENV': JSON.stringify(process.env.NETWORK_ENV) }),
]

if (process.env.NETWORK_ENV !== 'mainnet-fork') {
  plugins.push(new UglifyJsPlugin({
    uglifyOptions: {
      compress: {
        drop_debugger: true,
        drop_console: process.env.NETWORK_ENV !== 'mainnet-fork',
      },
    },
  }))
}
module.exports = {
  webpack: {
    plugins,
  },
  style: {
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer')],
    },
  },
}
