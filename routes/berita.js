var express = require('express');
var router = express.Router();

const upload = require("../middleware/upload");
const db = require('../models');
const Berita = db.beritas;
const Komentar = db.komentars;
const Op = db.Sequelize.Op;

const jwt = require('jsonwebtoken');
const passport = require('passport');

// Get All Berita
// GET
router.get('/list/page/:halaman', function (req, res, next) {

    var halaman = req.params.halaman;
    var slicedBerita = []
    let previousHalaman = 0;
    let nextHalaman = 0;

    Berita.findAndCountAll({
        where: { isDelete: false },
        order: [['updatedAt', 'DESC']],
        limit: 5,
        offset: halaman * 5,
    })
        .then(data => {

            if (halaman == 0) {
                previousHalaman = halaman;
                nextHalaman = 1;
            } else if (halaman == data.count) {
                previousHalaman = halaman - 1
                nextHalaman = halaman
            }

            for (let index in data.rows) {
                slicedBerita.push(data.rows[index]);
            }
            res.render('listallberita', {
                title: 'List Berita',
                beritas: data.rows,
                previousHalaman: previousHalaman,
                currentHalaman: halaman,
                nextHalaman: nextHalaman
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

// // Read (Get Detail) Sebuah Berita
// // GET
// router.get('/detail/:id', function (req, res, next) {
//     var id = parseInt(req.params.id);

//     var tempKomentar = []
//     var tempKomentarChildren = []
//     Komentar.findAll({
//         where: { beritumId: id },
//         order: [['createdAt', 'DESC']]
//     })
//         .then(komen => {
//             tempKomentar = komen;
//             Komentar.findAll()
//                 .then((children) => {
//                     tempKomentarChildren = children

//                     Berita.findByPk(id)
//                         .then(berita => {
//                             if (berita) {
//                                 res.render('detailberita', {
//                                     title: 'Detail Berita',
//                                     berita: berita,
//                                     komentar: tempKomentar,
//                                     komentarChildren: tempKomentarChildren,
//                                 });
//                             } else {
//                                 // kalau data tidak ada send 404
//                                 res.status(404).send({
//                                     message: "Tidak ada berita dengan id= " + id
//                                 })
//                             }
//                         })
//                         .catch(err => {
//                             res.json({
//                                 info: "Error",
//                                 message: err.message
//                             });
//                         });
//                 })
//         })

//         .catch(err => {
//             res.json({
//                 info: "Error",
//                 message: err.message,
//                 tempKomentar: tempKomentar,
//             });
//         });


// });

// // Update (Edit) Sebuah Berita
// // GET
// router.get('/ubah/:id', auth, function (req, res, next) {
//     var id = parseInt(req.params.id);

//     Berita.findByPk(id)
//         .then(data => {
//             if (data) {
//                 res.render('formubahberita', {
//                     title: 'Ubah Berita',
//                     berita: data,
//                     msg: ""
//                 });
//             } else {
//                 // kalau data tidak ada send 404
//                 res.status(404).send({
//                     message: "Tidak ada berita dengan id= " + id
//                 })
//             }
//         })
//         .catch(err => {
//             res.json({
//                 info: "Error",
//                 message: err.message
//             });
//         });
// });

// // POST
// router.post('/ubah/:id', auth, upload.single('image'), function (req, res, next) {
//     var id = parseInt(req.params.id);

//     try {
//         if (req.file == undefined) {
//             return res.send(`You must select a file.`);
//         }

//         const readFileFromPublic = req.file.path;
//         var berita = {
//             title: req.body.title,
//             highlight: req.body.highlight,
//             content: req.body.content,
//             image: readFileFromPublic,
//         }

//         Berita.update(berita, {
//             where: { id: id }
//         })
//             .then(() => {
//                 return res.redirect('/');
//             });

//     } catch (error) {
//         console.log(error);
//         return res.send(`Error when trying upload images: ${error}`);
//     }

// });

// // Delete (Soft Delete) Sebuah Berita
// // GET
// router.get('/hapus/:id', auth, function (req, res, next) {
//     var id = parseInt(req.params.id);

//     try {
//         var berita = {
//             isDelete: true,
//         }

//         Berita.update(berita, {
//             where: { id: id }
//         })
//             .then(() => {
//                 return res.redirect('/');
//             });

//     } catch (error) {
//         return res.send(`Error when trying to delete berita: ${error}`);
//     }

// });

module.exports = router;