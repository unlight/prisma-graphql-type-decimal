import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts'],
  platform: 'node',
  dts: true,
  clean: true,
  format: ['esm'],
  outDir: 'dist',
  fixedExtension: false,
})
