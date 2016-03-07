var gulp = require('gulp'),
    seed = require('./db/seed');

gulp.task('seed', function(){
  seed.dbconnect()
  .then(function(){
    return seed.destroy();
  })
  .then(function(){
    return seed.seed();
  })
  .then(function(){
    process.exit(0);
  });

});
