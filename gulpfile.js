const gulp = require('gulp');
const exec = require('child_process').exec;
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');

const jsFiles = [
  'themes/inbeat/assets/js/main.js',
  'themes/inbeat/assets/js/beehiivAPI.js',
];

// hugo production call
gulp.task("hugo", (cb) => {
  exec('hugo --cleanDestinationDir', (err, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('sass', () => (
  gulp.src('themes/inbeat/assets/scss/main.scss')
    .pipe(sourcemaps.init())
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(rename('main.min.css'))
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest('themes/inbeat/static/css'))
));

gulp.task('sass-article', () => (
  gulp.src('themes/inbeat/assets/scss/article-main.scss')
    .pipe(sourcemaps.init())
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(rename('article-main.min.css'))
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest('themes/inbeat/static/css'))
));

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

gulp.task("watch-article", (done) => {
  gulp.watch('themes/inbeat/assets/scss/**/*.scss', gulp.series('sass-article'));
  gulp.watch('themes/inbeat/assets/js/**/*.js', gulp.series('scripts'));
  done();
});

// Use browsersync to share the project in local
gulp.task("sync", () => browserSync.init({
  proxy: "http://localhost:1313/"
}));

gulp.task("dev", gulp.series('watch'));
gulp.task("prod", gulp.series('hugo'));
