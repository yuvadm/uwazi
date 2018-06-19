/* eslint-disable */
'use strict';

var config = require('./webpack/config')();
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");

const smp = new SpeedMeasurePlugin();

config.context = __dirname;

module.exports = smp.wrap(config);
