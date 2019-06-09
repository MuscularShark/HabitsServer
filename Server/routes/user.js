"use strict"

const express = require('express');
const router = express.Router();
const models = require('../models');

router.post('/edit/:userId', (req, res) => {
    const userId = req.params.userId;
    const email = req.body.email;
    const nickname = req.body.nickname;
    const age = req.body.age;
    const weight = req.body.weight;
    const insulin = req.body.insulin;

    models.User.findOneAndUpdate({_id: userId}, {email: email, nickname: nickname, age: age, weight: weight, insulin: insulin}, {useFindAndModify: false}, (err, doc) => {
        if(err){
            console.log(err);
        } else {
            models.User.find({_id: userId}, (err, user) => {
                if(err){
                    console.log(err);
                } else {
                    res.status(200).json({
                        ok: true,
                        user
                    })
                }
            })
        }
    })
})

router.post('/deleteAccount/:userId', (req, res) => {
    const userId = req.params.userId;

    models.User.findOneAndDelete({_id: userId}, (err, result) => {
        if(err){
            console.log(err);
        } else {
            res.status(200).json({
                ok: true,
                result
            })
        }
    })
})

module.exports = router;