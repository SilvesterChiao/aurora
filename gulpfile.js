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

// 导入工具包
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const browserSync = require('browser-sync').create();
const wiredep = require('wiredep').stream;
const jsonServer = require('json-server');
const data = require('./mock/mock.js')();

const { reload } = browserSync;


// 自定义任务
gulp.task('hello', () => {
  console.log($);
});

// 清除
gulp.task('clean', function(){
    return gulp.src('./dist/**/*')
                .pipe($.clean())
});

// 清除 html
gulp.task('cleanHTMLFile', () => {
  return gulp.src('./dist/*.html')
    .pipe($.clean());
});

// 注入 bower
gulp.task('wiredep', ['cleanHTMLFile'], () => {
  return gulp.src('./src/*.html')
    .pipe(wiredep({
      optional: 'configuration',
      goes: 'here',
    }))
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream());
});

// 清除 css
gulp.task('cleanStyleFile', () => {
  return gulp.src(['./dist/css/*.css', './dist/css/*.map'])
    .pipe($.clean());
});

// 复制 css
gulp.task('copyCss', ['cleanStyleFile'], () => {
  return gulp.src('./src/styles/*.css')
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.stream());
});

// 编译 sass
// gulp.task('sass', ['cleanStyleFile'], function(){
//     return gulp.src('./src/styles/*.scss')
//                .pipe($.sourcemaps.init())
//                .pipe($.sass({outputStyle: 'expanded'}).on('error', $.sass.logError))
//                .pipe($.sourcemaps.write('./'))
//                .pipe(gulp.dest('./dist/css'));
// });

// 压缩 css
gulp.task('minify-css', () => {
  return gulp.src('./dist/css/*.css')
    .pipe($.cleanCss())
    .pipe($.rename({
      suffix: '.min',
    })).pipe(gulp.dest('./dist/css'));
});

// css 文件 md5 签名
gulp.task('revcss', function(){
  return gulp.src('./src/styles/*.css')
      .pipe($.rev())
      .pipe(gulp.dest('./dist/css'))
      .pipe($.rev.manifest())
      .pipe(gulp.dest('./dist/rev/css'))
});

// 替换 md5 签名路径
gulp.task('rev', () => {
  return gulp.src(['./dist/rev/**/*.json', './src/**/*.html'])
    .pipe($.revCollector())
    .pipe(gulp.dest('./dist'));
});

// 替换 md5 签名路径
gulp.task('html', function(){
    var cssFilter = $.filter("**/*.css");
    var jsFilter = $.filter("**/*.js");

	return gulp.src('./src/**/*.html')
            .pipe($.useref())
            .pipe($.if('*.js', $.uglify()), $.rev())
            .pipe($.if('*.css', $.cleanCss()))
			.pipe(gulp.dest('./dist'))
})

// 清除 js
gulp.task('cleanScriptFile', () => {
  return gulp.src(['./dist/js/*.js', './dist/js/*.map'])
    .pipe($.clean());
});

// 复制 js
gulp.task('copyJs', ['cleanScriptFile'], () => {
  return gulp.src('./src/scripts/*.js')
    .pipe(gulp.dest('./dist/js'))
    .pipe(browserSync.stream());
});

// babel 转义 es6
// gulp.task('babel', ['cleanScriptFile'], () => {
//   return gulp.src('./src/scripts/*.es6')
//     .pipe($.sourcemaps.init())
//     .pipe($.babel())
//     .pipe($.sourcemaps.write('./'))
//     .pipe(gulp.dest('./dist/js'));
// });

// 压缩 js
gulp.task('uglify', () => {
  gulp.src('./src/scripts/*.js')
    .pipe($.uglify())
    .pipe(gulp.dest('./dist/js'));
});

// js 文件 md5 签名
gulp.task('revjs', () => {
  return gulp.src('./src/scripts/*.js')
    .pipe($.rev())
    .pipe(gulp.dest('./dist/js'))
    .pipe($.rev.manifest())
    .pipe(gulp.dest('./dest/rev'));
});

// 清除图片
gulp.task('cleanImg', () => {
  return gulp.src(['./dist/images/*.jpg', './dist/images/*.png'])
    .pipe($.clean());
});

// 复制 image
gulp.task('copyImg', ['cleanImg'], () => {
  return gulp.src(['./src/images/*.jpg', './src/images/*.png'])
    .pipe(gulp.dest('./dist/images'));
});

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
