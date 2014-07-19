var Geocoder = require('../../index');
var geocoder = new Geocoder('yourAppKeyHere');


geocoder
  .geocode(['52.516815, 13.390421'], function(err, locations) {
    if (err) throw err;
    console.log('locations received: ', locations.received);
    console.log('locations rejected: ', locations.rejected);
  })

  .geocode(['Unter den Linden 17, Berlin, Germany'], function(err, locations) {
    if (err) throw err;
    console.log('locations received: ', locations.received);
    console.log('locations rejected: ', locations.rejected);
  })

  .geocode(['Afghanistan, Kabul', 'New York, USA', 'Unter den Linden 17, Berlin, Germany'], function(err, locations) {
    if (err) throw err;
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
  .on('finished', function(locations){
    console.log('locations received: ', locations.received);
    console.log('locations rejected: ', locations.rejected);
  })