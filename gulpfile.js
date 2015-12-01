var NAME = 'Triangle';
var VERSION = '0.0.1'

var gulp = require('gulp');
var browserSync = require('browser-sync');	// .create() 不能加create
var fileInclude = require('gulp-file-include');		// html文件包含
var rename = require('gulp-rename');		// 重命名
var clean = require('gulp-clean');			// 清理文件
var less = require('gulp-less');			// less 支持
var concat = require('gulp-concat');		// 合并
var minifycss = require('gulp-minify-css');	// 压缩css
var uglify = require('gulp-uglify');		// 压缩js
var jshint = require('gulp-jshint');			// 语法检查
var zip = require('gulp-zip');


gulp.task('default', ['demo'])
	.task('clean', ['clean-build'])
	.task('clean-all', ['clean', 'clean-dist'])
	.task('build', ['build-exam'])				// 'clean', 	TODO:顺序执行问题，留待gulp4.0版本发布
	.task('dist', ['dist-exam'])				// 'clean-all', TODO:顺序执行问题，留待gulp4.0版本发布
    .task('release', ['rele-zips'])
	.task('demo', ['build', 'watch', 'www:demo'])
	.task('exam', ['build', 'watch', 'www:exam'])

	/* 测试环境 */
    .task('www:demo',function(){
		var bs=browserSync({
			server:{
				baseDir:'./build',
				index:'demo/home/index.html'
			}
		});
	})
	.task('www:exam',function(){
		var bs=browserSync({
			server:{
				baseDir:'./build',
				index:'examples/jQuery/index.html'
			}
		});
	})
	.task('www:dist-demo',function(){
		var bs=browserSync({
			server:{
				baseDir:'./dist',
				index:'demo/home/index.html'
			}
		});
	})	
	.task('www:dist-exam',function(){
		var bs=browserSync({
			server:{
				baseDir:'./dist',
				index:'examples/index.html'
			}
		});
	})

	/* 构建项目 */
	// 清空 构建 目录
	.task('clean-build', function(){
		return gulp.src( [
					'build/libs', 
					'build/framework', 
					'build/demo', 
					'build/examples',
					'build/refer',
                    'build/iefix'
				] )
			.pipe( clean({force: true}) );
	})
	// 构建 基础库
	.task('build-libs', function(){
		// css:font
		gulp.src( ['src/libs/Bootstrap/3.3.5/fonts/*.*'] )
			.pipe( gulp.dest('build/libs/fonts') )

		// css:image

		// css:css
		gulp.src( [
					'src/libs/Bootstrap/3.3.5/bootstrap.css', 
					'src/libs/Bootstrap/3.3.5/bootstrap-theme.css'
				] )
			.pipe( concat('libs.css') )
			.pipe( gulp.dest('build/libs') )

		// js
		gulp.src( [
					'src/libs/jQuery/1.11.3/jquery.js', 
					'src/libs/AngularJS/1.4.6/angular.js', 
					'src/libs/AngularJS/1.4.6/angular-route.js'
				] )
			// .pipe( jshint('.jshintrc') )
			// .pipe( jshint.reporter('default') )
			.pipe( concat('libs.js') )
			.pipe( gulp.dest('build/libs') )
	})
	// 构建 框架
	.task('build-fram', ['build-libs'], function(){
		/* 合并 less 文件 */
		gulp.src( [
				'src/framework/**/*.less',
				'!src/framework/layouts/**/*.less'		// layouts是完整示例，不需要整合进Triangle.css
			] )
			.pipe( less() )
			.pipe( concat(NAME+'.css') )
			.pipe( gulp.dest('build/framework') );

		/* 合并 js 文件 */
		gulp.src( [
				'src/framework/modules/core.js', 
				'src/framework/modules/base.js', 
				'src/framework/framework.js', 
				'src/framework/controls/**/*.js', 
				'src/framework/components/**/*.js', 
				'!src/framework/controls/_template/*.js', 
				'!src/framework/components/_template/*.js', 
				//'!src/framework/layouts/**/*.js', 		// layouts是完整示例，不需要整合进Triangle.js
                '!src/framework/**/*-jq.js',
				'!src/framework/**/*-ng.js'
			] )
			.pipe( jshint('.jshintrc') )
			.pipe( jshint.reporter('default') )	// js语法检查
			.pipe( concat(NAME+'.js') )
			.pipe( gulp.dest('build/framework') );

		/* 合并 js -jq 文件 */
		gulp.src( [
				'src/framework/**/*-jq.js',
				'!src/framework/layouts/**/*-jq.js',	// layouts是完整示例，不需要整合进Triangle-jq.js
			] )
			.pipe( jshint('.jshintrc') )
			.pipe( jshint.reporter('default') )	// js语法检查
			.pipe( concat(NAME+'-jq.js') )
			.pipe( gulp.dest('build/framework') );

		/* 合并 js -ng 文件 */
		gulp.src( [
				'src/framework/**/*-ng.js',
				'!src/framework/layouts/**/*-ng.js',	// layouts是完整示例，不需要整合进Triangle-ng.js
			] )
			// .pipe( jshint('.jshintrc') )
			// .pipe( jshint.reporter('default') )	// js语法检查
			.pipe( concat(NAME+'-ng.js') )
			.pipe( gulp.dest('build/framework') );

        // 复制refer modules
        gulp.src(['refer/modules/**/*'])
            .pipe( gulp.dest('build/refer/modules') );

        /* 发布ie fix文件 */
        gulp.src( ['src/iefix/**/*'] )
        .pipe( gulp.dest('build/iefix') )

        /* 发布 framework media 文件 */
        gulp.src( ['src/framework/media/**/*'] )
            .pipe( gulp.dest('build/framework/media') );
	})
	// 构建 演示
	.task('build-demo', ['build-libs', 'build-fram'], function(){
		/* 复制assets到build */
		gulp.src( ['src/demo/assets/**/*'] )
			.pipe( gulp.dest('build/demo/assets') );

		// 将包含 html include 指令的 master.html 转换为 index.html
		gulp.src( ['src/demo/*/master.html'] )	// 'demo/master.html', 
			.pipe( fileInclude() )
			.pipe( rename(function (path) {	// 'index.html'
				//path.dirname += "/dir";
				//path.basename += "-goodbye";
				path.basename = 'index';
				//path.extname = ".md"
			}) )
			.pipe( gulp.dest('build/demo') );

		// 复制 *.less 到 build
		gulp.src( [
				'src/demo/controls/*/index.less',
				'src/demo/components/*/index.less',
				'!src/demo/layouts/*/index.less',
				'src/demo/modules/*/index.less',
				'src/demo/app.less'
			] )
			.pipe( less() )
			.pipe( concat('app.css') )
			.pipe( gulp.dest('build/demo') );


		// 复制 app.js 到 build
		gulp.src( [
				'src/demo/controls/*/index.js',
				'src/demo/components/*/index.js',
				'src/demo/layouts/*/index.js',
				'src/demo/modules/*/index.js',
				'src/demo/app.js'
			] )
            .pipe( jshint('.jshintrc') )
            .pipe( jshint.reporter('default') ) // js语法检查
			.pipe( concat('app.js') )
			.pipe( gulp.dest('build/demo') );


		// ===================================================================
		// 非框架部分
		// ===================================================================
        // 复制控件示例文件
        gulp.src( [
                'src/demo/controls/*/example.html',
                'src/demo/controls/*/*.json',
                'src/demo/controls/*/remote.html'
            ] )
            /*.pipe( rename(function (path) {   // 'index.html'
                //path.dirname += "/dir";
                //path.basename += "-goodbye";
                path.basename = 'example';
                //path.extname = ".html"
            }) )*/
            .pipe( gulp.dest('build/demo/controls') );
		// 复制组件示例文件
		gulp.src( [
                'src/demo/components/*/example.html',
                'src/demo/components/*/*.json',
                'src/demo/components/*/remote.html'
            ] )
			/*.pipe( rename(function (path) {	// 'index.html'
				//path.dirname += "/dir";
				//path.basename += "-goodbye";
				path.basename = 'example';
				//path.extname = ".html"
			}) )*/
			.pipe( gulp.dest('build/demo/components') );

		// 复制布局示例文件
		gulp.src( [
				'src/framework/layouts/*/*.*',
				'!src/framework/layouts/*/*.less'
			] )
			.pipe( gulp.dest('build/demo/layouts') );
		/* 合并 less 文件 */
		gulp.src( [
				'src/framework/layouts/*/*.less',
			] )
			.pipe( less() )
			.pipe( rename(function (path) {	// 'index.html'
				//path.dirname += "/dir";
				//path.basename += "-goodbye";
				//path.basename = 'example';
				path.extname = ".css"
			}) )
			.pipe( gulp.dest('build/demo/layouts') );


		// // 复制布局临时引用文件
		// gulp.src( ['src/framework/layouts/*/*/*.*'] )
		// 	.pipe( gulp.dest('build/demo/layouts') );
        /* 发布 demo media 文件 */
        gulp.src( ['src/demo/media/**/*'] )
            .pipe( gulp.dest('build/demo/media') );
	})
	// 构建 示例
	.task('build-exam', ['build-libs', 'build-fram', 'build-demo'], function(){
		gulp.src(['src/examples/**/*'])
			.pipe( gulp.dest('build/examples') );
	})

	/* 发布项目 */
	// 清空 发布 目录
	.task('clean-dist', function(){
		return gulp.src( [
					'dist/libs', 
					'dist/framework', 
					'dist/demo', 
					'dist/examples',
					'dist/refer',
                    'dist/iefix'
				] )
			.pipe( clean({force: true}) );
	})
	// 发布 基础库
	.task('dist-libs', ['build-libs'], function() {
		// css:font
		gulp.src( ['build/libs/fonts/*.*'] )
			.pipe( gulp.dest('dist/libs/fonts') )

		// css:image

		// css:css
		gulp.src( [
					'build/libs/libs.css'
				] )
			.pipe( gulp.dest('dist/libs') )
			.pipe( minifycss() )
			.pipe( rename('libs.min.css') )
			.pipe( gulp.dest('dist/libs') );

		// js
		gulp.src( [
					'build/libs/libs.js'
				] )
            // .pipe( jshint('.jshintrc') )
            // .pipe( jshint.reporter('default') ) // js语法检查
			.pipe( gulp.dest('dist/libs') )
			.pipe( uglify() )
			.pipe( rename('libs.min.js') )
			.pipe( gulp.dest('dist/libs') );
	})
	// 发布 框架
	.task('dist-fram', ['dist-libs', 'build-fram'], function(){
		/* 合并 并 压缩 less 文件 */
		gulp.src( ['build/framework/' + NAME + '.css'] )
			.pipe( gulp.dest('dist/framework') )
			.pipe( minifycss() )
			.pipe( rename(NAME+'.min.css') )
			.pipe( gulp.dest('dist/framework') );
		/* 合并 并 压缩 js 文件 */
		gulp.src( ['build/framework/' + NAME + '.js'] )
            .pipe( jshint('.jshintrc') )
            .pipe( jshint.reporter('default') ) // js语法检查
			.pipe( gulp.dest('dist/framework') )
			.pipe( uglify() )
			.pipe( rename(NAME+'.min.js') )
			.pipe( gulp.dest('dist/framework') );
        /* 合并 js -jq 文件 */
        gulp.src( [
                'build/framework/' + NAME + '-jq.js'
            ] )
            .pipe( jshint('.jshintrc') )
            .pipe( jshint.reporter('default') ) // js语法检查
            .pipe( gulp.dest('dist/framework') )
            .pipe( uglify() )
            .pipe( rename(NAME+'-jq.min.js') )
            .pipe( gulp.dest('dist/framework') );
		/* 合并 并 压缩 js ng 文件 */
		gulp.src( ['build/framework/' + NAME + '-ng.js'] )
            .pipe( jshint('.jshintrc') )
            .pipe( jshint.reporter('default') ) // js语法检查
			.pipe( gulp.dest('dist/framework') )
			.pipe( uglify() )
			.pipe( rename(NAME+'-ng.min.js') )
			.pipe( gulp.dest('dist/framework') );

        /* 复制 refer modules*/
        gulp.src( ['build/refer/modules/**/*'] )
            .pipe( gulp.dest('dist/refer/modules') )
        gulp.src( ['build/iefix/**/*'] )
            .pipe( gulp.dest('dist/iefix') )
        /* 发布 media 文件*/
        gulp.src( ['build/framework/media/**/*'] )
            .pipe( gulp.dest('dist/framework/media') )
	})
	// 发布 演示
	.task('dist-demo', ['dist-libs', 'dist-fram', 'build-demo'], function(){
		gulp.src( ['build/demo/**/*'] )	// 'build/demo/index.html', 
			.pipe( gulp.dest('dist/demo') );
	})
	// 发布 示例
	.task('dist-exam', ['dist-libs', 'dist-fram', 'dist-demo', 'build-exam'], function(){
		gulp.src(['build/examples/**/*'])
			.pipe( gulp.dest('dist/examples') );
	})

    .task('rele-zips', function(){
        /* 压缩文件 */
        gulp.src([
                'dist/libs/**/*',
                'dist/framework/**/*',
                'dist/refer/**/*',
                'dist/iefix/**/*'
            ], {base: './dist'})
            .pipe( zip(NAME + '_v' + VERSION + '.zip') )
            .pipe( gulp.dest('_releases/v' + VERSION + '/') );   // ' + NAME + '/
    })

	/* 监视 文件的变化 */
	.task('watch', function () {
	    gulp.watch('src/framework/**/*.less', ['build-fram']);
	    gulp.watch('src/framework/**/*.js', ['build-fram']);
	    gulp.watch('src/framework/**/*.html', ['build-fram', 'build-demo']);

	    gulp.watch('src/demo/**/*.html', ['build-demo']);
	    gulp.watch('src/demo/**/*.less', ['build-demo']);
	    gulp.watch('src/demo/**/*.js', ['build-demo']);

	    gulp.watch('src/examples/**/*', ['build-exam']);

	    //gulp.watch('src/examples/**/*.html', ['build-demo']);
	    //gulp.watch('src/examples/**/*.less', ['build-demo']);
	    //gulp.watch('src/examples/**/*.js', ['build-demo']);
	})


	/* 帮助 */
	.task('help', function(){
		console.log('	gulp help           gulp参数说明');
		console.log('	gulp                构建框架启动demo');
		console.log('	gulp default        构建框架启动demo');
		console.log('	gulp clean          清除build目录');
		console.log('	gulp clean-dist     清除dist目录');
		console.log('	gulp build          构建框架');
		console.log('	gulp www:demo       启动demo开发测试环境');
		console.log('	gulp www:dist-demo  启动demo发布测试环境');
		console.log('	gulp www:exam       启动示例开发测试环境');
		console.log('	gulp www:dist-exam  启动示例发布测试环境');
	});