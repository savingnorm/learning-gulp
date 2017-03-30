var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var sourcemaps = require('gulp-sourcemaps');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');

gulp.task('clean:dist', function(){
	return del.sync('dist');
})

gulp.task('build', function(callback){
	runSequence('clean:dist', ['sass', 'useref', 'imagemin', 'fonts'],
		callback
		)
})

gulp.task('fonts', function(){
	return gulp.src('app/fonts/**/*')
		.pipe(gulp.dest('dist'))
});


gulp.task('imagemin', function(){
	gulp.src(['app/images/**/*.+(jpg|png|svg|gif|jpeg)'])
	.pipe(cache(imagemin([
		imagemin.jpegtran({progressive: true}),
		imagemin.svgo({plugins:[{removeViewBox: true}]}),
		imagemin.gifsicle({interlaced: true}),
		imagemin.optipng({optimizationLevel: 5})
		])))
	.pipe(gulp.dest('dist/images'))
});


// var minCss = require('gulp-minify-css');

// gulp.task('minCss', function(){
// 	gulp.src(['app/css/mycss/**/*.css'])
// 		.pipe(minCss())
// 		.pipe(gulp.dest('minDist'))
// });

gulp.task('default', function(callback){
	runSequence(['sass','browserSync','watch'],
		callback
	)
});


gulp.task('useref', function(){
	return gulp.src('app/*.html')
		.pipe(sourcemaps.init())
		.pipe(useref())
		.pipe(gulpIf('*.js', uglify()))
		.pipe(gulpIf('*.css', cssnano()))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('dist'))
		.pipe(browserSync.stream())
});


gulp.task('sass', function(){
	return gulp.src('app/scss/**/*.scss')
		.pipe(sass())
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({
			stream: true
		}))

});


gulp.task('watch', ['browserSync','sass','useref'], function(){
	gulp.watch('app/scss/**/*.scss',['sass']);
	gulp.watch('app/css/**/*.css',['useref']);
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/js/**/*.js', browserSync.reload);

});


gulp.task('browserSync', function(){
	browserSync.init({
		server: {
			baseDir: 'app'
		},
	})

	//can add gulp.watch here

})