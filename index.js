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

function Geocoder(appKey) {
  if (!appKey) throw new Error('Geocoder requires a MapQuest App Key');
  this.appKey = appKey;
  this.host = 'open.mapquestapi.com';
  this.path = '/geocoding/v1/address?';
  this.reversePath = '/geocoding/v1/reverse?';
}


/**
 * Interit from `EventEmitter.prototype`
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
  var results = { received: [], rejected: [] };

  if (!Array.isArray(locations)) locations = locations.split();

  function next() {
    var current;

    if (!locations.length) {
      _this.emit('finished', results);
      if (callback) callback(null, results);
      return _this;
    }

    current = locations.pop();

    _this.requestLocation(current, function(err, data) {
      if (err) return callback(err);
      var result = JSON.parse(data).results;
      if (result[0].locations.length) {
        results.received.push(result);
        _this.emit('location:received', result[0].locations[0]);
      } else {
        results.rejected.push(result);
        _this.emit('location:rejected', result[0].providedLocation.location);
      }
      setImmediate(next);
    }, options);
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
  if (!location) throw new Error('Geocoder.requestLocation requires a location');
  options = options || {};
  location = 'location=' + encodeURIComponent(location) + '&key=' + this.appKey;

  return request({
    host: this.host,
    path: options.reverse ? this.reversePath + location : this.path + location,
    port: 80,
    headers: {}
  }, callback);
};


/**
 * get helper
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

    response.on('end', function() {
      return callback(null, data);
    });

  }).on('error', function(err) {
    return callback(err);
  })
};

