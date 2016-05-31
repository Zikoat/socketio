var gulp = require("gulp");

var jshint = require('gulp-jshint');
var opn = require("opn");
var gls = require('gulp-live-server');
var exec = require('gulp-exec');



gulp.task("jshint", function() {
	console.log("linting...")
	return gulp.src([
			"./**/*.js", 
			"!./node_modules/**/*", 
			"!./public/phaser.*js",
			"!./public/jquery.js",
			"!./public/fastclick.js"])
		.pipe(jshint())
		.pipe(jshint.reporter("default"));
});

gulp.task("opnimg", function() {
});

gulp.task("default", ["jshint", "opnimg", "server"]);

gulp.task("watch", function() {
	gulp.watch("./*", ["jshint", "serve"]);
	gulp.watch("./public/*", function() {
		// reload chrome
	})
})

gulp.task('server', function() {
	exec("node index.js");
	/*
    var server = gls.new('index.js');
    server.start();*/
});

gulp.watch('./**/*.js', function(event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  jshint(event.path);
});

/* gulp todo
watch public js files. jshint and open chrome
watch server side files. jshint and restart server
task: 

/*gulp.watch("refresh", function() {

});*/