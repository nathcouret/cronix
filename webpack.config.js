const path = require("path");
const CheckerPlugin = require("fork-ts-checker-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { cronTokens, quartzTokens, jenkinsTokens } = require(path.resolve(__dirname, "./dist/lexer"));

const allTokens = [cronTokens, quartzTokens, jenkinsTokens]
  .map(tokens => tokens.map(t => t.name))
  .reduce((acc, curr) => {
    curr.forEach(token => {
      if (acc.indexOf(token.name) === -1) {
        acc.concat(token.name);
      }
    });
    return acc;
  }, []);

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
            loader: "ts-loader",
            options: {
              transpileOnly: true
            }
          }
        ]
      }
    ]
  },
  plugins: [new CheckerPlugin({ checkSyntacticErrors: true })],
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          mangle: {
            reserved: allTokens
          }
        }
      })
    ]
  }
};
