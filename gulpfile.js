var gulp = require('gulp'),
    seed = require('./db/seed');

gulp.task('seed', function(){
  seed.dbconnect()
  .then(function(){
    return seed.seed();
  })
  .then(function(){
    process.exit(0);
  });

});

gulp.task('destroy', function(){
  seed.dbconnect()
  .then(function(){
    return seed.destroy();
  })
  .then(function(){
    process.exit(0);
  });

});
