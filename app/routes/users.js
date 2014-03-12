'use strict';

var User = require('../models/user');

exports.index = function(req, res){
  res.render('home/index', {title: 'Express Template'});
};

exports.fresh = function(req, res){
  res.render('users/fresh', {title:'register user'});
};

exports.create = function(req, res){
  var user = new User(req.body);
  user.register(function(){
    if(user._id){
      res.redirect('/');
    } else {
      res.render('users/fresh', {title:'register user'});
    }
  });
};
