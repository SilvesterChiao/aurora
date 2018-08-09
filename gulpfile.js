/**
 * Author: Silvester
 */

/**
 * 任务列表
 * 编译/压缩sass,jade,es6
 * browserSync
 * build
 * 字体图片处理
 * 自动引入第三方
 * css/js语法检查
 * 自动前缀
 * 合并,md5,替换路径
 * mock,测试
 */

/**
 * browser-sync
 * gulp-load-plugins
 * gulp-uglify
 * gulp-sass
 * gulp-sourcemaps
 * gulp-clean
 * gulp-minify-css
 * gulp-rev
 * gulp-rev-collector
 */

// 构建流程
// dev
//
// test
// build

// 导入工具包
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const browserSync = require('browser-sync').create();
const wiredep = require('wiredep').stream;
const jsonServer = require('json-server');
const data = require('./mock/mock.js')();

// const { reload } = browserSync;

// 自定义任务
gulp.task('hello', () => {
    console.log($);
});

// 清除
gulp.task('clean', () => gulp.src('./dist/**/*').pipe($.clean()));

// 清除 html
gulp.task('cleanHTMLFile', () => gulp.src('./dist/*.html').pipe($.clean()));

// 注入 bower
gulp.task('wiredep', ['cleanHTMLFile'], () =>
    gulp
        .src('./src/*.html')
        .pipe(wiredep({
            optional: 'configuration',
            goes: 'here',
        }))
        .pipe(gulp.dest('./dist'))
        .pipe(browserSync.stream()));

// 替换 md5 签名路径
gulp.task('rev', () =>
    gulp
        .src(['./dist/rev/**/*.json', './dist/**/*.html'])
        .pipe($.revCollector())
        .pipe(gulp.dest('./dist')));

// css文件处理
gulp.task('style', ['cleanStyleFile'], () =>
    gulp
        .src('./src/styles/*.css')
        .pipe($.cleanCss())
        .pipe($.rename({
            suffix: '.min',
        }))
        .pipe($.rev())
        .pipe(gulp.dest('./dist/css'))
        .pipe($.rev.manifest())
        .pipe(gulp.dest('./dist/rev/css')));

// 清除 css
gulp.task('cleanStyleFile', () =>
    gulp.src(['./dist/css/*.css', './dist/css/*.map']).pipe($.clean()));

// 复制 css
gulp.task('copyCss', ['cleanStyleFile'], () =>
    gulp
        .src('./src/styles/*.css')
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.stream()));

// 编译 sass
// gulp.task('sass', ['cleanStyleFile'], function(){
//     return gulp.src('./src/styles/*.scss')
//                .pipe($.sourcemaps.init())
//                .pipe($.sass({outputStyle: 'expanded'}).on('error', $.sass.logError))
//                .pipe($.sourcemaps.write('./'))
//                .pipe(gulp.dest('./dist/css'));
// });

// 压缩 css
gulp.task('minify-css', () =>
    gulp
        .src('./dist/css/*.css')
        .pipe($.cleanCss())
        .pipe($.rename({
            suffix: '.min',
        }))
        .pipe(gulp.dest('./dist/css')));

// css 文件 md5 签名
gulp.task('revcss', () =>
    gulp
        .src('./src/styles/*.css')
        .pipe($.rev())
        .pipe(gulp.dest('./dist/css'))
        .pipe($.rev.manifest())
        .pipe(gulp.dest('./dist/rev/css')));

// js文件处理
gulp.task('script', ['cleanScriptFile'], () =>
    gulp
        .src('./src/scripts/*.js')
        // .pipe($.sourcemaps.init())
        .pipe($.babel())
        // .pipe($.sourcemaps.write('./'))
        .pipe($.uglify())
        .pipe($.rename({
            suffix: '.min',
        }))
        .pipe($.rev())
        .pipe(gulp.dest('./dist/js'))
        .pipe($.rev.manifest())
        .pipe(gulp.dest('./dist/rev/js')));

// 替换 md5 签名路径
gulp.task('html', () => {
    const cssFilter = $.filter('**/*.css');
    const jsFilter = $.filter('**/*.js');

    return gulp
        .src('./src/**/*.html')
        .pipe($.useref())
        .pipe(
            $.if('*.js', $.uglify()),
            $.rev(),
        )
        .pipe($.if('*.css', $.cleanCss()))
        .pipe(gulp.dest('./dist'));
});

// 清除 js
gulp.task('cleanScriptFile', () => gulp.src(['./dist/js/*.js', './dist/js/*.map']).pipe($.clean()));

// 复制 js
gulp.task('copyJs', ['cleanScriptFile'], () =>
    gulp
        .src('./src/scripts/*.js')
        .pipe(gulp.dest('./dist/js'))
        .pipe(browserSync.stream()));

// babel 转义 es6
gulp.task('babel', ['cleanScriptFile'], () =>
    gulp
        .src('./src/scripts/*.js')
        .pipe($.sourcemaps.init())
        .pipe($.babel())
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/js')));

// 压缩 js
gulp.task('uglify', () => {
    gulp.src('./dist/js/*.js')
        .pipe($.uglify())
        .pipe(gulp.dest('./dist/js'));
});

// js 文件 md5 签名
gulp.task('revjs', () =>
    gulp
        .src('./dist/js/*.js')
        .pipe($.rev())
        .pipe(gulp.dest('./dist/js'))
        .pipe($.rev.manifest())
        .pipe(gulp.dest('./dest/rev/js')));

// 清除图片
gulp.task('cleanImg', () =>
    gulp.src(['./dist/images/*.jpg', './dist/images/*.png']).pipe($.clean()));

// 复制 image
gulp.task('copyImg', ['cleanImg'], () =>
    gulp.src(['./src/images/*.jpg', './src/images/*.png']).pipe(gulp.dest('./dist/images')));

// 启动数据服务器
gulp.task('json-server', () => {
    const server = jsonServer.create();
    const router = jsonServer.router(data);
    const middlewares = jsonServer.defaults();

    // 启动 json-server
    server.use(middlewares);
    server.use(router);
    server.listen(9000, () => {
        console.log('JSON Server is running');
    });
});

// 启动服务器
gulp.task('serve', ['json-server'], () => {
    // 启动 browser-sync
    browserSync.init({
        server: {
            baseDir: './dist',
            routes: {
                '/bower_components': 'bower_components',
            },
        },
    });

    // 监听
    // gulp.watch('./src/styles/*.scss', ['sass'])
    gulp.watch('./src/*.html', ['wiredep']);
    gulp.watch('./src/styles/*.css', ['copyCss']);
    gulp.watch('./src/styles/*.js', ['copyJs']);
});

gulp.task('dev', ['wiredep', 'copyCss', 'copyJs', 'copyImg', 'serve']);
gulp.task('build', ['wiredep', 'sass', 'minify-css', 'babel', 'uglify']);
