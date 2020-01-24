'use strict';

const gulp 			= require('gulp'),
      babel         = require('gulp-babel'),
      postcss       = require('gulp-postcss'),
      autoprefixer 	= require('autoprefixer'),
      mqpacker      = require("mqpacker"),
      sortCSSmq     = require('sort-css-media-queries'),
	  sass 			= require('gulp-sass'),
      cleanCSS 		= require('gulp-clean-css'),
      htmlhint      = require("gulp-htmlhint"),
      uglify 	    = require('gulp-uglify'),
      jsonminify 	= require('gulp-jsonminify'),
      sourcemaps    = require('gulp-sourcemaps'),
	  browserSync 	= require("browser-sync");

const path = {
    build: {
        html: 'build/',
        style: 'build/css',
        js: 'build/js/',
        json: 'build/js/'
    },
    src: {
        html: 'src/*.html',
        style: 'src/sass/index.scss',
		js: 'src/js/*.js',
        json: 'src/js/*.json'
    },
    watch: {
        html: 'src/**/*.html',
        style: 'src/sass/**/*.scss',
        js: 'src/js/**/*.js',
        json: 'src/js/**/*.json'
    },
    clean: './build'
};

const config = {
    server: {
        baseDir: "./build"
    },
    notify: false
};

gulp.task('browser-sync', function () {
    browserSync(config);
});

gulp.task('html', function () {
    return gulp.src(path.src.html)
        .pipe(sourcemaps.init())
            .pipe(htmlhint())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.html))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('css', function () {
    let plugins = [
        autoprefixer(
            {
                cascade: false
            }
        ),
        mqpacker({
            sort: sortCSSmq.desktopFirst
        })
    ];

    return gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(plugins))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.style))
        .pipe(browserSync.stream());
});

gulp.task('js', function () {
    return gulp.src(path.src.js)
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('json', function () {
    return gulp.src(path.src.json)
        .pipe(sourcemaps.init())
        .pipe(jsonminify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.json))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('watch', function(){
    gulp.watch(path.watch.html, gulp.parallel('html'));
    gulp.watch(path.watch.style, gulp.parallel('css'));
    gulp.watch(path.watch.js, gulp.parallel('js'));
    gulp.watch(path.watch.json, gulp.parallel('json'));
});

gulp.task('default', gulp.parallel('html', 'css', 'js', 'json', 'browser-sync', 'watch'));
