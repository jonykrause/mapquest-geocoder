var Geocoder = require('../index');
var should = require('should');


var fixtures = {
  key: 'yourAppKeyHere',
  validAddressList: ['Kabul, Afghanistan' , 'New York, USA', 'Unter den Linden 17, Berlin, Germany'],
  invalidAddressList: ['Kabul, Afghanistan', 'foo, bar, baz', 'Unter den Linden 17, Berlin, Germany'],
  validAddress: 'Unter den Linden 17, Berlin, Germany',
  invalidAddress: 'foo, bar, baz',
  latLong: '52.516815, 13.390421'
}

describe('Geocoder', function() {

  beforeEach(function() {
    geocoder = new Geocoder(fixtures.key);
  });

  describe('#geocode("valid address")', function() {
    it('should return received data', function(done) {
      geocoder.geocode(fixtures.validAddress, function(err, geocoded) {
        if (err) throw err;
        should.exist(geocoded.received);
        should.not.exist(geocoded.rejected);
        geocoded.received.should.not.be.empty;
        done();
      })
    })
  });


  describe('#geocode("invalid address")', function() {
    it('should return rejected data', function(done) {
      geocoder.geocode(fixtures.invalidAddress, function(err, geocoded) {
        if (err) throw err;
        should.exist(geocoded.rejected);
        should.not.exist(geocoded.received);
        geocoded.rejected.should.not.be.empty;
        done();
      })
    })
  });


  describe('#geocode(lat, long")', function() {
    it('should return received data', function(done) {
      geocoder.geocode(fixtures.latLong, function(err, geocoded) {
        if (err) throw err;
        should.exist(geocoded.received);
        should.not.exist(geocoded.rejected);
        geocoded.received.should.not.be.empty;
        done();
      }, { reverse: true });
    })
  });


  describe('#geocode([valid list])', function() {
    it('should return received data', function(done) {
      geocoder.geocode(fixtures.validAddressList, function(err, geocoded) {
        if (err) throw err;
        should.exist(geocoded.received);
        should.not.exist(geocoded.rejected);
        geocoded.received.should.have.length(3);
        done();
      })

    })
  });


  describe('#geocode([invalid list])', function() {
    it('should return received and rejected data', function(done) {
      geocoder.geocode(fixtures.invalidAddressList, function(err, geocoded) {
        if (err) throw err;
        should.exist(geocoded.received);
        should.exist(geocoded.rejected);
        geocoded.rejected.should.have.length(1);
        geocoded.received.should.have.length(2);
        done();
      })
    })
  });
});
