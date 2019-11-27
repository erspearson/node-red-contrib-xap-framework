const { src, dest, task } = require('gulp')
const include = require('gulp-file-include')
const rename = require("gulp-rename")
const debug = require("gulp-debug")
 
function buildNodeHtml(done) {
  src(['src/*.html', '!src/*.form.html', '!src/*.help.html'])
  .pipe(include())
  .pipe(debug())
  .pipe(dest('./nodes'))
  done()
}

exports.buildNodeHtml = buildNodeHtml