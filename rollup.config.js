import typescript from "rollup-plugin-typescript2"
import commonjs from "@rollup/plugin-commonjs"
import external from "rollup-plugin-peer-deps-external"
import resolve from "@rollup/plugin-node-resolve"
import pkg from './package.json'
import postcss from 'rollup-plugin-postcss';
import  { terser } from 'rollup-plugin-terser'
export default {
  input: "src/index.tsx",
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true
    },
    {
      file: pkg.module,
      format: "es",
      exports: 'named',
      sourcemap: true
    }
  ],
  plugins: [
    postcss({
      extract: true,
      extensions: ['.less', '.css'],
      inject: true
    }),
    external['react', '@rooks/use-boundingclientrect', 'react-dom'],
    resolve(),
    typescript({
      rollupCommonJSResolveHack: true,
      exclude: "**/__tests__/**",
      clean: true
    }),
    commonjs({
      include: ["node_modules/**"],
      namedExports: {
        'node_modules/react/index.js': ['useRef', 'useCallback', 'useState', 'createElement', 'Fragment', 'useEffect']
      }
    }),
    terser()
  ]
}