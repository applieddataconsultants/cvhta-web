'use strict'
let path = require('path')
let gulp = require('gulp')
let gulpif = require('gulp-if')
let prefix = require('gulp-autoprefixer')
let uncss = require('gulp-uncss')
let imagemin = require('gulp-imagemin')
let minifyCss = require('gulp-minify-css')
let minifyHtml = require('gulp-minify-html')
let sourcemaps = require('gulp-sourcemaps')
let rename = require('gulp-rename')
let less = require('gulp-less')
let jade = require('gulp-jade')
let webpack = require('webpack')
let gwebpack = require('gulp-webpack')
let browserSync = require('browser-sync').create()
let runSequence = require('run-sequence')
let fs = require('fs')
let del = require('del')

const srcPath = path.resolve(__dirname, './clientapp')
const destPath = path.resolve(__dirname, './dist')
const isProduction = process.env.NODE_ENV === 'production'

gulp.task('js', function () {
  return gulp.src(srcPath)
    .pipe(gwebpack({
      devtool: !isProduction && 'sourcemap-inline',
      entry: {
        page: './clientapp'
      },
      module: {
        loaders: [
          { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
          { test: /\.json$/, loader: 'json-loader' }
        ]
      },
      plugins: isProduction && [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': isProduction && 'production'
        }),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.DedupePlugin()
      ]
    }))
    .pipe(rename('bundle.js'))
    .pipe(gulp.dest(destPath))
    .pipe(browserSync.reload({ stream: true }))
})

gulp.task('css', function () {
  return gulp
    .src(srcPath + '/styles/index.less')
    .pipe(sourcemaps.init())
    .pipe(less({
      paths: [ path.join(__dirname, 'node_modules') ]
    }))

    // uncss
    .pipe(uncss({
      html: ['dist/index.html'],
      ignore: [ /leaflet/ ]
    }))

    // autoprefixer
    .pipe(prefix(['> 5%']))

    // minify
    .pipe(gulpif(isProduction, minifyCss()))

    // sourcemaps
    .pipe(gulpif(!isProduction, sourcemaps.write()))
    .pipe(rename('bundle.css'))
    .pipe(gulp.dest(destPath))
    .pipe(browserSync.reload({ stream: true }))
})

gulp.task('html', function () {
  let members = JSON.parse(fs.readFileSync(srcPath + '/members.json', 'utf8'))
  return gulp.src(srcPath + '/*.jade')
    .pipe(jade({ locals: { members: members }}))
    .pipe(minifyHtml())
    .pipe(gulp.dest(destPath))
    .pipe(browserSync.reload({ stream: true }))
})

gulp.task('images', function () {
  return gulp.src(srcPath + '/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest(destPath + '/images'))
})

gulp.task('clean', function (cb) {
  del('dist', cb)
})

gulp.task('watch', [ 'default' ], function () {
  browserSync.init({
    debug: true,
    port: 3000,
    server: { baseDir: './dist' },
    open: false
  })

  // watch css
  gulp.watch(srcPath + '/**/*.less', [ 'css' ])

  // watch js
  gulp.watch(srcPath + '/**/*.js', [ 'js' ])

  // watch html
  gulp.watch(srcPath + '/**/*.jade', [ 'html' ])

  // members json
  gulp.watch(srcPath + '/members.json', [ 'html' ])
})

gulp.task('default', function (cb) {
  runSequence('clean', 'html', ['js', 'css', 'images'], cb)
})