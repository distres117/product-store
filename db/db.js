var mongoose = require('mongoose');
var db;
module.exports = function(){
    if (!db){
        var connStr = process.env.MONGOLAB_URI || 'mongodb://localhost/supplyStore'
        db =  mongoose.connect(connStr);
    }
    return db;
}