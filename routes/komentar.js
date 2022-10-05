var express = require('express');
var router = express.Router();

const db = require('../models');
const User = db.users;
const Berita = db.beritas;
const Komentar = db.komentars;
const Op = db.Sequelize.Op;

// Create (Post) Sebuah Komentar
// POST
router.post('/tambah/:id', function (req, res, next) {
    // Params id disini adalah id berita yang memiliki tersebut
    var id = parseInt(req.params.id);

    try {
        var komentar = {
            text: req.body.text,
            beritumId: id
        }

        Komentar.create(komentar)
            .then(() => {
                res.json({
                    info: "Komentar Berhasil Ditambahkan ke Berita dengan Id " + id,
                    komentar: komentar
                });
            });

    } catch (error) {
        console.log(error);
        return res.send(`Error: ${error}`);
    }
});

// Reply Sebuah Komentar
// POST
router.post('/reply/:id', function (req, res, next) {
    // Params id disini adalah idParent komentar tersebut
    var id = parseInt(req.params.id);

    try {
        var komentar = {
            text: req.body.text,
            komentarId: id // foreign key ke parent
        }

        Komentar.create(komentar)
            .then(() => {
                res.json({
                    info: "Reply Berhasil Ditambahkan ke Komentar dengan Id " + id,
                    komentar: komentar
                });
            });

    } catch (error) {
        console.log(error);
        return res.send(`Error: ${error}`);
    }
});

module.exports = router;