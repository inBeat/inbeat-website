const gulp = require('gulp');
var exec = require('child_process').exec;
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync').create();

const jsFiles = [
  // 'themes/inbeat/assets/js/theme/jquery-2.1.4.min.js',
];

// hugo production call
gulp.task("hugo", (cb) => {
  exec('hugo --cleanDestinationDir', (err, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('sass', () => gulp.src('themes/inbeat/assets/scss/main.scss')
  .pipe(sourcemaps.init())
  .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
  .pipe(rename('main.min.css'))
  .pipe(sourcemaps.write('maps'))
  .pipe(gulp.dest('themes/inbeat/static/css'))
);

gulp.task('scripts', () => gulp.src(jsFiles)
  .pipe(sourcemaps.init())
  .pipe(concat('main.min.js'))
  .pipe(uglify())
  .pipe(sourcemaps.write('maps'))
  .pipe(gulp.dest('themes/inbeat/static/js'))
);

// Watch for changes and rebuild the assets
gulp.task("watch", (done) => {
  gulp.watch('themes/inbeat/assets/scss/**/*.scss', gulp.series('sass'));
  gulp.watch('themes/inbeat/assets/js/**/*.js', gulp.series('scripts'));
  done();
});

// Use browsersync to share the project in local
gulp.task("sync", () => browserSync.init({
  proxy: "http://localhost:1313/"
}));

gulp.task("dev", gulp.series('watch'));
gulp.task("prod", gulp.series('hugo'));
