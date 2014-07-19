'use strict';


/**
 * Module Dependencies
 */

var http = require('http');
var util = require('util');
var async = require('async');
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
 *  - `finished` Geocoding finished, includes all locations that were successfully geocoded and rejected
 *
 * @param  {String} key MapQuest requires an App Key
 */

function Geocoder(appKey) {
  if (!appKey) throw new Error('Geocoder requires a MapQuest App Key');
  this.maxBatch = 90;
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
 * Geocode a list of locations
 *
 * @param {Array} list of locations
 * @param {Function} callback
 * @api public
 */

Geocoder.prototype.geocode = function(locations, callback) {
  if (!Array.isArray(locations) || !locations.length) {
    throw new Error('Geocoder#geocode needs an array of locations supplied');
  }
  var _this = this; 
  var results = { received: [], rejected: [] };

  function nextBatch() {
    var currentBatch;

    if (!locations.length) {
      _this.emit('finished', results);
      if (callback) callback(null, results);
      return _this;
    }

    currentBatch = locations.splice(0, _this.maxBatch);

    return async.each(currentBatch, function(current, callback) {
      var loc = 'location=' + encodeURIComponent(current) + '&key=' + _this.appKey;
      return request({
        port: 80,
        host: _this.host,
        path: isLatLng(current) ? _this.reversePath + loc : _this.path + loc
      }, function(err, data) {
        if (err) return callback(err);
        var result = JSON.parse(data).results;
        if (result[0].locations.length) {
          results.received.push(result);
          _this.emit('location:received', result[0].locations[0]);
        } else {
          results.rejected.push(result);
          _this.emit('location:rejected', result[0].providedLocation.location);
        }
        return callback();
      });
    }, function(err) {
      if (err) callback(err);
      setImmediate(nextBatch);
    });

  }

  nextBatch();
  return this;
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
  });
}

function isLatLng(str) {
  return str.match(/^\s*[-+]?\d+\.\d+\,\s?[-+]?\d+\.\d+\s*$/);
}

