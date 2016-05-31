var gulp = require('gulp');
var gutil = require('gutil');
var browserify = require('browserify');
var nodemon = require('gulp-nodemon');
var watchify = require('watchify');
var envify = require('envify');
var source = require('vinyl-source-stream');
var babelify = require('babelify');
var conf = require('./conf');
var less = require('gulp-less');
var cssmin = require('gulp-cssmin');
var postcss = require('gulp-postcss');
var rename = require('gulp-rename');
var imacss = require('gulp-imacss');
var envifyCustom = require('envify/custom');
var uglify = require('gulp-uglify')
var streamify = require('gulp-streamify');
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

gulp.task('css', ['imacss'], function() {
    var autoprefixerBrowsers = [
        "Android >= 4",
        "iOS >= 7",
        "Safari >= 7"
    ];
    var processors = [
        require('autoprefixer')({ browsers: autoprefixerBrowsers })
    ]
    return gulp.src('front_end/less/sm.less')
        .pipe(less())
        .pipe(postcss(processors))
        .pipe(cssmin())
        .pipe(rename('bundle.min.css'))
        .pipe(gulp.dest('./static/styles'));
});


gulp.task('default', ['css'], function() {
    var args = {
        entries: ['./front_end/index.js'],
        transform: [babelify.configure({
            stage: 0
        })],
        debug: false
    };

    var onErr = function() {
        process.exit(1);
    }

    return browserify(args)
        .transform(envifyCustom({
            NODE_ENV: 'production'
        }), { global: true })
        .bundle()
        .on('error', onErr)
        .pipe(source('bundle.min.js'))
        .pipe(streamify(uglify()))
        .pipe(gulp.dest('./static/scripts'));
});

gulp.task('watchify', ['css'], function() {
    var args = {
        entries: ['./front_end/index.js'],
        transform: [babelify.configure({
            stage: 0
        })],
        plugin: [watchify],
        cache: {},
        packageCache: {},
        debug: true
    };
    var w = browserify(args);
    var bundle = function() {
        return w.transform(envify, {global: true})
            .bundle()
            .on('error', gutil.log.bind(gutil, 'Browserify Error'))
            .pipe(source('bundle.min.js'))
            .pipe(gulp.dest('./static/scripts'))
            .on('finish', function () {
                console.log('bundle.min.js finished......');
            });
    }
    w.on('update', bundle);
    w.on('log', gutil.log);
    return bundle();
});

gulp.task('watch', function() {
    return gulp.start('watchify', _.once(function() {
        gulp.watch('front_end/less/*.less', ['css']);
        nodemon({
            script: 'app.js',
            ignore: ['front_end/*'],
            execMap: {
                js: "node"
            },
            ext: 'js css html zip'
        }).on('restart', function() {
            "use strict";
            console.log('restarted app.js...')
        });
    }));
});
