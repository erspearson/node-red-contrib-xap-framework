const { src, dest, task } = require('gulp')
const include = require('gulp-file-include')
const rename = require("gulp-rename")
const debug = require("gulp-debug")
 
function buildNodeHtml(done) {
  src(['src/nodes/*.html', '!src/nodes/*.form.html', '!src/nodes/*.help.html'])
  .pipe(include())
  .pipe(debug())
  .pipe(dest('./nodes'))
  done()
}

exports.buildNodeHtml = buildNodeHtml