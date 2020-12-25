const gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    fileinclude = require('gulp-file-include'),
    cleanCss = require('gulp-clean-css'),
    cssMediaGroup = require('gulp-group-css-media-queries'),
    optimizeJs = require('gulp-uglify-es').default,
    imagemin = require('gulp-imagemin'),
    del = require('del'),
    browserSync = require('browser-sync').create();


let productionFolder = 'public',
    sourceFolder = 'src';

let path = {
    app: {
        html: productionFolder + '/',
        css: productionFolder + '/css/',
        js: productionFolder + '/js/',
        img: productionFolder + '/img/',
        fonts: productionFolder + '/fonts/',
        json: productionFolder + '/'
    },

    src: {
        html: [sourceFolder + '/**/*.html', '!' + sourceFolder + '/**/_*.html'],
        scss: [sourceFolder + '/scss/**/*.scss', '!' + sourceFolder + '/_*.scss'],
        js: sourceFolder + '/js/**/*.js',
        img: sourceFolder + '/img/**/*.{jpg,png,svg,gif,ico,webp }',
        json: [sourceFolder + '/**/*.json']
    },

    watch: {
        html: sourceFolder + '/**/*.html',
        scss: sourceFolder + '/scss/**/*.scss',
        js: sourceFolder + '/js/**/*.js',
        img: sourceFolder + '/img/**/*.{jpg,png,svg,gif,ico,webp }'
    },

    clean: './' + productionFolder + '/'
}

function browserAutoReload() {
    browserSync.init({
        server: {
            baseDir: './' + productionFolder + '/'
        },
        port: 3000,
        notify: false
    })
}

function json(cb){
    gulp.src(path.src.json)
        .pipe(gulp.dest(path.app.json))
    cb();
}

function html(cb) {
    gulp.src(path.src.html)
        .pipe(fileinclude())
        .pipe(gulp.dest(path.app.html))
        .pipe(browserSync.stream()) 
    cb();
}

function sassToCss(done) {
    gulp.src(path.src.scss)
        .pipe(sass({
            errorLogConsole: true,
            outputStyle: 'expanded'
        }))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 5 versions'],
            cascade: true
        }))
        .on('error', console.error.bind(console))
        .pipe(gulp.dest(path.app.css))
        .pipe(cleanCss())
        .pipe(rename({ suffix: '.min' }))
        .pipe(cssMediaGroup())
        .pipe(gulp.dest(path.app.css))
        .pipe(browserSync.stream())
    done(); 
}

function js(cb) {
    gulp.src(path.src.js)
        .pipe(fileinclude())
        .pipe(gulp.dest(path.app.js))
        .pipe(optimizeJs())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(path.app.js))
        .pipe(browserSync.stream())
    cb();
}

function images(pr) {
    gulp.src(path.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            interlaced: true,
            optimizationLevel: 3
        }))
        .pipe(gulp.dest(path.app.img))
        .pipe(browserSync.stream())
    pr();
}


function watchChanges() {
    gulp.watch([path.watch.html], html)
    gulp.watch([path.watch.scss], sassToCss)
    gulp.watch([path.watch.js], js)
    gulp.watch([path.watch.img], images)
}

function clean(){
    return del(path.clean);
}

let buildHtml = gulp.series(clean, gulp.parallel(images, js, sassToCss, html, json), watchChanges);
let autoReloadBrowser = gulp.parallel(buildHtml, browserAutoReload);


exports.html = html;
exports.js = js;
exports.sassToCss = sassToCss;
exports.images = images;
exports.json = json;
exports.autoReloadBrowser = autoReloadBrowser;
exports.default = autoReloadBrowser;