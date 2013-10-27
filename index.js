'use strict';


/**
 * Module Dependencies
 */

var http = require('http')
  , util = require('util')
  , EventEmitter = require('events').EventEmitter;


/**
 * Expose `Geocoder`.
 */

module.exports = Geocoder;


/**
 * Initialize Geocoder
 *
 * Events:
 *
 *  - `location:received` Location was successfully geocoded and received
 *  - `location:rejected` Location got rejected, no result
 *  - `geocoding:finished` Geocoding finished, includes all locations that were successfully geocoded and rejected
 */


function Geocoder () {
  this.service = {
    host: 'open.mapquestapi.com',
    path: '/geocoding/v1/address?',
    reversePath: '/geocoding/v1/reverse?',
    port: 80
  }
}


/**
 * Interit from `EventEmitter.prototype`.
 */

util.inherits(Geocoder, EventEmitter);


/**
 * Geocode locations
 *
 * Options:
 *
 *    - `reverse`: {Boolean} reverse or normal geocode
 *
 * @param  {Array} locations
 * @param  {Object} options
 */


Geocoder.prototype.geocode = function(locations, options) {
  var self = this, geocoded = {};

  if (!Array.isArray(locations)) locations = locations.split();

  var requestLocations = function* (locs) {
    for (let loc in locs) {
      yield self.requestLocation(loc, function(err, data) {
        if (err) throw err;
        var result = JSON.parse(data).results;
        if (result[0].locations.length) {
          geocoded.received = geocoded.received || [];
          geocoded.received.push(result);
          self.emit('location:received', result[0].locations[0]);
        }
        else {
          geocoded.rejected = geocoded.rejected || [];
          geocoded.rejected.push(result);
          self.emit('location:rejected', result[0].providedLocation.location);
        }
        gen.next();
      }, options )
      self.emit('geocoding:finished', geocoded);
    };
  }

  var gen = requestLocations(locations);
  gen.next();

  return this;
};


/**
 * Request MapQuest Open Geocoding API Web Service
 *
 * @param  {String}   location
 * @param  {Function} callback
 * @param  {Object}   options
 */

Geocoder.prototype.requestLocation = function(location, callback, options) {
  if (!location) throw new Error( "Geocoder.requestLocation requires a location");

  if (!options) options = {};

  var params = {
    host: this.service.host,
    path: options.reverse ? this.service.reversePath + 'location=' + encodeURIComponent(location) : this.service.path + 'location=' + encodeURIComponent(location),
    port: this.service.port,
    headers: {}
  };

  return this.request(params, callback);
};


/**
 * Request wrapper
 *
 * @param {Object} params
 * @param {Function} callback
 */

Geocoder.prototype.request = function(params, callback) {
  http.get( params, function (response) {
    var data = '';
    response.on('error', function(err) {
      return callback(err);
    });

    response.on('data', function(chunk) {
      data += chunk;
    });

    response.on('end', function(argument) {
      return callback(null, data);
    });

  }).on('error', function(err) {
    return callback(err);
  })
};

