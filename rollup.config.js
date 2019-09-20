import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import pkg from "./package.json";

export default {
  input: "src/index.ts",
  external: [...Object.keys(pkg.dependencies)],
  plugins: [
    typescript({ tsconfig: "./src/tsconfig.json" }),
    resolve(),
    commonjs({ extensions: [".js", ".ts"] }),
    terser({
      // Disable name mangling as chevrotain relies on symbol name to properly works
      // See https://github.com/SAP/chevrotain/blob/master/examples/webpack/README.md
      mangle: false
    })
  ],
  output: [
    { name: "fenix-cron", file: pkg.main, format: "cjs" },
    { name: "fenix-cron", file: pkg.module, format: "es" },
    {
      name: "fenix-cron",
      file: pkg.browser,
      format: "umd",
      globals: {
        chevrotain: "chevrotain",
        _: "lodash-es"
      }
    }
  ]
};
