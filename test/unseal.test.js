/* global describe, it */

var Iron = require('iron');
var setup = require('../lib/unseal');
var sinon = require('sinon');
var expect = require('chai').expect;


describe('unseal', function() {
  
  describe('using defaults', function() {
    var unseal, keying;
    
    before(function() {
      keying = sinon.spy(function(q, cb){
        switch (q.id) {
        case 'k1':
          return cb(null, [ { secret: '12abcdef7890abcdef7890abcdef7890' } ]);
        case 'rs1':
          return cb(null, [ { secret: 'RS1-12abcdef7890abcdef7890abcdef', algorithm: 'aes128-ctr' } ]);
        default:
          return cb(null, [ { secret: 'API-12abcdef7890abcdef7890abcdef' } ]);
        }
      });
      
      unseal = setup(keying);
    });
    
    
    describe('unsealing from unspecified key', function() {
      var tkn;
      before(function(done) {
        var token = 'Fe26.2**a26b6f7d7ea3e27e43d19e39323e6c71a5b48d92391a152e7ad4b251329886d6*POBMxPB55ziWCaTDrYrKIw*RAtJEMSA4zaRL0_opM-r1g**83fa7e47602b919b42e3d2f65e0e86e776ff251747c04d2b8c8ae2358dc98408*xDBJInWQNdFGKIxFaDCJRGpYoMO9xYYLFv27BYl-LDQ';
        
        unseal(token, function(err, t) {
          tkn = t;
          done(err);
        });
      });
      
      after(function() {
        keying.reset();
      });
      
      it('should query for key', function() {
        expect(keying.callCount).to.equal(1);
        var call = keying.getCall(0);
        expect(call.args[0]).to.deep.equal({
          usage: 'decrypt',
          id: undefined,
          algorithms: [ 'aes256-cbc', 'aes128-ctr' ]
        });
      });
      
      it('should unseal token', function() {
        expect(tkn).to.be.an('object');
        expect(Object.keys(tkn)).to.have.length(2);
        
        expect(tkn).to.deep.equal({
          headers: {
            keyID: undefined
          },
          claims: {
            foo: 'bar'
          }
        });
      });
    }); // unsealing from unspecified key
    
    describe('unsealing from specific key', function() {
      var tkn;
      before(function(done) {
        var token = 'Fe26.2*k1*d07707532253175ab08dd0c852daa869788e27e09cb3357fcd81f099c3d2dc91*SnwigF0hAiavmOZmOSJBAw*xuthZNzot190oBfOOlEcwA**adda380704c56029f5f95abd14ccd8a31c4426a54ce2d31eb885426ca7336cec*iRBd9muS5WQ3_cvcmedjujPX7lWKuABoyGwLXhwN0lU';
        
        unseal(token, function(err, t) {
          tkn = t;
          done(err);
        });
      });
      
      after(function() {
        keying.reset();
      });
      
      it('should query for key', function() {
        expect(keying.callCount).to.equal(1);
        var call = keying.getCall(0);
        expect(call.args[0]).to.deep.equal({
          usage: 'decrypt',
          id: 'k1',
          algorithms: [ 'aes256-cbc', 'aes128-ctr' ]
        });
      });
      
      it('should unseal token', function() {
        expect(tkn).to.be.an('object');
        expect(Object.keys(tkn)).to.have.length(2);
        
        expect(tkn).to.deep.equal({
          headers: {
            keyID: 'k1'
          },
          claims: {
            foo: 'bar'
          }
        });
      });
    }); // unsealing from specific key
    
    describe('unsealing from specific key with aes-128-ctr encryption', function() {
      var tkn;
      before(function(done) {
        var token = 'Fe26.2*rs1*53ec68594e9a1cce7d218204a057b8a4*axVXk6wymK23icn-tV8QsA*na07AthWC4sQHlDlXg**53840cce2a1c9c31e6395c121c7727c80891f440022b2abcd5b81e4a3bbbbbc9*9xzbl80Ih12hzu_tcFAjFdcAlOAGvSBZtw9kZt3pcCM';
        
        unseal(token, function(err, t) {
          tkn = t;
          done(err);
        });
      });
      
      after(function() {
        keying.reset();
      });
      
      it('should query for key', function() {
        expect(keying.callCount).to.equal(1);
        var call = keying.getCall(0);
        expect(call.args[0]).to.deep.equal({
          usage: 'decrypt',
          id: 'rs1',
          algorithms: [ 'aes256-cbc', 'aes128-ctr' ]
        });
      });
      
      it('should unseal token', function() {
        expect(tkn).to.be.an('object');
        expect(Object.keys(tkn)).to.have.length(2);
        
        expect(tkn).to.deep.equal({
          headers: {
            keyID: 'rs1'
          },
          claims: {
            foo: 'bar'
          }
        });
      });
    }); // unsealing from specific key with aes-128-ctr encryption
    
  });
  
});