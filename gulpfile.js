const gulp = require('gulp');
const imagemin = require("gulp-imagemin");
const imageresize = require('gulp-image-resize');
const parallel = require("concurrent-transform");
var runSequence = require('run-sequence');
var del = require('del');
var exec = require('child_process').exec;
var newer = require('gulp-newer');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync').create();

// image resizing variables
const imagexl = 2620;
const imagefull = 2000;
const imagehalf = 1024;
const imagequart = 600;
const imagemobile = 400;
const imageload = 30;
const jsFiles = [
  'themes/inbeat/assets/js/theme/jquery-2.1.4.min.js',
];
const jsFilesUI = [
  'themes/inbeat/assets/js/theme/jquery-2.1.4.min.js',
];
const jsDest = 'themes/inbeat/static/js';

 
// resize and optimize images
gulp.task("image-resize", () => {
  return gulp.src("themes/inbeat/source-images/*.{jpg,png,jpeg,JPG}")
    .pipe(newer("themes/inbeat/static/img"))
    // .pipe(imagemin())
    .pipe(imageresize({ width: imagexl}))
    .pipe(gulp.dest("themes/inbeat/static/xl/img"))
    .pipe(imageresize({ width: imagefull }))
    .pipe(gulp.dest("themes/inbeat/static/img"))
    .pipe(imageresize({ width: imagehalf }))
    .pipe(gulp.dest("themes/inbeat/static/half/img"))
    .pipe(imageresize({ width: imagequart }))
    .pipe(gulp.dest("themes/inbeat/static/quart/img"))
    .pipe(imageresize({ width: imagemobile }))
    .pipe(gulp.dest("themes/inbeat/static/mobile/img"))
    .pipe(imageresize({ width: imageload }))
    .pipe(gulp.dest("themes/inbeat/static/load/img"));
});

// hugo production call
gulp.task("hugo", function (cb) {
  exec('hugo --cleanDestinationDir', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('sass', function () {
  return gulp.src('themes/inbeat/assets/scss/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(rename('main.min.css'))
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest('themes/inbeat/static/css'));
});

gulp.task('scripts-normal', function() {
    return gulp.src(jsFiles)
        .pipe(sourcemaps.init())
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest(jsDest));
});

gulp.task('scripts-ui', function() {
    return gulp.src(jsFilesUI)
        .pipe(sourcemaps.init())
        .pipe(concat('main-with-ui.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest(jsDest));
});

gulp.task('scripts', ['scripts-normal', 'scripts-ui']);

// watching
gulp.task("watch", function() {

  browserSync.init({
      proxy: "http://localhost:1313/"
  });

  gulp.watch('themes/inbeat/source-images/*.{jpg,png,jpeg,gif}', ['image-resize'] );
  gulp.watch('themes/inbeat/assets/scss/**/*.scss', ['sass']);
  gulp.watch('themes/inbeat/assets/js/**/*.js', ['scripts']);
});

// watching images and resizing
gulp.task("dev",  function(callback) {
  runSequence('image-resize',
              'watch');
});

// optimizing images and calling hugo for production
gulp.task("prod",  function(callback) {
  runSequence('image-resize',
              'hugo');
});
