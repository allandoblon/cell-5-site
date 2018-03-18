var gulp      = require('gulp');
var connect   = require('gulp-connect');
var condition = require('gulp-if');
var imagemin  = require('gulp-imagemin');
var prefixer  = require('gulp-autoprefixer');
var minifyCss = require('gulp-clean-css');
var scss      = require('gulp-sass');
var uglify    = require('gulp-uglify');
var useref    = require('gulp-useref');
var del       = require('del');

gulp.task('dev', function() {
    return connect.server({
        livereload: true,
        root: 'src',
        port: 8000
    });
});

gulp.task('production', function() {
    return connect.server({
        livereload: true,
        root: 'build',
        port: 9000
    });
});

gulp.task('css', function() {
    return gulp.src('src/scss/app.scss')
        .pipe(scss({outputStyle: 'compressed'}).on('error', scss.logError))
        .pipe(prefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('src/css'))
        .pipe(connect.reload());
});

gulp.task('html', function() {
    return gulp.src('src/*.html')
    	.pipe(connect.reload());
});

gulp.task('js', function() {
    return gulp.src('src/js/*.js')
    	.pipe(connect.reload());
});

gulp.task('watch', function() {
	gulp.watch(['src/scss/**/*.scss'], ['css']);
    gulp.watch(['src/*.html'], ['html']);
    gulp.watch(['src/js/*.js'], ['js']);
});

gulp.task('images', function() {
    return gulp.src('src/img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('build/img'));
});

gulp.task('fa:webfonts', function() {
    return gulp.src('src/vendor/fontawesome/web-fonts-with-css/webfonts/**/*')
        .pipe(gulp.dest('build/webfonts'));
});

gulp.task('slick:fonts', function() {
    return gulp.src('src/vendor/slick-carousel/slick/fonts/**/*')
        .pipe(gulp.dest('build/css/fonts'));
});

gulp.task('favicon', function() {
    return gulp.src('src/favicon.ico')
        .pipe(gulp.dest('build'));
});

gulp.task('compile', function() {
    return gulp.start('css', function() {
        return gulp.src('src/*.html')
            .pipe(useref())
            .pipe(condition('*.js', uglify()))
            .pipe(condition('*.css', minifyCss()))
            .pipe(gulp.dest('build'));
    });
});

gulp.task('clean:src', function() {
    return del([
        'src/css',
        'src/vendor'
    ]);
});

gulp.task('default', ['css', 'dev', 'watch']);
gulp.task('build', ['compile', 'images', 'fa:webfonts', 'slick:fonts', 'favicon']);
// gulp.task('build', ['compile', 'images', 'production']);