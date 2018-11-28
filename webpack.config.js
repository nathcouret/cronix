const webpack = require("webpack");
const path = require("path");

module.exports = {
  mode: "production",
  entry: "./index.ts",
  target: "node",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "fenix-cron.js",
    library: "fenix-cron",
    libraryTarget: "umd"
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  module: {
    rules: [
      {
        test: /.ts$/,
        loader: "awesome-typescript-loader"
      }
    ]
  }
};
