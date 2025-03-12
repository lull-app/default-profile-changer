import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/server/server-main.ts",
  output: {
    file: "dist/server.js",
    format: "esm",
    sourcemap: true
  },
  external: ['express', 'cors', '@elgato/streamdeck'], // Don't bundle these
  plugins: [
    typescript({
      tsconfig: "tsconfig.server.json"
    }),
    nodeResolve({
      preferBuiltins: true
    }),
    commonjs()
  ]
};