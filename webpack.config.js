const path = require("path");
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
    extensions: [".ts", ".js"],
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },
  module: {
    rules: [
      {
        test: /.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "thread-loader",
            options: {
              workers: require("os").cpus().length - 1
            }
          },
          {
            loader: "ts-loader",
            options: {
              happyPackMode: true
            }
          }
        ]
      }
    ]
  },
  plugins: [new CheckerPlugin({ checkSyntacticErrors: true })]
};
