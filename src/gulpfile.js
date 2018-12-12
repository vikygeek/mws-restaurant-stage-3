var gulp = require('gulp');
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var terser = require('gulp-terser');
var responsive = require('gulp-responsive');
var clean = require('gulp-clean');

gulp.task('default',['styles'],function(){
	gulp.watch('./css/*.css').on('change', browserSync.reload);
	gulp.watch('./js/*.js').on('change', browserSync.reload);
	gulp.watch('./*.html').on('change', browserSync.reload);
	browserSync.init({
		server: './'
	});
})

// gulp.task('default', function () {
//     return gulp.src('./res_img', {read: false})
//         .pipe(clean());
// });

// gulp.task('default', function () {
// 	return gulp.src('./img/*.jpg')
// 	  .pipe(responsive({
// 		'*.jpg': [
// 			{
// 				quality:20,
// 				width:480,
// 				rename: {
// 					suffix: '-480',
// 					extname: '.jpg',
// 				}
// 			},{
// 				quality:40,
// 				width:800,
// 				rename: {
// 					suffix: '-800',
// 					extname: '.jpg',
// 				}
// 			}
// 		]
// 	  }))
// 	  .pipe(gulp.dest('./res_img'));
// });

gulp.task('styles', function(){
    gulp.src('css/**/*.css')
	    .pipe(concat('styles.css'))
	    .pipe(cleanCSS())
	    .pipe(autoprefixer('last 2 versions'))
	    .pipe(gulp.dest('css'))
});

gulp.task('scripts', function() {
	gulp.src('js/**/*.js')
	.pipe(terser())
		.pipe(gulp.dest('js'));
});