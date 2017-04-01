import gulp from 'gulp'
import fs from 'fs'
import browserify from 'browserify'
import babelify from 'babelify'
import source from 'vinyl-source-stream'
import buffer from 'vinyl-buffer'
import uglify from 'gulp-uglify'
import sourcemaps from 'gulp-sourcemaps'
import browserSync from 'browser-sync'
import pug from 'gulp-pug'
import sass from 'gulp-sass'
import svgSprite from 'gulp-svg-sprite'
import postcss from 'gulp-postcss'
import autoprefixer from 'autoprefixer'
import bourbon from 'bourbon'
import sassGlob from 'gulp-sass-glob'
import watch from 'gulp-watch'
import plumber from 'gulp-plumber'
import imagemin from 'gulp-imagemin'
import eslint from 'gulp-eslint'

browserSync.create()

const svgConfig = {
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

const sassConfig = {
  includePaths: bourbon.includePaths
}

gulp.task('images', () => 
  gulp.src('src/images/*.{jpg,png,gif}')
    .pipe(plumber())
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'))
)

gulp.task('pug', () => 
  gulp.src('src/*.pug')
    .pipe(plumber())
    .pipe(pug({
      data: JSON.parse(fs.readFileSync('./src/data.json'))
    }))
    .pipe(gulp.dest('./dist'))
)

gulp.task('pug-watch', ['pug'], (done) => {
  browserSync.reload()
  done()
})

gulp.task('lint', () => 
  gulp.src('src/js/main.js')
    .pipe(eslint())
    .pipe(eslint.format())
)

gulp.task('js', ['lint'], () => 
  browserify({ entries: './src/js/main.js', debug: true })
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
)

gulp.task('sass', () => 
  gulp.src("src/scss/main.scss")
    .pipe(plumber())
    .pipe(sassGlob())
    .pipe(sass(sassConfig))
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest("dist/css"))
    .pipe(browserSync.stream())
)

gulp.task('svg', () => 
  gulp.src('src/svg/**/*.svg')
    .pipe(plumber())
    .pipe(svgSprite(svgConfig))
    .pipe(gulp.dest('dist/svg/'))
)

gulp.task('serve', () => {
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

gulp.task('js:prod', () => 
  browserify({ entries: './src/js/main.js', debug: false })
    .transform("babelify", { presets: ["es2015"] })
    .bundle()
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'))
)

gulp.task('sass:prod', () => 
  gulp.src("src/scss/main.scss")
    .pipe(sassGlob())
    .pipe(sass({
      includePaths: bourbon.includePaths,
      outputStyle: 'compressed'
    }))
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest("dist/css"))
)
