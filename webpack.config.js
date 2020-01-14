const path = require('path');

module.exports = function(env={}) {
  const dev = env.dev;

  return {
    mode: dev ? 'development' : 'production',
    entry: ['@babel/polyfill','./src/index.js'],
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: dev ? 'axios.js' : 'axios.min.js',
      sourceMapFilename: dev ? 'axios.map' : 'axios.min.map',
      libraryTarget: 'umd',
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.js$/i,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
      ],
    },
    devServer: {
      port: 8000,
      open: true,
    },
  };
};
