var gulp = require('gulp');
var imageResize = require('gulp-image-resize');
var rename = require('gulp-rename');

gulp.task('default',['copy-original','create-medium','create-small']);

gulp.task('copy-original',function(){
	gulp.src("img/**/*")
	.pipe(rename(function (path) { path.basename += "-large"; }))
	.pipe(gulp.dest("dist"));
})

gulp.task('create-medium',function(){
	gulp.src("img/**/*")
	    .pipe(imageResize({ width : 600 }))
	    .pipe(rename(function (path) { path.basename += "-medium"; }))
	    .pipe(gulp.dest("dist"));
})

gulp.task('create-small',function(){
	gulp.src("img/**/*")
	    .pipe(imageResize({ width : 400 }))
	    .pipe(rename(function (path) { path.basename += "-small"; }))
	    .pipe(gulp.dest("dist"));
})
