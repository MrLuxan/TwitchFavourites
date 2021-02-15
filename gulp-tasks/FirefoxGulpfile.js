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
var merge = require('merge-stream');
var clean = require('gulp-clean');

var fs = require('fs');
var GulpVars = JSON.parse(fs.readFileSync('./gulp-tasks/GulpVariables.json'))

gulp.task('FirefoxPreclean', function () {
  return gulp.src([GulpVars.FirefoxDist + '*','./Build/*'], {read: false})
    .pipe(clean());
});

gulp.task("FirefoxManifest", function () {
  return gulp.src(GulpVars.FirefoxSrc+ "manifest.json")
             .pipe(jeditor(function(json) {
              json.version = GulpVars.ExtensionVersion;
              return json; // must return JSON object.
              }))
             .pipe(gulp.dest(GulpVars.FirefoxDist));
});

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
gulp.task('FirefoxInsertNoteHtml', gulp.series(CopyInHtmlTasks));


var transpileTasks = [];
var transpileFiles = {"contentscript.js" : "./Build/Control_Content.ts",
                      "backgroundscript.js" : "./Build/Control_Background.ts",
                      "popup.js" : "./Build/Control_Popup.ts"};
for (const file in transpileFiles) {

    let tsFile = transpileFiles[file];
    let jsFile = file;

    var transpileFile = `Transpile ${tsFile} to ${jsFile}`;
    gulp.task(transpileFile, function(){
      return browserify({
                  basedir: '.',
                  debug: true,
                  entries: [tsFile],
                  cache: {},
                  packageCache: {}
              })
              .plugin(tsify)
              .bundle()
              .pipe(source(jsFile))
              .pipe(buffer())
              .pipe(sourcemaps.init({loadMaps: true}))
              //.pipe(uglify()) // not allowed to uglify Firefox extension
              .pipe(sourcemaps.write('./'))
              .pipe(gulp.dest(GulpVars.FirefoxDist));
  });
  transpileTasks.push(transpileFile);
}
gulp.task('FirefoxTranspileTasks', gulp.series(transpileTasks));

gulp.task('FirefoxBuildJs', gulp.series( 
  'FirefoxPreclean',
  function () { return gulp.src('./src/*.ts').pipe(gulp.dest('./Build/'))},
  function () { return gulp.src('./src/Firefox/*.ts').pipe(gulp.dest('./Build/'))},
  'FirefoxInsertNoteHtml',
  function () { return gulp.src('./src/html/popup.*').pipe(gulp.dest(GulpVars.FirefoxDist))},
  'FirefoxTranspileTasks'
));

gulp.task('FirefoxBuild', 
  gulp.parallel('FirefoxIconResize','FirefoxCopyImages','FirefoxManifest','FirefoxBuildJs')
);

gulp.task('FirefoxPack', function() {
  var images = gulp.src([
      GulpVars.FirefoxDist + '/images/*'
    ])
    .pipe(rename(function(file) {
      file.dirname = 'images/' + file.dirname;
    }));

  return merge(gulp.src([GulpVars.FirefoxDist + '*.js',
                         GulpVars.FirefoxDist + '*.html',
                         GulpVars.FirefoxDist + '*.css',
                         GulpVars.FirefoxDist + '*.json']),
              images)
    .pipe(zip('Firefox.zip'))
    .pipe(gulp.dest('Packed/'))
});

gulp.task('FirefoxBuildAndPack', gulp.series(
  'FirefoxBuild',
  'FirefoxPack'
));