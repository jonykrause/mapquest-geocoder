'use strict';


var records = []
  , fs = require('fs')
  , Geocoder = require('../../index')
  , validate = require('./validate')
  , csv = require('csv')
  , INPUT = __dirname + '/locations.csv'
  , OUTPUT = __dirname + '/result/locations.out.json'
  , geocoder = new Geocoder('yourAppKeyHere');



//  Read csv, start geocoding
csv()
  .from(INPUT)
  .on('record', function(row){
    records.push(validate(row));
  })
  .on('end', function(){
    geocoder.geocode(records, function(err, locations) {
      if (err) throw err;
      console.log('EOF, converted ' + locations.received.length +' entries. Writing to ' + OUTPUT + '\n');
      fs.createWriteStream(OUTPUT).write(JSON.stringify(locations.received));
      console.log('No results for ' + JSON.stringify(locations.rejected));
      return fs.createWriteStream(__dirname + '/result/error.json').write(JSON.stringify(locations.rejected));
    });
  });


