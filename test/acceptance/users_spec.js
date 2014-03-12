'use strict';

process.env.DBNAME = 'airbnb-test';
var request = require('supertest');
//var fs = require('fs');
//var exec = require('child_process').exec;
var app = require('../../app/app');
var expect = require('chai').expect;
var User, u3;
//var cookie;
//var u1;

describe('user', function(){
  before(function(done){
    request(app)
    .get('/')
    .end(function(err, res){
      User = require('../../app/models/user');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.dropDatabase(function(err, result){
      u3 = new User({email:'sam@nomail.com', password:'1234', role:'host'});
      u3.register(function(){
        done();
      });
    });
  });

  describe('GET/register', function(){
    it('should display the register page', function(done){
      request(app)
      .get('/register')
      .end(function(er, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('register');
        done();
      });
    });
  });

  describe('POST/register', function(){
    it('should register a new user', function(done){
      request(app)
      .post('/register')
      .field('email', 'new@new.com')
      .field('password', '1234')
      .field('role', 'host')
      .end(function(er, res){
        expect(res.status).to.equal(302);
        expect(res.text).to.include('Moved Temporarily');
        done();
      });
    });

    it('should inot register a new user for duplicate email', function(done){
      request(app)
      .post('/register')
      .field('email', 'sam@nomail.com')
      .field('password', '1234')
      .field('role', 'host')
      .end(function(er, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('register');
        done();
      });
    });
  });
});

