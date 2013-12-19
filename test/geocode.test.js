var Geocoder = require('../index')
  , should = require('should');


var testData = {
  key: 'yourAppKeyHere',
  validAddressList: ['Kabul, Afghanistan' , 'New York, USA', 'Unter den Linden 17, Berlin, Germany'],
  invalidAddressList: ['Kabul, Afghanistan', 'foo, bar, baz', 'Unter den Linden 17, Berlin, Germany'],
  validAddress: 'Unter den Linden 17, Berlin, Germany',
  invalidAddress: 'foo, bar, baz',
  latLong: '52.516815, 13.390421'
}

describe('Geocoder', function() {

  beforeEach(function() {
    geocoder = new Geocoder(testData.key);
  });

  describe('#geocode("valid address")', function() {
    it('should return received data', function(done) {
      geocoder.geocode(testData.validAddress, function(geocodedLocations) {
        should.exist(geocodedLocations.received);
        should.not.exist(geocodedLocations.rejected);
        geocodedLocations.received.should.not.be.empty;
        done();
      })
    })
  });


  describe('#geocode("invalid address")', function() {
    it('should return rejected data', function(done) {
      geocoder.geocode(testData.invalidAddress, function(geocodedLocations) {
        should.exist(geocodedLocations.rejected);
        should.not.exist(geocodedLocations.received);
        geocodedLocations.rejected.should.not.be.empty;
        done();
      })
    })
  });


  describe('#geocode(lat, long")', function() {
    it('should return received data', function(done) {
      geocoder.geocode(testData.latLong, function(geocodedLocations) {
        should.exist(geocodedLocations.received);
        should.not.exist(geocodedLocations.rejected);
        geocodedLocations.received.should.not.be.empty;
        done();
      }, { reverse: true });
    })
  });


  describe('#geocode([valid list])', function() {
    it('should return received data', function(done) {
      geocoder.geocode(testData.validAddressList, function(geocodedLocations) {
        should.exist(geocodedLocations.received);
        should.not.exist(geocodedLocations.rejected);
        geocodedLocations.received.should.have.length(3);
        done();
      })

    })
  });


  describe('#geocode([invalid list])', function() {
    it('should return received and rejected data', function(done) {
      geocoder.geocode(testData.invalidAddressList, function(geocodedLocations) {
        should.exist(geocodedLocations.received);
        should.exist(geocodedLocations.rejected);
        geocodedLocations.rejected.should.have.length(1);
        geocodedLocations.received.should.have.length(2);
        done();
      })
    })
  });
});
