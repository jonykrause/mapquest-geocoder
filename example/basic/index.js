var Geocoder = require('../../index') 
  , geocoder = new Geocoder;


geocoder
  .geocode(['52.516815, 13.390421'], { reverse: true })
  .geocode('Unter den Linden 17, Berlin, Germany')
  .geocode(['Afghanistan, Kabul', 'Albania, Tirana', 'Unter den Linden 17, Berlin, Germany'])


geocoder
  .on('location:received', function(loc){
    console.log('location received: ',loc);
  })
  .on('location:rejected', function(loc){
    console.log('location rejected: ',loc);
  })
  .on('geocoding:finished', function(locations){
    console.log('locations received: ',locations.received);
    console.log('locations rejected: ',locations.rejected);
    console.log('finished');
  });