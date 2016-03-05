var express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    productRoutes = require('./routes/products'),
    vendorRoutes = require('./routes/vendors'),
    app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(function(req,res,next){ //method override
    if (req.query.method)
        req.method = req.query.method;
    next();
});

app.use(function(err,req,res,next){ //error-handling
    if (err)
        res.statusCode(500);
    next();
});

app.use('/products',productRoutes);
app.use('/vendors', vendorRoutes);

module.exports = app;
