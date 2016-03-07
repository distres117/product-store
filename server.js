var app = require("./app"),
    http = require('http');

http.createServer(app).listen(process.env.PORT || 8080, function(){
   console.log("Server is running...");
});
