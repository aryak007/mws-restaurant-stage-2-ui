var gulp = require('gulp');
var imageResize = require('gulp-image-resize');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var babelify = require('babelify');
var browserify = require('browserify');
var gulpSequence = require('gulp-sequence');
var clean = require('gulp-clean');
var del = require('del');
var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");
var sourcemaps = require('gulp-sourcemaps');
var connect = require('gulp-connect');
var browserSync = require('browser-sync').create();
//gulp.task('default', ['copy-original', 'create-medium', 'create-small']);

gulp.task('create-large', function () {
	gulp.src("img/**/*")
		.pipe(rename(function (path) { path.basename += "-large"; }))
		.pipe(gulp.dest("./dist/img"));
})

gulp.task('create-medium', function () {
	gulp.src("img/**/*")
		.pipe(imageResize({ width: 600 }))
		.pipe(rename(function (path) { path.basename += "-medium"; }))
		.pipe(gulp.dest("./dist/img"));
})

gulp.task('create-small', function () {
	gulp.src("img/**/*")
		.pipe(imageResize({ width: 400 }))
		.pipe(rename(function (path) { path.basename += "-small"; }))
		.pipe(gulp.dest("./dist/img"));
})




gulp.task('scripts:main', function () {
	browserify(['js/main.js', 'js/dbhelper.js'])
		.transform(babelify.configure({
			"presets": ["@babel/preset-env"]
		}))
		.bundle()
		.pipe(source('main_bundle.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(sourcemaps.write('srcmaps'))
		.pipe(gulp.dest('./dist/js'))
});



gulp.task('scripts:restaurant', function () {
	browserify(['js/restaurant_info.js', 'js/dbhelper.js'])
		.transform(babelify.configure({
			"presets": ["@babel/preset-env"]
		}))
		.bundle()
		.pipe(source('restaurant_bundle.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(sourcemaps.write('srcmaps'))
		.pipe(gulp.dest('./dist/js'))
});


gulp.task('styles:prod', function () {
	return gulp.src('./css/styles.css')
		.pipe(gulp.dest('./dist/css'))
});

// gulp.task('images:prod', function () {
// 	gulp.src('./img/*.jpg')
// 		.pipe(gulp.dest('./dist/img'));
// });


gulp.task('watch', function () {
	gulp.watch(['./service-worker.js', './js/**/*.js'], ['scripts:main', 'scripts:restaurant']);
});


gulp.task('serve', function () {
	connect.server({
		root: "./dist",
		port: 8000
	})
});

gulp.task('copy-files', function () {
	return gulp.src(['./index.html', './restaurant.html', './service-worker.js', './manifest.json'])
		.pipe(gulp.dest('./dist'));
});

gulp.task('clean', function () {
	return del('./dist/**/*', { force: true });
});

gulp.task('scripts:images', gulpSequence('create-large', 'create-medium', 'create-small'))
gulp.task('scripts:prod', gulpSequence('scripts:images', 'styles:prod', 'scripts:main', 'scripts:restaurant'));
gulp.task('build', gulpSequence('clean', 'copy-files', 'scripts:prod'));
gulp.task('default', gulpSequence('build', 'serve'))
