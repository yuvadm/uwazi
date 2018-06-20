/* eslint-disable import/no-extraneous-dependencies */
import AssetsPlugin from 'assets-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';

import CleanPlugin from './CleanPlugin.js';

const rootPath = `${__dirname}/../`;
const assetsPluginInstance = new AssetsPlugin({ path: path.join(`${rootPath}/dist/`) });


module.exports = (production) => {
  const devMode = !production;

  let jsChunkHashName = '';

  if (production) {
    jsChunkHashName = '.[chunkhash]';
  }

  return {
    mode: 'development',
    entry: {
      main: path.join(rootPath, 'app/react/index.js'),
      'pdf.worker': path.join(rootPath, 'node_modules/pdfjs-dist/build/pdf.worker.entry'),
    },
    output: {
      path: path.join(rootPath, '/dist/'),
      publicPath: '/',
      filename: `[name]${jsChunkHashName}.js`
    },
    resolveLoader: {
      modules: ['node_modules', `${__dirname}/webpackLoaders`],
      extensions: ['.js', '.json'],
      mainFields: ['loader', 'main']
    },
    module: {
      rules: [
        {
          test: /world-countries/,
          loader: 'country-loader'
        },
        {
          test: /\.js$/,
          loader: `babel-loader${devMode ? '?cacheDirectory' : ''}`,
          include: path.join(rootPath, 'app'),
          exclude: /node_modules/
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader',
          ],
          include: [
            path.join(rootPath, 'app'),
            path.join(rootPath, 'node_modules/')
          ]
        },
        {
          test: /\.(jpe?g|png|eot|woff|woff2|ttf|gif|svg)(\?.*)?$/i,
          loaders: ['url-loader', 'img-loader'],
          include: [
            path.join(rootPath, 'public'),
            path.join(rootPath, 'app'),
            path.join(rootPath, 'node_modules/react-widgets/lib/fonts/'),
            path.join(rootPath, 'node_modules/font-awesome/fonts/'),
            path.join(rootPath, 'node_modules/react-widgets/lib/img/'),
            path.join(rootPath, 'node_modules/pdfjs-dist/web/images/'),
            path.join(rootPath, 'node_modules/pdfjs-dist/web/images/'),
            path.join(rootPath, 'node_modules/bootstrap/dist/fonts/')
          ]
        }
      ]
    },
    plugins: [
      new CleanPlugin(`${__dirname}/../dist/`),
      new MiniCssExtractPlugin({
        filename: devMode ? '[name].css' : '[name].[hash].css',
        chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
      }),
      assetsPluginInstance
    ]
  };
};
