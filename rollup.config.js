import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import filesize from 'rollup-plugin-filesize'
import json from 'rollup-plugin-json'

import pkg from './package.json'

// Abort if NODE_ENV hasn't been specified
if (process.env.NODE_ENV !== 'production') {
  throw new Error('`NODE_ENV` must be production to build.')
}

/**
 * Return an array of with dependencies and peerDependencies of the packages passed
 * @param {Object} key - field in package
 * @return {Array} return an array with dependencies and peerDependencies from the package
 */
const getDependencies = key => (key in pkg ? Object.keys(pkg[key]) : [])

/**
 * List of unique peerDependencies and dependencies from all packages
 * @type {Set}
 */
const dependencies = new Set([...getDependencies('peerDependencies')])

console.log('Bundling:', getDependencies('dependencies'))
console.log('External Dependencies:', getDependencies('peerDependencies'))

export default {
  input: 'src/slack-feedback.js',
  output: [
    {
      format: 'es',
      file: pkg.module,
      sourcemap: true
    },
    {
      format: 'cjs',
      file: pkg.main,
      sourcemap: true
    }
  ],
  plugins: [
    resolve({
      customResolveOptions: {
        moduleDirectory: 'node_modules'
      }
    }),
    json(),
    babel({
      exclude: ['node_modules/**']
    }),
    commonjs(),
    terser(),
    filesize()
  ],
  external: [...dependencies]
}
