var gulp = require("gulp");

gulp.task('BuildAndPack', gulp.series(
    'ChromeBuild',
    'ChromePack',
    'FirefoxBuild',
    'FirefoxPack'
  ));