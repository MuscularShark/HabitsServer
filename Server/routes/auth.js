"use strict"

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt-nodejs');
const models = require('../models');

router.post('/register', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const nickname = req.body.nickname;
    const age = req.body.age;
    const weight = req.body.weight;
    const insulin = req.body.insulin;

    models.User.findOne({
        email
    }).then(user => {
        if (!user) {
            bcrypt.hash(password, null, null, (err, hash) => {
                models.User.create({
                    email: email,
                    password: hash,
                    nickname: nickname,
                    age: age,
                    weight: weight,
                    insulin: insulin
                }).then(user => {                 
                    req.session.userId = user.id;
                    req.session.userNickname = user.nickname;
                    res.json({
                        ok: true,
                        user
                    });
                }).catch(err => {
                    console.log(err);
                    res.json({
                        ok: false,
                        error: 'Error'
                    });
                });
            });
        } else {
            res.json({
                ok: false,
                fields: ['email']
            });
        }
    });
});

router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    
    models.User.findOne({
        email
    }).then(user => {
        if (!user) {
            res.json({
                ok: false
            });
        } else {
            bcrypt.compare(password, user.password, function (err, result) {
                if (!result) {
                    res.json({
                        ok: false
                    });
                } else {
                    req.session.userId = user.id;
                    req.session.userNickname = user.nickname;
                    res.json({
                        ok: true,
                        user
                    });

                }
            });
        }
    }).catch(err => {
        console.log(err);
        res.json({
            ok: false,
            error: 'Error'
        });
    });
});

router.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(() => {
            res.redirect('/');
        });
    } else {
        res.redirect('/');
    }
});

router.get('/getUser/:userId', (req, res) => {
    models.User.findOne({_id: req.params.userId}).then(user => {
        console.log(user);
        if(!user){
            res.json({
                ok: false
            })
        } else {
            res.json({
                ok: true,
                user
            })
        }
    })
})

module.exports = router;