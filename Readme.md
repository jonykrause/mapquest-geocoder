# MapQuest Geocoder

Geocoder using the [MapQuest Open Geocoding API Web Service](http://open.mapquestapi.com/geocoding/).


## Example

```js
var Geocoder = require('../../index');
var geocoder = new Geocoder('yourAppKeyHere');


geocoder
  .geocode(['52.516815, 13.390421'], function(err, locations) {
    if (err) throw err;
    console.log('locations received: ', locations.received);
    console.log('locations rejected: ', locations.rejected);
  }, { reverse: true })

  .geocode('Unter den Linden 17, Berlin, Germany', function(err, locations) {
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
```

## Events

   - `location:received` Location was successfully geocoded and received
   - `location:rejected` Location got rejected, no result
   - `finished` Geocoding finished, includes all locations that were successfully geocoded and rejected


## API


### Geocoder#geocode([locations], callback, options)

Geocodes a list of locations. Supports the option:
  - reverse: ```{Boolean}``` Sets called URL for reversed geocoding


## Tests

```
$ npm install
$ npm test
```


## License

MIT