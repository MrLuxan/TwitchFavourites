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
var replace = require('gulp-replace');

var fs = require('fs');
var GulpVars = JSON.parse(fs.readFileSync('./gulp-tasks/GulpVariables.json'))


var ResizeImageTasks = [];
[128,48,16].forEach(function(size) {
    var resizeImageTask = 'resize_' + size;
    gulp.task(resizeImageTask, function() {
      return gulp.src('src/Icon/*.*')
      .pipe(resizer({format: "png", width: size }))
      .pipe(rename('Icon' + size + '.png'))
      .pipe(gulp.dest(GulpVars.ChromeDist + 'images/'));
    });
    ResizeImageTasks.push(resizeImageTask);
});

gulp.task('ChromeIconResize', gulp.series(ResizeImageTasks));

gulp.task('ChromeCopyImages', function(){
    return gulp.src('src/Images/*.*')
    .pipe(gulp.dest(GulpVars.ChromeDist + 'images/'));
});


gulp.task("ChromeManifest", function () {
  return gulp.src(GulpVars.ChromeSrc+ "manifest.json")
             .pipe(jeditor(function(json) {
              json.version = GulpVars.ExtensionVersion;
              return json; // must return JSON object.
              }))
             .pipe(gulp.dest(GulpVars.ChromeDist));
});


var CopyInHtmlTasks = [];
var insertFiles = {FavouriteList : ['FavouriteList','FavouriteButtonSvgFilled','SideBarIconTooltip'],
                   FavouriteItem : ['FavouriteItem','SideBarOnlineTooltip','SideBarOfflineTooltip'],
                   FavouriteButton : ['FavouriteButton','FavouriteButtonPopup','FavouriteButtonSvg','FavouriteButtonSvgFilled']};
for (const file in insertFiles) {
  insertFiles[file].forEach(htmlswap =>{
    //console.log(file + ' : ' + htmlswap);
    var copyInHtmlTask = `CopyInHtmlTask_${file}_${htmlswap}`;
    gulp.task(copyInHtmlTask, function(){
        return gulp.src(['./Build/' + file + '.ts'])
                   .pipe(replace('[' + htmlswap + '.html]', fs.readFileSync('./src/html/' + htmlswap + '.html', "utf8")))
                   .pipe(gulp.dest('./Build/'));
    });
    CopyInHtmlTasks.push(copyInHtmlTask);
  });
}

gulp.task('ChromeInsertNoteHtml', gulp.series(CopyInHtmlTasks));

gulp.task('ChromeBuildJs', gulp.series( 
  function () { return gulp.src('./src/*.ts').pipe(gulp.dest('./Build/'))},
  function () { return gulp.src('./src/Chrome/*.ts').pipe(gulp.dest('./Build/'))},
  'ChromeInsertNoteHtml',
  function () { return gulp.src('./src/html/popup.*').pipe(gulp.dest(GulpVars.ChromeDist))},
  function () { return browserify({
                  basedir: '.',
                  debug: true,
                  entries: ["./Build/ContentScript.ts"],
                  cache: {},
                  packageCache: {}
              })
              .plugin(tsify)
              .bundle()
              .pipe(source('contentscript.js'))
              .pipe(buffer())
              .pipe(sourcemaps.init({loadMaps: true}))
              //.pipe(uglify()) // not allowed to uglify chrome extension
              .pipe(sourcemaps.write('./'))
              .pipe(gulp.dest(GulpVars.ChromeDist))},
  function () { return browserify({
                  basedir: '.',
                  debug: true,
                  entries: ["./Build/BackgroundScript.ts"],
                  cache: {},
                  packageCache: {}
              })
              .plugin(tsify)
              .bundle()
              .pipe(source('backgroundscript.js'))
              .pipe(buffer())
              .pipe(sourcemaps.init({loadMaps: true}))
              //.pipe(uglify()) // not allowed to uglify chrome extension
              .pipe(sourcemaps.write('./'))
              .pipe(gulp.dest(GulpVars.ChromeDist))},
  function () { return browserify({
                  basedir: '.',
                  debug: true,
                  entries: ["./Build/Popup.ts"],
                  cache: {},
                  packageCache: {}
              })
              .plugin(tsify)
              .bundle()
              .pipe(source('popup.js'))
              .pipe(buffer())
              .pipe(sourcemaps.init({loadMaps: true}))
              //.pipe(uglify()) // not allowed to uglify chrome extension
              .pipe(sourcemaps.write('./'))
              .pipe(gulp.dest(GulpVars.ChromeDist))}              
));


gulp.task('ChromeBuild', 
  gulp.parallel('ChromeIconResize','ChromeCopyImages','ChromeManifest','ChromeBuildJs')
  //Package
);

gulp.task('ChromePack', function(){
  return gulp.src(GulpVars.ChromeDist + "*")
             .pipe(zip('Chrome.zip'))
             .pipe(gulp.dest('Packed/'))
});

gulp.task('ChromeBuildAndPack', gulp.series(
  'ChromeBuild',
  'ChromePack'
));