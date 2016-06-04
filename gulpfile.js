var gulp = require("gulp");

var jshint = require('gulp-jshint');
var opn = require("opn");

var exec = require('gulp-exec');
var nodemon = require("nodemon");

gulp.task("default", ["startServer", "opnPage", "jshint", "watch"]);

gulp.task("jshint", function() {
	console.log("linting...");
	return gulp.src([
			"./**/*.js", 
			"!./node_modules/**/*", 
			"!./public/phaser.*js",
			"!./public/jquery.js",
			"!./public/fastclick.js"])
		.pipe(jshint())
		.pipe(jshint.reporter("default"));
});

gulp.task("opnPage", function() {
	opn("http://localhost:3000");
});

gulp.task("watch", function() {
	gulp.watch("./*.js", ["jshint"]);
	gulp.watch("./public/*", ["opnPage"]);
});

gulp.task('startServer', function() {
	nodemon({script: "index.js"})
		.on("start", () => {});
});

//gulp.watch('./**/*.js', function(event) {
  //console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  //jshint(event.path);
//});

/* gulp todo
watch public js files. jshint and open chrome
watch server side files. jshint and restart server
task: 
nodemon(index.js)

/*gulp.watch("refresh", function() {

});*/