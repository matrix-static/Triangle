var gulp = require('gulp');
var browserSync=require('browser-sync');	// .create() 不能加create

// var minifycss = require('gulp-minify-css');	// 压缩css
// var uglify = require('gulp-uglify');		// 压缩js
// var concat = require('gulp-concat');		// 合并
// var rename = require('gulp-rename');		// 重命名
// var jshint=require('gulp-jshint');			// 语法检查

var dist='dist';


gulp.task('default', ['www:dev'])
    .task('www:dev',function(){
		var bs=browserSync({
			server:{
				baseDir:'./',
				index:'demo/index.html'
			}
		});
	})
	.task('www:dist',function(){
		var bs=browserSync({
			server:{
				baseDir:'./dist',
				index:'demo/index.html'
			}
		});
	})
	.task('examples',function(){
		// var bs=browserSync({
		// 	server:{
		// 		baseDir:'./',
		// 		index:'examples/default/index.html'
		// 	}
		// });
	});
	
	
	
	
	
	
	
	
	
	
	
	
// browser-sync
// gulp.task('browser-sync', function() {
    // browserSync.init({
        // server: {
            // baseDir: "./"
        // }
    // });
// });

// // or...

// gulp.task('browser-sync', function() {
    // browserSync.init({
        // proxy: "yourlocal.dev"
    // });
// });