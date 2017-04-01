var gulp        = require('gulp')
var browserify  = require('browserify')
var babelify    = require('babelify')
var source      = require('vinyl-source-stream')
var buffer      = require('vinyl-buffer')
var uglify      = require('gulp-uglify')
var sourcemaps  = require('gulp-sourcemaps')
var browserSync = require('browser-sync').create()
var pug         = require('gulp-pug')
var sass        = require('gulp-sass')
var fs          = require('fs')
var svgSprite   = require('gulp-svg-sprite')
var postcss     = require('gulp-postcss')
var autoprefixer = require('autoprefixer')
var bourbon     = require("bourbon").includePaths
var sassGlob    = require('gulp-sass-glob')
var responsive  = require('gulp-responsive')
var watch       = require('gulp-watch')
var plumber     = require('gulp-plumber')

var responsiveConfig = {
  '*': [{
    width: 480,
    quality: 95,
    rename: {
      suffix: '-small',
      extname: '.jpg',
    },
  }, {
    width: 768,
    quality: 95,
    rename: {
      suffix: '-medium',
      extname: '.jpg',
    },
  }, {
    width: 1400,
    quality: 95,
    rename: {
      suffix: '-large',
      extname: '.jpg',
    },
  }]
}

var svgConfig = {
  mode: {
    symbol: {
      render: {
        css: false,
        scss: false
      },
      dest: '',
      sprite: 'sprite.svg',
    }
  }
}

var sassConfig = {
  includePaths: bourbon
}

gulp.task('images', function () {
  return gulp.src('src/images/*.{jpg,png}')
    .pipe(plumber())
    .pipe(responsive( responsiveConfig, {
      silent: true,
      errorOnUnusedImage: false
    } ))
    .pipe(gulp.dest('dist/images'))
})

gulp.task('pug', function () {
  return gulp.src('src/*.pug')
    .pipe(plumber())
    .pipe(pug({
      data: JSON.parse(fs.readFileSync('./src/data.json'))
    }))
    .pipe(gulp.dest('./dist'))
})

gulp.task('pug-watch', ['pug'], function (done) {
  browserSync.reload()
  done()
})

gulp.task('js', function () {
  return browserify({ entries: './src/js/main.js', debug: true })
    .transform("babelify", { presets: ["es2015"] })
    .bundle()
    .pipe(plumber())
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./dist/js'))
    .pipe(browserSync.stream())
})

gulp.task('sass', function () {
  return gulp.src("src/scss/main.scss")
    .pipe(plumber())
    .pipe(sassGlob())
    .pipe(sass( sassConfig ))
    .pipe(postcss([ autoprefixer() ]))
    .pipe(gulp.dest("dist/css"))
    .pipe(browserSync.stream())
})

gulp.task('svg', function () {
  return gulp.src('src/svg/**/*.svg')
    .pipe(plumber())
    .pipe(svgSprite( svgConfig ))
    .pipe(gulp.dest('dist/svg/'))
})

gulp.task('serve', function () {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  })

  gulp.watch("src/scss/**/*.scss", ['sass'])
  gulp.watch("src/svg/**/*.svg", ['svg'])
  gulp.watch("src/js/**/*.js", ['js'])
  gulp.watch('src/**/*.pug', ['pug-watch'])
  gulp.watch('src/data.json', ['pug-watch'])
  gulp.watch('src/images/**/*.{jpg,jpeg,png}', ['images'])
});

gulp.task('default', ['pug', 'js', 'sass', 'svg', 'images', 'serve'])


//Production
gulp.task('prod', ['sitemap', 'js:prod', 'sass:prod', 'svg', 'images'])

gulp.task('js:prod', function () {
  return browserify({ entries: './src/js/main.js', debug: false })
    .transform("babelify", { presets: ["es2015"] })
    .bundle()
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'))
})

gulp.task('sass:prod', function () {
  return gulp.src("src/scss/main.scss")
    .pipe(sassGlob())
    .pipe(sass({
      includePaths: bourbon,
      outputStyle: 'compressed'
    }))
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest("dist/css"))
})
