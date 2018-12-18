const path = require("path");
const HappyPack = require("happypack");
const CheckerPlugin = require("fork-ts-checker-webpack-plugin");

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
        exclude: /node_modules/,
        loader: "happypack/loader?id=ts"
      }
    ]
  },
  plugins: [
    new HappyPack({
      id: "ts",
      threads: require('os').cpus().length - 1,
      loaders: [
        {
          path: "ts-loader",
          query: { happyPackMode: true }
        }
      ]
    }),
    new CheckerPlugin({ checkSyntacticErrors: true })
  ]
};
