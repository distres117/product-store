var app = require("./app"),
    http = require('http'),
    db = require('./db/db');

db()
.then(function(){
    console.log("db connected...");
    http.createServer(app).listen(process.env.PORT || 8080, function(){
        console.log("Server is running...");
    });
})

