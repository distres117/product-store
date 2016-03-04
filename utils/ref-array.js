var mongoose = require('mongoose');
    

function RefArray(model, fields, arr,fn){
    for (var i in arr)
        this.objectIds.push(fn ? fn() : mongoose.Types.ObjectId());
    this.arr = arr;
    this.model = model;
    this.fields = fields;
}

RefArray.prototype.objectIds = [];

RefArray.prototype.build = function(){
    var fields = this.fields.concat(['_id']);
    var oids = this.objectIds;
  for (var obj of this.arr){
    for(var field in obj){
        if (fields.indexOf(field) > -1)
            obj[field] = Array.isArray(obj[field]) ? obj[field].map(i=>oids[i]) : oids[obj[field]];
    }
  }
  var model = mongoose.model(this.model);
  return this.arr.map(i=>new model(i))
}

module.exports = RefArray;