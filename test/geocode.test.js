var Geocoder = require('../index');
var should = require('should');


var fixtures = {
  validAddressList: ['52.516815, 13.390421', 'Kabul, Afghanistan' , 'New York, USA', 'Unter den Linden 17, Berlin, Germany'],
  invalidAddressList: ['Kabul, Afghanistan', 'foo, bar, baz', 'Unter den Linden 17, Berlin, Germany'],
  validAddress: ['Unter den Linden 17, Berlin, Germany'],
  invalidAddress: ['foo, bar, baz'],
  latLong: ['52.516815, 13.390421']
}

describe('Geocoder', function() {

  beforeEach(function() {
    geocoder = new Geocoder('yourAppKeyHere');
  });

  describe('#geocode("valid address")', function() {
    it('should return received data', function(done) {
      geocoder.geocode(fixtures.validAddress, function(err, results) {
        if (err) throw err;
        results.rejected.should.be.empty;
        results.received.should.not.be.empty;
        done();
      })
    })
  });


  describe('#geocode("invalid address")', function() {
    it('should return rejected data', function(done) {
      geocoder.geocode(fixtures.invalidAddress, function(err, results) {
        if (err) throw err;
        results.rejected.should.not.be.empty;
        results.received.should.be.empty;
        done();
      })
    })
  });


  describe('#geocode(lat, long")', function() {
    it('should return received data', function(done) {
      geocoder.geocode(fixtures.latLong, function(err, results) {
        if (err) throw err;
        results.rejected.should.be.empty;
        results.received.should.not.be.empty;
        done();
      }, { reverse: true });
    })
  });


  describe('#geocode([valid list])', function() {
    it('should return received data', function(done) {
      geocoder.geocode(fixtures.validAddressList, function(err, results) {
        if (err) throw err;
        results.rejected.should.be.empty;
        results.received.should.not.be.empty;
        results.received.should.have.length(4);
        done();
      })

    })
  });


  describe('#geocode([invalid list])', function() {
    it('should return received and rejected data', function(done) {
      geocoder.geocode(fixtures.invalidAddressList, function(err, results) {
        if (err) throw err;
        results.rejected.should.not.be.empty;
        results.received.should.not.be.empty;
        results.rejected.should.have.length(1);
        results.received.should.have.length(2);
        done();
      })
    })
  });
});
