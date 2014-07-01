'use strict';


/**
 * Module Dependencies
 */

var http = require('http');
var util = require('util');
var EventEmitter = require('events').EventEmitter;


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
 *
 * @param  {String} key MapQuest requires an App Key
 */

function Geocoder (key) {
  if (!key) throw new Error('Geocoder requires a MapQuest App Key');
  this.service = {
    host: 'open.mapquestapi.com',
    path: '/geocoding/v1/address?',
    reversePath: '/geocoding/v1/reverse?',
    key: key
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
 * @param  {Callback} Function takes geocoding result
 */


Geocoder.prototype.geocode = function(locations, callback, options) {
  var _this = this; 
  var geocoded = {};

  if (!Array.isArray(locations)) locations = locations.split();

  function next() {
    var current;

    if (!locations.length) {
      _this.emit('geocoding:finished', geocoded);
      if (callback) callback(null, geocoded);
      return _this;
    }

    current = locations.pop();

    _this.requestLocation(current, function(err, data) {
      if (err) return callback(err);
      var result = JSON.parse(data).results;
      if (result[0].locations.length) {
        geocoded.received = geocoded.received || [];
        geocoded.received.push(result);
        _this.emit('location:received', result[0].locations[0]);
      } else {
        geocoded.rejected = geocoded.rejected || [];
        geocoded.rejected.push(result);
        _this.emit('location:rejected', result[0].providedLocation.location);
      }
      setImmediate(next);
    }, options )
  }
  next();
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
  var locationPath = encodeURIComponent(location) + '&key=' + this.service.key;
  var params = {
    host: this.service.host,
    path: options.reverse ? this.service.reversePath + 'location=' + locationPath : this.service.path + 'location=' + locationPath,
    port: 80,
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

