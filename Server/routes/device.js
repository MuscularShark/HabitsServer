"use strict"

const express = require('express');
const router = express.Router();
const models = require('../models');
var dateTime = require('node-datetime');

router.post('/add/:userId', (req, res) => {
    const userId = req.params.userId;

    models.Device.create({
        userId: userId
    }).then(device => {
        res.json({
            ok: true,
            device
        })
    })
})

module.exports = router;