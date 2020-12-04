var gulp = require("gulp");
var resizer = require('gulp-images-resizer');
var rename = require("gulp-rename");
var jeditor = require("gulp-json-editor");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var tsify = require("tsify");
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var zip = require('gulp-zip');

var fs = require('fs');
var GulpVars = JSON.parse(fs.readFileSync('./gulp-tasks/GulpVariables.json'))


var ResizeImageTasks = [];
[512,128,96,48].forEach(function(size) {
    var resizeImageTask = 'resize_' + size;
    gulp.task(resizeImageTask, function() {
      return gulp.src('src/Icon/*.*')
      .pipe(resizer({format: "png", width: size }))
      .pipe(rename('Icon' + size + '.png'))
      .pipe(gulp.dest(GulpVars.FirefoxDist + 'images/'));
    });
    ResizeImageTasks.push(resizeImageTask);
});

gulp.task('FirefoxIconResize', gulp.series(ResizeImageTasks));

gulp.task('FirefoxCopyImages', function(){
    return gulp.src('src/Images/*.*')
    .pipe(gulp.dest(GulpVars.FirefoxDist + 'images/'));
});

gulp.task("FirefoxManifest", function () {
  return gulp.src(GulpVars.FirefoxSrc+ "manifest.json")
             .pipe(jeditor(function(json) {
              json.version = GulpVars.ExtensionVersion;
              return json; // must return JSON object.
              }))
             .pipe(gulp.dest(GulpVars.FirefoxDist));
}); 

gulp.task('FirefoxBuildJs', gulp.series( 
  function () { return gulp.src('./src/*.ts').pipe(gulp.dest('./src/BuildTemp/'))},
  function () { return gulp.src('./src/Firefox/*.ts').pipe(gulp.dest('./src/BuildTemp/'))},
  function () { return browserify({
                  basedir: '.',
                  debug: true,
                  entries: ["src/BuildTemp/Main.ts"],
                  cache: {},
                  packageCache: {}
              })
              .plugin(tsify)
              .bundle()
              .pipe(source('contentscript.js'))
              .pipe(buffer())
              .pipe(sourcemaps.init({loadMaps: true}))
              .pipe(uglify())
              .pipe(sourcemaps.write('./'))
              .pipe(gulp.dest(GulpVars.FirefoxDist))}
));

gulp.task('FirefoxBuild', 
  gulp.parallel('FirefoxIconResize','FirefoxCopyImages','FirefoxManifest','FirefoxBuildJs')
  //Package
);

gulp.task('FirefoxPack', function(){
  return gulp.src(GulpVars.FirefoxDist + "*")
             .pipe(zip('Firefox.zip'))
             .pipe(gulp.dest('Packed/'))
});

gulp.task('FirefoxBuildAndPack', gulp.series(
  'FirefoxBuild',
  'FirefoxPack'
));