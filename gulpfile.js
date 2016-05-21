var gulp = require('gulp');
var gutil = require('gutil');
var browserify = require('browserify');
var nodemon = require('gulp-nodemon');
var watchify = require('watchify');
var envify = require('envify');
var source = require('vinyl-source-stream');
var babelify = require('babelify');
var conf = require('./conf');
var _ = require('underscore');

gulp.task('watchify', function() {
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
