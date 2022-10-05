'use strict'; // single instance

const passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

// db
const db = require('../models');
const User = db.users;
const Op = db.Sequelize.Op;

var config = require('../config')
var opts = {}

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = config.secret;

passport.use(new JwtStrategy(opts, function(jwt_payload, done){
    User.findByPk(jwt_payload.userid)
    .then(data => {
    if (data){
        return done(null, data);
    }else{
        return done("user tidak terdaftar", false);
    }
    })
    .catch(err => {
        return done("user tidak terdaftar", false);
    });

}));