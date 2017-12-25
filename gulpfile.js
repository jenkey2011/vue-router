
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    connect = require('gulp-connect'),
    autoprefixer = require('gulp-autoprefixer'),
    rimraf = require('gulp-rimraf'),
    postcss = require('gulp-postcss'),
    px2rem = require('postcss-px2rem'),
    spritesmith = require('gulp.spritesmith'),
    babel = require('gulp-babel')

var CLEAN_DIST = 'dist/',
    ROOT_SRC = 'src/static/',
    ROOT_DIST = CLEAN_DIST + '/static'

var path = {
    'html': {
        'src': 'src/app/*.html',
        'dist': 'dist/app'
    },
    'css': {
        'src': ROOT_SRC + '/css/*.css',
        'dist': ROOT_DIST + '/css'
    },
    'sass': {
        'src': ROOT_SRC + '/sass/*.scss',
        'dist': ROOT_DIST + '/css'
    },
    'js': {
        'src': ROOT_SRC + '/js/*.js',
        'dist': ROOT_DIST + '/js'
    },
    'libs': {
        'src': 'src/libs/*/*',
        'dist': 'dist/libs'
    },
    'fonts': {
        'src': ROOT_SRC + '/fonts/*',
        'dist': ROOT_DIST + '/fonts'
    },
    'images': {
        'src': [ROOT_SRC + '/images/**/*.{png,jpg,gif,mp3,svg,mp4}', ROOT_SRC + '/images/*.{png,jpg}'],
        'dist': ROOT_DIST + '/images'
    }
}

gulp.task('runJs', function () {
    return gulp.src(path.js.src)
        .pipe(concat('all.js'))
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(rename({
            basename: 'main'
	    // prefix: "bonjour-",
	    // suffix: "-b",
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(path.js.dist))
        .pipe(connect.reload())
})

gulp.task('moveLibs', function () {
    return gulp.src(path.libs.src)
						 .pipe(gulp.dest(path.libs.dist))
})

var processors = [px2rem({remUnit: 64})]

gulp.task('runSass', function () {
    gulp.src(path.sass.src)
	  	.pipe(sourcemaps.init())
	    .pipe(sass({outputStyle: 'compact'}).on('error', sass.logError))
	    .pipe(autoprefixer({
            browsers: ['last 20 versions'],
            cascade: false
        }))
	    // .pipe(postcss(processors))
	    .pipe(sourcemaps.write('../css'))
	    .pipe(gulp.dest(path.css.dist))
    	.pipe(connect.reload())
})

gulp.task('runHtml', function () {
    gulp.src(path.html.src)
        .pipe(gulp.dest(path.html.dist))
        .pipe(connect.reload())
})

gulp.task('runFonts', function () {
    gulp.src(path.fonts.src)
        .pipe(gulp.dest(path.fonts.dist))
})

gulp.task('runImage', function () {
    gulp.src(path.images.src)
        .pipe(gulp.dest(path.images.dist))
})

gulp.task('clean', function () {
    gulp.src(CLEAN_DIST, { read: false })
        .pipe(rimraf())
})

gulp.task('runConnect', function () {
    connect.server({
        root: './',
        port: 9097,
        livereload: true
    })
})

gulp.task('sprite', function () {
    var spriteData = gulp.src('dist/pack/images/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'style.css'
    }))
    return spriteData.pipe(gulp.dest('dist/'))
})

gulp.task('watch', function () {
    gulp.watch(path.html.src, ['runHtml'])
    gulp.watch(path.sass.src, ['runSass'])
    gulp.watch(path.js.src, ['runJs'])
    gulp.watch(path.images.src, ['runImage'])
})

gulp.task('default', ['moveLibs', 'runJs', 'runSass', 'runHtml', 'runFonts', 'runImage', 'runConnect', 'watch'])
