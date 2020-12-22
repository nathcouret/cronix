import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";
import pkg from "./package.json";

export default {
  input: "src/index.ts",
  external: [...Object.keys(pkg.dependencies)],
  plugins: [
    typescript(),
    terser()
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
