/* jshint expr:true */

'use strict';

var Mongo = require('mongodb');

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
      var u3 = new User({email:'adam@nomail.com', password:'1234', role:'host'});
      u3.register(function(){
        done();
      });
    });
  });

  describe('new', function(){
    it('should create a new User object', function(done){
      var u1 = new User({email:'adam2@nomail.com', password:'1234', role:'host'});
      expect(u1.email).to.equal('adam2@nomail.com');
      expect(u1.password).to.equal('1234');
      expect(u1.role).to.equal('host');
      done();
    });
  });

  describe('register', function(){
    it('should register a new User', function(done){
      var u1 = new User({email:'nsstestemail@yahoo.com', password:'1234', role:'host'});
      u1.register(function(err, body){
        expect(err).to.be.null;
        expect(u1.password).to.have.length(60);
        expect(u1._id).to.be.instanceof(Mongo.ObjectID);
        body = JSON.parse(body);
        expect(body.id).to.be.ok;
        done();
      });
    });

    it('should not register a new User because of duplicate email', function(done){
      var u2 = new User({email:'nsstestemail@yahoo.com', password:'1234', role:'host'});
      var u3 = new User({email:'nsstestemail@yahoo.com', password:'1234', role:'host'});
      u2.register(function(err){
        u3.register(function(err){
          expect(u3._id).to.be.undefined;
          done();
        });
      });
    });
  });

  describe('.findByEmailAndPassword', function(){
    it('should find a user by email and password', function(done){
      var u2 = new User({email:'nsstes@noemail.com', password:'1234', role:'host'});
      var u3 = new User({email:'test@noemail.com', password:'1234', role:'host'});
      u2.register(function(){
        u3.register(function(){
          var email = u2.email;
          var password = '1234';
          User.findByEmailAndPassword(email, password, function(user){
            expect(user.email).to.equal('nsstes@noemail.com');
            expect(user.password).to.not.equal('1234');
            done();
          });
        });
      });
    });

    it('should inot find a user by email and password bc wrong email', function(done){
      var u2 = new User({email:'nsstes@noemail.com', password:'1234', role:'host'});
      var u3 = new User({email:'test@noemail.com', password:'1234', role:'host'});
      u2.register(function(){
        u3.register(function(){
          var email = 'test1@noemail.com';
          var password = '1234';
          User.findByEmailAndPassword(email, password, function(user){
            expect(user).to.be.null;
            done();
          });
        });
      });
    });

    it('should not find a user by email and password bc wrong email', function(done){
      var u2 = new User({email:'nsstes@noemail.com', password:'1234', role:'host'});
      var u3 = new User({email:'test@noemail.com', password:'1234', role:'host'});
      u2.register(function(){
        u3.register(function(){
          var email = 'test@noemail.com';
          var password = '12345';
          User.findByEmailAndPassword(email, password, function(user){
            expect(user).to.be.null;
            done();
          });
        });
      });
    });
  });
});
