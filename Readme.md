# MapQuest Geocoder

Node Geocoder using the [MapQuest Open Geocoding API Web Service](http://open.mapquestapi.com/geocoding/).


## Example

```js
var Geocoder = require('../../index');
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
```

## Events

   - `location:received` Location was successfully geocoded and received
   - `location:rejected` Location got rejected, no result
   - `locations:received` Geocoding finished, includes all locations that were successfully geocoded
   - `locations:rejected` Geocoding finished, includes all locations that were rejected


## API


### Geocoder#geocode([locations], options)

Geocodes a list of locations. Supports the option: 
  - reverse: ```{Boolean}``` Sets called URL for reversed geocoding

  
## Tests

Todo^^


## License

MIT