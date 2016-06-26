var gulp = require('gulp');
var gutil = require('gutil');
var webpack = require("webpack")
var nodemon = require('gulp-nodemon');
var conf = require('./conf');
var imacss = require('gulp-imacss');
var _ = require('underscore');

function generateCss(image) {
    var slug = image.slug;
    var index = slug.indexOf('_pressed')
    if (index > 0) {
        slug = slug.substring(0, index) + ":active";
    }
    return '.image-' + slug + ' { ' + 'background-image:' + 'url(\'' + image.datauri + '\'); }';
}

gulp.task('imacss', function() {
    return gulp.src('front_end/images/*.png')
        .pipe(imacss('images.less', generateCss))
        .pipe(gulp.dest('front_end/images/build/'));
});

gulp.task('default', ['imacss'], function(cb) {
    webpack(require('./webpack.config.js'), cb);
});

gulp.task('watch', ['imacss'], function(cb) {
    var f = _.once(function() {
        nodemon({
            script: 'app.js',
            ignore: ['front_end/*'],
            ext: 'js'
        });
    });
    var compiler = webpack(require('./webpack.config.dev.js'));
    return compiler.watch({}, function(err, stats) {
        if (err || stats.hasErrors()) {
            console.log(err || stats.toJson().errors);
        } else {
            f();
        }
    });
});
