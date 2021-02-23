const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require('path');

module.exports = {
  entry: "./bootstrap.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bootstrap.js",
  },
  mode: "development",
  devServer: {
    clientLogLevel: 'silent',
    stats: 'minimal',
    historyApiFallback: true,
    host: 'localhost',
    disableHostCheck: true,
    watchOptions: {
      poll: true // Or you can set a value in milliseconds.
    }
  },
  plugins: [
    new CopyWebpackPlugin(['index.html'])
  ],
};
