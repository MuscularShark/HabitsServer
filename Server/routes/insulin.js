"use strict"

const express = require('express');
const router = express.Router();
const models = require('../models');
var dateTime = require('node-datetime');

router.post('/add/insulina', (req, res) => {

    const name = req.body.name;
    const doze = req.body.doze;
    const price = req.body.price;
    const type = req.body.type;


    models.Insulin.create({
        name: name,
        doze: doze,
        price: price,
        type: type,
    }).then(insulina => {
        res.json({
            ok: true,
            insulina
        })
    })
})

module.exports = router;