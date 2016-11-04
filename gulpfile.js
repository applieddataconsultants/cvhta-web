const path = require('path')
const gulp = require('gulp')
const gulpif = require('gulp-if')
const prefix = require('gulp-autoprefixer')
const uncss = require('gulp-uncss')
const minifyCss = require('gulp-minify-css')
const minifyHtml = require('gulp-minify-html')
const sourcemaps = require('gulp-sourcemaps')
const rename = require('gulp-rename')
const less = require('gulp-less')
const jade = require('gulp-jade')
const webpack = require('webpack')
const gwebpack = require('gulp-webpack')
const browserSync = require('browser-sync').create()
const runSequence = require('run-sequence')
const fs = require('fs')
const del = require('del')
const merge = require('merge-stream')
const gutil = require('gulp-util')

const srcPath = path.resolve(__dirname, './clientapp')
const destPath = path.resolve(__dirname, './dist')
const isProduction = process.env.NODE_ENV === 'production'

/**
 * Task: Generates dist/bundle.js
 */
gulp.task('js', function() {
  return gulp.src(srcPath)
    .pipe(gwebpack({
      // Add source maps
      devtool: !isProduction && 'sourcemap-inline',
      entry: {page: './clientapp'},
      module: {
        loaders: [
          {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
          {test: /\.json$/, loader: 'json-loader'},
        ],
      },
      plugins: isProduction && [
        new webpack.DefinePlugin({'process.env.NODE_ENV': isProduction && 'production'}),
        // Compress and mangle
        new webpack.optimize.UglifyJsPlugin(),
        // Remove any dups
        new webpack.optimize.DedupePlugin(),
      ],
    }))
    .pipe(rename('bundle.js'))
    .pipe(gulp.dest(destPath))
    .pipe(browserSync.reload({stream: true}))
})

/**
 * Task: Generates dist/bundle.css
 */
gulp.task('css', function() {

  const error = function(er) {
    gutil.log(er)
    this.emit('end')
  }

  return gulp
    .src(srcPath + '/styles/index.less')
    .pipe(sourcemaps.init())
    .pipe(less({paths: [path.join(__dirname, 'node_modules')]}))
    .on('error', error)

    // Remove unused CSS rules
    .pipe(uncss({
      html: ['dist/index.html', 'dist/media.html'],
      ignore: [/leaflet/, /cvhta/, /container/],
    }))

    // Add vendor prefixes
    .pipe(prefix(['> 5%']))

    // Minify CSS
    .pipe(gulpif(isProduction, minifyCss()))

    // Add source maps
    .pipe(gulpif(!isProduction, sourcemaps.write()))
    .pipe(rename('bundle.css'))
    .pipe(gulp.dest(destPath))
    .pipe(browserSync.reload({stream: true}))
})

/**
 * Task: Generates dist/index.html
 */
gulp.task('html', function() {
  const members = JSON.parse(fs.readFileSync(srcPath + '/members.json', 'utf8'))
  const partners = JSON.parse(fs.readFileSync(srcPath + '/partners.json', 'utf8'))

  // Sort members alphabetically
  members.features.sort(function(a, b) {
    return a.properties.name > b.properties.name ? 1 : -1
  })
  partners.features.sort(function(a, b) {
    return a.properties.name > b.properties.name ? 1 : -1
  })

  return gulp.src(srcPath + '/*.jade')
    .pipe(jade({locals: {members: members, partners: partners}}))
    .pipe(minifyHtml())
    .pipe(gulp.dest(destPath))
    .pipe(browserSync.reload({stream: true}))
})

/**
 * Task: Generates dist/images/*
 */
gulp.task('images', function() {
  const favicon = gulp.src(srcPath + '/favicon.ico')
    .pipe(gulp.dest(destPath))

  const images = gulp.src(srcPath + '/images/*')
    .pipe(gulp.dest(destPath + '/images'))

  return merge(favicon, images)
})

/**
 * Task: Cleans dist directory
 */
gulp.task('clean', function(cb) {
  del('dist', cb)
})

/**
 * Task: Starts a development server with hot reloading
 */
gulp.task('watch', ['default'], function() {
  browserSync.init({
    debug: true,
    port: 3000,
    server: {baseDir: './dist'},
    open: false,
  })

  // Watch CSS
  gulp.watch(srcPath + '/**/*.less', ['css'])

  // Watch JS
  gulp.watch(srcPath + '/**/*.js', ['js'])

  // Watch HTML
  gulp.watch(srcPath + '/**/*.jade', ['html'])

  // Watch members JSON
  gulp.watch(srcPath + '/members.json', ['html'])
})

/**
 * Task: Builds dist
 */
gulp.task('default', function(cb) {
  runSequence('clean', 'html', ['js', 'css', 'images'], cb)
})
