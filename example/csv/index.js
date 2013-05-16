'use strict';


var records = []
  , fs = require('fs')
  , Geocoder = require('../../index')
  , validate = require('./validate')
  , csv = require('csv')
  , colors = require('colors')
  , INPUT = __dirname + '/locations.csv'
  , OUTPUT = __dirname + '/result/locations.out.json'
  , geocoder = new Geocoder();


/**
 *  Hook in events to get data
 */

geocoder.on('locations:received', function(locs){
  console.log('EOF, converted ' + locs.length +' entries. Writing to ' + OUTPUT + '\n');
  return fs.createWriteStream(OUTPUT).write(JSON.stringify(locs));

});

geocoder.on('locations:rejected', function(locs){
  console.log('No results for ' + JSON.stringify(locs));
  return fs.createWriteStream(__dirname + '/result/error.json').write(JSON.stringify(locs));
});


/**
 * Read csv, start geocoding
 */

csv()
  .from(INPUT)
  .on('record', function(row){
    records.push(validate(row));
  })
  .on('end', function(){
    geocoder.geocode(records);
  });


