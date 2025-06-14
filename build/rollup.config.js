import { defineConfig } from 'rollup';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import { babel } from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';
import html from '@rollup/plugin-html';
import copy from 'rollup-plugin-copy';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

const production = !process.env.ROLLUP_WATCH;

export default defineConfig({
  input: 'src/main.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
    name: 'AILifePlatform',
    sourcemap: !production
  },
  plugins: [
    // Resolve node modules
    resolve({
      browser: true,
      preferBuiltins: false
    }),
    
    // Convert CommonJS modules to ES6
    commonjs(),
    
    // Babel transpilation
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      presets: [
        ['@babel/preset-env', {
          targets: {
            browsers: ['> 1%', 'last 2 versions']
          }
        }]
      ]
    }),
    
    // Process CSS
    postcss({
      extract: true,
      minimize: production,
      sourceMap: !production,
      plugins: [
        require('autoprefixer')
      ]
    }),
    
    // Generate HTML file
    html({
      template: ({ files }) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title>AI Life - Complete Optimization Platform</title>
    <meta name="theme-color" content="#667eea">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    ${files.css ? files.css.map(css => `<link rel="stylesheet" href="${css.fileName}">`).join('\n    ') : ''}
</head>
<body>
    <div id="app"></div>
    ${files.js ? files.js.map(js => `<script src="${js.fileName}"></script>`).join('\n    ') : ''}
</body>
</html>
      `
    }),
    
    // Copy static assets
    copy({
      targets: [
        { src: 'src/assets/**/*', dest: 'dist/assets' }
      ]
    }),
    
    // Minify in production
    production && terser({
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }),
    
    // Development server
    !production && serve({
      open: true,
      contentBase: 'dist',
      host: 'localhost',
      port: 3000
    }),
    
    // Live reload in development
    !production && livereload('dist')
  ].filter(Boolean),
  
  watch: {
    clearScreen: false
  }
});

// Alternative configuration for multiple entry points
export const multiEntryConfig = defineConfig({
  input: {
    main: 'src/main.js',
    fusionEngine: 'src/fusion-engine.js',
    sensorsManager: 'src/sensors-manager.js',
    conversationEngine: 'src/conversation-engine.js'
  },
  output: {
    dir: 'dist',
    format: 'es',
    sourcemap: !production,
    entryFileNames: '[name].[hash].js',
    chunkFileNames: '[name].[hash].js'
  },
  plugins: [
    resolve({
      browser: true,
      preferBuiltins: false
    }),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**'
    }),
    postcss({
      extract: 'styles.css',
      minimize: production
    }),
    production && terser()
  ].filter(Boolean)
});

// Configuration for library build
export const libraryConfig = defineConfig({
  input: 'src/lib/index.js',
  output: [
    {
      file: 'dist/ai-life-platform.cjs.js',
      format: 'cjs',
      exports: 'auto'
    },
    {
      file: 'dist/ai-life-platform.esm.js',
      format: 'es'
    },
    {
      file: 'dist/ai-life-platform.umd.js',
      format: 'umd',
      name: 'AILifePlatform',
      globals: {
        // Define any global dependencies here
      }
    }
  ],
  external: [
    // List external dependencies that shouldn't be bundled
  ],
  plugins: [
    resolve(),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**'
    }),
    production && terser()
  ].filter(Boolean)
});