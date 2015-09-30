--_base 原始构建脚本(不要改动)



1. 建立文档结构
2. 下载lib/_base目录下的第三方库
3. 建立lib第三方库引用基线
	3.1 AngularJS从github站点的 bower-angularjs / bower-angularjs-route 两个分支中获取
4. 生成package.json，在命令行中项目目录下运行以下命令
	npm init 
5. 安装browser-sync，
	官方站点：
		http://www.browsersync.io/docs/gulp/
	安装browser-sync,在命令行中项目目录下运行以下命令
		npm install browser-sync gulp --save-dev
6. 安装gulp 
	官方站点：
		http://gulpjs.com/
	安装gulp，在命令行中项目目录下运行以下命令
		npm install --global gulp --save-dev
		npm install gulp --save-dev
	创建gulpfile.js文件，输入以下内容
		var gulp = require('gulp');
		gulp.task('default', function() {
		  // place code for your default task here
		  console.log('this is the default task')
		});
	运行gulp，在命令行中项目目录下运行以下命令
		gulp
