var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');

const db = require('../models');
const Berita = db.beritas;
const User = db.users;
const Op = db.Sequelize.Op;
const fs = require('fs');
const config = require('../config')

const jwt = require('jsonwebtoken');
const passport = require('passport');

// Get all berita (Including deleted berita)
// GET
router.get('/getall', function(req, res, next) {

  Berita.findAll()
  .then(data => {
    res.json({
      info: "Berhasil Mendapatkan List Berita",
      beritas: data
    });
  })
  .catch(err => {
    res.json({
      info: "Error",
      message: err.message,
      beritas: []
    });
  });
});

// Create a user
// POST
router.post('/register', function (req, res, next) {
  var hash = bcrypt.hashSync(req.body.password, 8);

  var user = {
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: hash,
  }

  User.create(user)
    .then(
      res.json({
        info: "User Berhasil Ditambahkan"
      })
    )
    .catch(err => {
      res.json({
        info: "User Gagal Ditambahkan"
      })
    });

});

// Login
// POST
router.post('/login', function (req, res, next) {

  User.findOne({ where: { username: req.body.username } })
    .then(data => {
      if (data) {
        var loginValid = bcrypt.compareSync(req.body.password, data.password);
        if (loginValid) {

          // Create payload for token
          var payload = {
            userid: data.id,
            username: data.username
          };
          
          // Create token by using jwt
          let token = jwt.sign(
            payload,
            config.secret, {
              expiresIn: '3h'
            }
          );

          let dt = new Date(); // now
          dt.setHours(dt.getHours() + 3);
          res.json({
            success: true,
            token: token,
            expired: dt.toLocaleDateString() + ' ' + dt.toLocaleTimeString()
          });
        } else {
          res.json({
            info: "Gagal Login",
          });
        }
      } else {
        req.json({
          info: "Gagal Login",
        });
      }
    })
    .catch(err => {
      res.json({
        info: "Error",
        message: err.message
      });
    });

});

// Logout
router.get('/logout', function (req, res, next) {
  res.json({
    info: "Logout Sukses"
  })
});

module.exports = router;
