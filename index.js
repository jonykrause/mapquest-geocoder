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
 *   - `location:received` location successfully received
 *   - `location:rejected` location lookup failed, got rejected
 *   - `locations:received` all locations that are successfully received
 *   - `locations:rejected` all locations that got rejected
 */


function Geocoder () {
  this.config = {
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
  var received = []
    , rejected = []
    , self = this;

  if (!Array.isArray(locations)) locations = locations.split();

  function nxtLocation(){

    if (!locations.length) {
      self.emit('locations:received', received);
      self.emit('locations:rejected', rejected);
      return self;
    }

    var currentLocation = locations.pop();

    self.requestLocation(currentLocation, function(err, data){
      if (err) throw err;

      var result = JSON.parse(data).results;

      if (result[0].locations.length) {
        self.emit('location:received', result[0].locations[0]);
        received.push(result);
      }
      else {
        self.emit('location:rejected', result[0].providedLocation.location);
        rejected.push(result);
      }
      nxtLocation();
    }, options )
  }
  nxtLocation();
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
    host: this.config.host,
    path: options.reverse ? this.config.reversePath + 'location=' + encodeURIComponent(location) : this.config.path + 'location=' + encodeURIComponent(location),
    port: this.config.port,
    headers: {}
  };

  return this.request(params, callback);
};


/**
 * Request wrapper
 *
 * @param {Object} options
 * @param {Function} callback
 */

Geocoder.prototype.request = function(params, callback) {
  http.get( params, function ( response ) {
    var data = "", result;
    response.on("error", function ( err ) {
      return callback(err);
    });

    response.on("data", function ( chunk ) {
      data += chunk;
    });

    response.on("end", function ( argument ) {
      return callback(null, data);
    });

  }).on("error", function (err) {
    return callback(err);
  })
};

