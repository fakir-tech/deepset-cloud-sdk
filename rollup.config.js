import typescript from '@rollup/plugin-typescript';

export default [
  // build ES modules for bundlers (webpack, rollup, ...)
  {
    input: 'src/index.ts',
    output: {
      file: 'build/deepset-cloud-sdk.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [typescript()],
  },

  // ... and umd for the rest (node, browser)
  {
    input: 'src/index.ts',
    output: {
      file: 'build/deepset-cloud-sdk.umd.cjs',
      name: 'feiertagejs',
      format: 'umd',
      noConflict: true,
      sourcemap: true,
    },
    plugins: [typescript()],
  },


];
