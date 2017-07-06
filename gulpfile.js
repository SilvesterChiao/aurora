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
var gulp = require('gulp'),
	$ = require('gulp-load-plugins')(),
	browserSync = require('browser-sync').create(),
	reload = browserSync.reload,
	wiredep = require('wiredep').stream,
	jsonServer = require('json-server');

var data = require('./mock/mock.js')();

// 自定义任务
gulp.task('hello', function(){
	console.log($);
});

// 清除 html
gulp.task('cleanHTMLFile', function(){
	return gulp.src('./dist/*.html')
			   .pipe($.clean())
})

// 注入 bower
gulp.task('wiredep', ['cleanHTMLFile'], function(){
	return gulp.src('./src/*.html')
			.pipe(wiredep({
				optional: 'configuration',
				goes: 'here'
			}))
			.pipe(gulp.dest('./dist'))
			.pipe(browserSync.stream())
})

// 清除 css
gulp.task('cleanStyleFile', function(){
    return gulp.src(['./dist/css/*.css', './dist/css/*.map'])
               .pipe($.clean());
});

// 复制 css
gulp.task('copyCss', ['cleanStyleFile'], function(){
	return gulp.src('./src/styles/*.css')
			.pipe(gulp.dest('./dist/css'))
			.pipe(browserSync.stream())
})

// 编译 sass
// gulp.task('sass', ['cleanStyleFile'], function(){
//     return gulp.src('./src/styles/*.scss')
//                .pipe($.sourcemaps.init())
//                .pipe($.sass({outputStyle: 'expanded'}).on('error', $.sass.logError))
//                .pipe($.sourcemaps.write('./'))
//                .pipe(gulp.dest('./dist/css'));
// });

// 压缩 css
gulp.task('minify-css', function(){
	return gulp.src('./dist/css/*.css')
			.pipe($.cleanCss())
			.pipe($.rename({
				suffix: '.min'
			})).pipe(gulp.dest('./dist/css'))
})

// css 文件 md5 签名
gulp.task('revcss', function(){
	return gulp.src('./src/css/*.css')
			.pipe($.rev())
			.pipe(gulp.dest('./dist/css'))
			.pipe($.rev.manifest())
			.pipe(gulp.dest('./dist/rev'))
})

// 替换 md5 签名路径
gulp.task('rev', function(){
	return gulp.src(['./dist/rev/**/*.json', './src/**/*.html'])
			.pipe($.revCollector())
			.pipe(gulp.dest('./dist'))
})

// 清除 js
gulp.task('cleanScriptFile', function(){
	return gulp.src(['./dist/js/*.js', './dist/js/*.map'])
			.pipe($.clean())
})

// 复制 js
gulp.task('copyJs', ['cleanScriptFile'], function(){
	return gulp.src('./src/scripts/*.js')
			.pipe(gulp.dest('./dist/js'))
			.pipe(browserSync.stream())
})

// babel 转义 es6
// gulp.task('babel', ['cleanScriptFile'], function(){
// 	return gulp.src('./src/scripts/*.es6')
// 			.pipe($.sourcemaps.init())
// 			.pipe($.babel())
// 			.pipe($.sourcemaps.write('./'))
// 			.pipe(gulp.dest('./dist/js'))
// })

// 压缩 js
gulp.task('uglify', function(){
	gulp.src('./src/scripts/*.js')
		.pipe($.uglify())
		.pipe(gulp.dest('./dist/js'));
});

// js 文件 md5 签名
gulp.task('revjs', function(){
	return gulp.src('./src/scripts/*.js')
			.pipe($.rev())
			.pipe(gulp.dest('./dist/js'))
})

// 清除图片
gulp.task('cleanImg', function(){
	return gulp.src(['./dist/images/*.jpg', './dist/images/*.png'])
			.pipe($.clean())
})

// 复制 image
gulp.task('copyImg', ['cleanImg'], function(){
	return gulp.src(['./src/images/*.jpg', './src/images/*.png'])
			.pipe(gulp.dest('./dist/images'))
})

// 启动数据服务器
gulp.task('json-server', function(){
	const server = jsonServer.create();
	const router = jsonServer.router(data);
	const middlewares = jsonServer.defaults();

	// 启动 json-server
	server.use(middlewares)
	server.use(router)
	server.listen(9000, () => {
		console.log('JSON Server is running')
	})
})

// 启动服务器
gulp.task('serve', ['json-server'], function(){
	// 启动 browser-sync
	browserSync.init({
		server: {
			baseDir: './dist',
			routes: {
				'/bower_components': 'bower_components'
			}
		}
	})

	// 监听
	// gulp.watch('./src/styles/*.scss', ['sass'])
	gulp.watch('./src/*.html', ['wiredep'])
	gulp.watch('./src/styles/*.css', ['copyCss'])
	gulp.watch('./src/styles/*.js', ['copyJs'])
})


gulp.task('dev', ['wiredep', 'copyCss', 'copyJs', 'copyImg', 'serve']);
gulp.task('build', ['wiredep', 'sass', 'minify-css', 'babel', 'uglify']);