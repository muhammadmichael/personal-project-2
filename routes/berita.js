var express = require('express');
var router = express.Router();

const upload = require("../middleware/upload");
const db = require('../models');
const Berita = db.beritas;
const Komentar = db.komentars;
const Op = db.Sequelize.Op;

const jwt = require('jsonwebtoken');
const passport = require('passport');

// Get All Berita (!Including Soft Deleted Berita)
// GET
router.get('/list', function (req, res, next) {

    Berita.findAll(
        {where: { isDelete: false }}
    )
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

// Create Sebuah Berita
// POST
router.post('/tambah',
    passport.authenticate("jwt", { session: false }),
    upload.single('image'),
    function (req, res, next) {
        try {
            const readFileFromPublic = req.file.path;
            var berita = {
                title: req.body.title,
                highlight: req.body.highlight,
                content: req.body.content,
                image: readFileFromPublic,
            }

            Berita.create(berita)
                .then((data) => {
                    res.json({
                        info: "Berita Berhasil Ditambahkan",
                        berita: data,
                    });
                });

        } catch (error) {
            console.log(error);
            return res.send(`Error when trying upload images: ${error}`);
        }
    });

// Read (Get Detail) Sebuah Berita
// GET
router.get('/detail/:id', function (req, res, next) {
    var id = parseInt(req.params.id);

    Berita.findByPk(id)
        .then(berita => {
            if (berita) {
                res.json({
                    info: "Berhasil Menemukan Berita dengan Id= " + id,
                    berita: berita
                });
            } else {
                res.json({
                    info: "Tidak Ada Berita Dengan Id= " + id,
                    berita: berita
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

// Update (Edit) Sebuah Berita
// PUT
router.put('/ubah/:id',
    passport.authenticate("jwt", { session: false }),
    upload.single('image'),
    function (req, res, next) {
        var id = parseInt(req.params.id);

        try {
            if (req.file == undefined) {
                return res.send(`You must select a file.`);
            }

            const readFileFromPublic = req.file.path;
            var berita = {
                title: req.body.title,
                highlight: req.body.highlight,
                content: req.body.content,
                image: readFileFromPublic,
            }

            Berita.update(berita, {
                where: { id: id }
            })
                .then(() => {
                    res.json({
                        info: "Berita Dengan Id= " + id + " Berhasil Diupdate",
                        berita: berita,
                    });
                });

        } catch (error) {
            console.log(error);
            return res.send(`Error when trying upload images: ${error}`);
        }

    });

// Delete (Soft Delete) Sebuah Berita
// DELETE
router.delete('/hapus/:id',
    passport.authenticate("jwt", { session: false }),
    function (req, res, next) {
        var id = parseInt(req.params.id);

        try {
            var berita = {
                isDelete: true,
            }

            Berita.update(berita, {
                where: { id: id }
            })
                .then(() => {
                    res.json({
                        info: "Berita Dengan Id= " + id + " Berhasil Dihapus (Soft Delete)",
                        berita: berita,
                    });
                });

        } catch (error) {
            return res.send(`Error when trying to delete berita: ${error}`);
        }

    });

module.exports = router;