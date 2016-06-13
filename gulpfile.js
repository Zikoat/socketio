/*jslint node: true, esversion: 6*/
"use strict";
var gulp = require("gulp");

var jshint = require('gulp-jshint');
var opn = require("opn");

var exec = require('gulp-exec');
var nodemon = require("nodemon");

gulp.task("default", ["startServer", "jshint", "watch"]);

gulp.task("jshint", function() {
	console.log("public files changed, sending reload request");
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
	console.log("watching files...");
	gulp.watch("./*.js", ["jshint"]);
	gulp.watch("./public/*", ["jshint"]);
});

gulp.task('startServer', function() {
	nodemon({script: "index.js", "ignore": ["./public"]})
		.on("start", () => {console.log("server started");});
});