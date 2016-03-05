var expect = require('chai').expect,
    request = require('supertest-as-promised')(require('../app')),
    seed = require('../db/seed');
    
describe('GET routes', function(){
   it('/', function(){
       return request.get('/').expect(200);
   }); 
});