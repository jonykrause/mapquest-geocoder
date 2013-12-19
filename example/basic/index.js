var Geocoder = require('../../index')
  , geocoder = new Geocoder('Fmjtd%7Cluubn16y25%2Cas%3Do5-90aggu');


geocoder
  .geocode(['52.516815, 13.390421'], function(locations) {
    console.log('locations received: ', locations.received);
    console.log('locations rejected: ', locations.rejected);
  }, { reverse: true })

  .geocode('Unter den Linden 17, Berlin, Germany', function(locations) {
    console.log('locations received: ', locations.received);
    console.log('locations rejected: ', locations.rejected);
  })

  .geocode(['Afghanistan, Kabul', 'New York, USA', 'Unter den Linden 17, Berlin, Germany'], function(locations) {
    console.log('locations received: ', locations.received);
    console.log('locations rejected: ', locations.rejected);
  });


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
  })