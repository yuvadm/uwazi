/* eslint-disable */
'use strict';
process.env.NODE_ENV = 'production';
var path = require('path');
var webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var CompressionPlugin = require('compression-webpack-plugin');

var production = true;
var config = require('./webpack/config')(production);

config.devtool = 'cheap-module-source-map';
config.mode = 'production';
config.optimization = {
  runtimeChunk: false,
  splitChunks: {
    cacheGroups: {
      commons: {
        chunks: "initial",
        minChunks: 2,
        maxInitialRequests: 5, // The default limit is too small to showcase the effect
        minSize: 0 // This is example is too small to create commons chunks
      },
      vendor: {
        test: /node_modules/,
        chunks: "initial",
        name: "vendor",
        priority: 10,
        enforce: true
      }
    }
  },
  minimizer: [
    new UglifyJSPlugin({
      sourceMap: true,
      uglifyOptions: {
        compress: {
          inline: false
        }
      }
    })
  ],
};

config.plugins = config.plugins.concat([
  new webpack.optimize.ModuleConcatenationPlugin(),
  new webpack.optimize.OccurrenceOrderPlugin(),
  // new OptimizeCssAssetsPlugin(),
  new webpack.optimize.AggressiveMergingPlugin(),
  new webpack.DefinePlugin({ 'process.env': { NODE_ENV: JSON.stringify('production') } })
])

module.exports = config;
