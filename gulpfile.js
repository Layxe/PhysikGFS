const gulp = require('gulp')
const babelify = require('babelify')
const browserify = require('browserify')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const minify = require('gulp-minify')

gulp.task('es6', () => {
    browserify('src/Main.js')
        .transform('babelify', {
            presets: ['env']
        })
        .bundle()
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(minify({
            ext: {
                src: '-debug.js',
                min: '.js'
            }
        }))
        .pipe(gulp.dest('build/src/js/'))
})

gulp.task('default', () => {
    gulp.watch('src/*.js', ['es6'])
    gulp.watch('src/lib/*.js', ['es6'])
})