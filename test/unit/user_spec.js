'use strict';


process.env.DBNAME = 'airbnb';
var expect = require('chai').expect;
var User;
//var fs = require('fs');
//var exec = require('child_process').exec;

describe('User', function(){

  before(function(done){
    var initMongo = require('../../app/lib/init-mongo');
    initMongo.db(function(){
      User = require('../../app/models/user');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.dropDatabase(function(err, result){
      done();
    });
  });

  describe('new', function(){
    it('should create a new User object', function(done){
      var u1 = new User({email:'adam@nomail.com', password:'1234', role:'host'});
      expect(u1.email).to.equal('adam@nomail.com');
      expect(u1.password).to.equal('1234');
      expect(u1.role).to.equal('host');
      done();
    });
  });
});
