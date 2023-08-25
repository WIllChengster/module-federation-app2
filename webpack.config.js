const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');

module.exports = {
  entry: './src/index',
  mode: 'development',
  devServer: {
    server: 'https',
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    allowedHosts: ['mydevbox.chromeriver.com', 'chromeriver.com'],
    port: 3002,
    client: {
      progress: true,
      webSocketURL: 'wss://localhost:9000/ws',
    },
  },
  output: {
    publicPath: 'auto',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['@babel/preset-react'],
        },
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'app2',
      library: { type: 'var', name: 'app2' },
      filename: 'remoteEntry.js',
      exposes: {
        './Button': './src/Button',
        './logger': './src/logger',
      },
      shared: {
        react: {
          singleton: true,
          eager: true,
          requiredVersion: '17.0.2',
        },
        'react-dom': {
          singleton: true,
          eager: true,
          requiredVersion: '17.0.2',
        }
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};