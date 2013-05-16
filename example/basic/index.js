var geocoder = require('../../index');
var geocoder = new Geocoder;



geocoder
  .geocode(['34.549523, 69.167494'], { reverse: true })
  .geocode('Unter den Linden 17, Berlin, Germany')
  .geocode(['Afghanistan, Kabul', 'Albania, Tirana'])


geocoder
  .on('location:received', function(loc){
    console.log('location received: ',loc);
  })
  .on('location:rejected', function(loc){
    console.log('location rejected: ',loc);
  })
  .on('locations:received', function(locs){
    console.log('locations received: ',locs);
  })
  .on('locations:rejected', function(locs){
    console.log('locations rejected: ',locs);
  });