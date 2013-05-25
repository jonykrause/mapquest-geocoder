# MapQuest Geocoder

Node Geocoder using the [MapQuest Open Geocoding API Web Service](http://open.mapquestapi.com/geocoding/).


## Example

```js
var Geocoder = require('../../index') 
  , geocoder = new Geocoder;


geocoder
  .geocode(['52.516815, 13.390421'], { reverse: true })
  .geocode('Unter den Linden 17, Berlin, Germany')
  .geocode(['Afghanistan, Kabul', 'Albania, Tirana', 'Unter den Linden 17, Berlin, Germany'])


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
```

## Events

   - `location:received` Location was successfully geocoded and received
   - `location:rejected` Location got rejected, no result
   - `geocoding:finished` Geocoding finished, includes all locations that were successfully geocoded and rejected


## API


### Geocoder#geocode([locations], options)

Geocodes a list of locations. Supports the option: 
  - reverse: ```{Boolean}``` Sets called URL for reversed geocoding

  
## Tests

```
$ npm install
$ mocha
```



## License

MIT