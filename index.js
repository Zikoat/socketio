/*jslint node: true */
"use strict";
var express = require("express");
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var syncedVar = 20;

app.use(express.static("public"));

io.on('connection', function(socket) {
	process.stdout.write('a user connected\n');

	socket.on('disconnect', function() {
		process.stdout.write('a user disconnected\n');
	});

	socket.on("increase", function() {
		//--------
		syncedVar++;
		//--------
		io.emit("increase", syncedVar);
		// console.log("count: ", syncedVar);
		process.stdout.write('\rcount: ' + syncedVar);
	});

	socket.on("reset", function() {
		syncedVar = 0;
		io.emit("reset");
		console.log("RESET");
	});

	socket.emit("increase", syncedVar);

});

http.listen(3000, function() {
	console.log("listening on localhost:3000\n");
	//http.close();
});