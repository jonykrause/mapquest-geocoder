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
 * @param {Array} locations
 * @param {Object} options
 * @return {Geocoder} chaining
 */

Geocoder.prototype.geocode = function(locations, options) {
  var self = this, geocoded = {};

  if (!Array.isArray(locations)) locations = locations.split();

  control(function* () {
    for (let i = 0, l = locations.length; i < l; i++) {
      var response = yield self.requestLocation(locations[i], options);
      var result = JSON.parse(response).results;
      var filtered = self.addResult(result, geocoded);
    }
    self.emit('geocoding:finished', geocoded);
  });
  return this;
};


/**
 * Adds result to specific bucket, filters received, rejected
 *
 * @param {Object} result
 * @param {Array} bucket
 * @return {Array} bucket
 */
Geocoder.prototype.addResult = function(result, bucket) {
  if (result[0].locations.length) {
    bucket.received = bucket.received || [];
    bucket.received.push(result);
    this.emit('location:received', result[0].locations[0]);
  } else {
    bucket.rejected = bucket.rejected || [];
    bucket.rejected.push(result);
    this.emit('location:rejected', result[0].providedLocation.location);
  }
  return bucket;
};


/**
 * Request MapQuest Open Geocoding API Web Service
 *
 * @param {String} location
 * @param {Function} callback
 * @param {Object} options
 * @return {Function} encapsulate request
 */

Geocoder.prototype.requestLocation = function(location, options) {
  if (!location) throw new Error( "Geocoder.requestLocation requires a location");
  if (!options) options = {};
  var params = {
    host: this.service.host,
    path: options.reverse ? this.service.reversePath + 'location=' + location : this.service.path + 'location=' + location,
    port: this.service.port,
    headers: {}
  };

  return function (callback) {
    request(params, callback);
  }
};


/**
 * Generator controller
 *
 * @param {Generator Function} generator
 */

function control(generator) {
  var gen = generator();
  function next(err, data) {
    if (err) return gen.throw(err);
    var state = gen.send(data);
    if (!state.done) {
      state.value(next);
    }
  }
  next();
};


/**
 * Request wrapper
 *
 * @param {Object} params
 * @param {Function} callback
 */

function request(params, callback) {
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

