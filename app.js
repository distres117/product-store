var express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    routes = require('./routes'),
    app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(function(req,res,next){ //method override
    if (req.query.method)
        req.method = req.query.method;
    next();
})

app.use(function(err,req,res,next){ //error-handling
    if (err)
        res.statusCode(500);
    next();
})

app.use(routes);

module.exports = app;