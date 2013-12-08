var Geocoder = require('../../index')
  , geocoder = new Geocoder('yourAppKeyHere');


geocoder
  .geocode(['52.516815, 13.390421'], { reverse: true })
  .geocode('Unter den Linden 17, Berlin, Germany')
  .geocode(['Afghanistan, Kabul', 'New York, USA', 'Unter den Linden 17, Berlin, Germany'])


geocoder
  .on('location:received', function(location){
    console.log('location received: ', location);
  })
  .on('location:rejected', function(location){
    console.log('location rejected: ', location);
  })
  .on('geocoding:finished', function(locations){
    console.log('locations received: ', locations.received);
    console.log('locations rejected: ', locations.rejected);
  });