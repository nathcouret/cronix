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
      mangle: true
    })
  ],
  output: [
    { name: "cronix", file: pkg.main, format: "cjs" },
    { name: "cronix", file: pkg.module, format: "es" },
    {
      name: "cronix",
      file: pkg.browser,
      format: "umd",
      globals: {
        chevrotain: "chevrotain",
        tslib: "tslib"
      }
    }
  ]
};
