var app = require("./app"),
    http = require('http');

http.createServer(app).listen(8080, function(){
   console.log("Server is running...");
});
