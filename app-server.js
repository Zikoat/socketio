var express = require('express');

var app = express();

app.use(express.static('./'));
app.use(express.static('./node_modules/bootstrap/dist'));

app.listen(8080);

console.log("Polling server running at localhost:8080");