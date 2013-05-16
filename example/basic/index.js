var Geocoder = require('../../index');
var geocoder = new Geocoder();


geocoder
  .on('location:received', function(loc){
    console.log('received: ',loc);
  })
  .on('location:rejected', function(loc){
    console.log('rejected: ',loc);
  })
  .on('locations:received', function(locs){
    console.log('all received: ',locs);
  })
  .on('locations:rejected', function(locs){
    console.log('all rejected: ',locs);
  });


geocoder
  .geocode(['34.549523, 69.167494'], { reverse: true })
  .geocode('Unter den Linden 17, Berlin, Germany')
  .geocode(['Afghanistan, Kabul'])
  .geocode(['Afghanistan, Kabul', 'Albania, Tirana'])
