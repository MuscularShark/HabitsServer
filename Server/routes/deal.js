"use strict"

const express = require('express');
const router = express.Router();
const models = require('../models');
var dateTime = require('node-datetime');

router.post('/add/:userId', (req, res) => {

    const name = req.body.name;
    const category = req.body.category;
    const duration = req.body.duration;
    const average = req.body.average;
    const userId = req.params.userId;

    var dt = new Date();

    models.Deal.create({
        name: name,
        category: category,
        duration: duration,
        average: average,
        necessaryAttempts: duration * average,
        dateOfCreation: dt,
        userId: userId
    }).then(deal => {
        res.json({
            ok: true,
            deal
        })
    })
})

router.get('/getList/:userId', (req, res) => {
    const userId = req.params.userId;

    models.Deal.find({userId: userId}, (err, insulins) => {
        if(err){
            console.log(err);
        }
        else{
            res.json({
                ok: true,
                insulins
            })
        }
    })
})

router.get('/getDeal/:dealId', (req, res) => {
    const dealId = req.params.dealId;

    models.Deal.find({_id: dealId}, (err, deal) => {
        if(err){
            console.log(err);
        }
        else{
            res.json({
                ok: true,
                deal
            })
        }
    })
})




router.get('/:dealId', (req, res) => {
    const dealId = req.params.dealId;

    models.Deal.find({_id: dealId}, (err, deal) => {
        if(err){
            console.log(err);
        }
        else{
            res.render('deal', { 
                deal: deal[0]
            });
        }
    })
})

router.post('/edit/:dealId', (req, res) => {
    const dealId = req.params.dealId;
    const name = req.body.name;
    const category = req.body.category;
    const duration = req.body.duration;
    const average = req.body.average;

    models.Deal.findOneAndUpdate({_id: dealId}, {name: name, category: category, duration: duration, average: average, necessaryAttempts: duration * average}, {useFindAndModify: false}, (err, doc) => {
        if(err){
            console.log(err);
        } else {
            models.Deal.findOne({_id: dealId}, (err, deal) => {
                if(err){
                    console.log(err);
                } else {
                    res.status(200).json({
                        ok: true,
                        deal
                    })
                }
            })
        }
    })
})



router.post('/editDealForWeb/:dealId', (req, res) => {
    const dealId = req.params.dealId;
    const name = req.body.name;
    const category = req.body.category;
    const duration = req.body.duration;
    const average = req.body.average;

    models.Deal.findOneAndUpdate({_id: dealId}, {name: name, category: category, duration: duration, average: average, necessaryAttempts: duration * average}, {useFindAndModify: false}, (err, doc) => {
        if(err){
            console.log(err);
        } else {
            models.Deal.find({_id: dealId}, (err, deal) => {
                if(err){
                    console.log(err);
                } else {
                    res.render('deal', { 
                        deal: deal[0]
                    });
                }
            })
        }
    })
})

router.post('/deleteDeal/:dealId', (req, res) => {
    const dealId = req.params.dealId;

    models.Deal.findOneAndDelete({_id: dealId}, (err, result) => {
        if(err){
            console.log(err);
            // res.json({
            //     ok: false
            // })
        } else {
            res.status(200).json({
                ok: true,
                result
            })
        }
    })
})

router.post('/deal-done/:dealId', (req, res) => {
    const dealId = req.params.dealId;
    var dt = new Date();

    models.Deal.findOneAndUpdate({_id: dealId}, {$inc: {attemptsCount: 1}}, {useFindAndModify: false}, (err, doc) => {
        if(err){
            console.log(err);
        } else {
            models.Results.create({
                iterationDate: dt,
                dealId: dealId
            }).then(result => {
                res.json({
                    ok:true
                })
            })
        }
    })    
})


router.get('/getStatistics/added/:userId', (req, res) => {
    const userId = req.params.userId;
    const from = req.body.from;
    const to = req.body.to;

    models.Deal.find({userId: userId/*, dateOfCreation: {$gt : from, $lt: to}*/}, (err, insulins) => {
        if(err){
            console.log(err);
        }
        else{
            var count = 0;

            models.Deal.find({userId: userId}, (err, insulinss) => {
                if(err){
                    console.log(err);
                } else {
                    insulins.forEach(deal => {
                        models.Results.find({/*iterationDate: {$gt : from, $lt: to}, */dealId: deal._id}, (err, results) => {
                            if((results.length / deal.necessaryAttempts * 100) >= 65){
                                count++;
                            }
                        })
                    });
                }
            })

            var result = {
                education: 0,
                hobby: 0,
                sport: 0
            };

            models.Deal.find({category: "Education", userId: userId}, (err, edDeals) => {
                if(err){
                    console.log(err);
                } else {
                    edDeals.forEach(deal => {
                        result.education += deal.attemptsCount;
                    });
                    result.education += 1;
                    models.Deal.find({category: "Hobby", userId: userId}, (err, hoDeals) => {
                        if(err){
                            console.log(err);
                        } else {
                            hoDeals.forEach(deal => {
                                result.hobby += deal.attemptsCount;
                            });
                            result.hobby+=2;
                            models.Deal.find({category: "Sport", userId: userId}, (err, spDeals) => {
                                if(err){
                                    console.log(err);
                                } else {
                                    spDeals.forEach(deal => {
                                        result.sport += deal.attemptsCount;
                                    });
                                    result.sport+=3;
                                    res.render('statistics', { 
                                        added:insulins.length,
                                        count: count,
                                        result: result
                                    });
                                }
                            })
                        }
                    })
                }
            })    
          
        }
    })
})


router.post('/getStatistics/addedHabits/:userId', (req, res) => {
    const userId = req.params.userId;
    const from = req.body.from;
    const to = req.body.to;

    models.Deal.find({userId: userId, dateOfCreation: {$gt : from, $lt: to}}, (err, insulins) => {
        if(err){
            console.log(err);
        }
        else{
            res.json({
                ok: true,
                result: insulins.length
            })
        }
    })
})

router.post('/getStatistics/successfulHabits/:userId', (req, res) => {
    const userId = req.params.userId;
    const from = req.body.from;
    const to = req.body.to;
    var count = 0;

    models.Deal.find({userId: userId}, (err, insulins) => {
        if(err){
            console.log(err);
        } else {
            insulins.forEach(deal => {
                models.Results.find({iterationDate: {$gt : from, $lt: to}, dealId: deal._id}, (err, results) => {
                    if((results.length / deal.necessaryAttempts * 100) >= 65){
                        count++;
                    }
                })
            });
        }
    })
    res.json({count});
})

router.get('/getStatistics/categorySuccessCount/:userId', (req, res) => {
    const userId = req.params.userId;
    var result = {
        education: 0,
        hobby: 0,
        sport: 0
    };

    models.Deal.find({category: "Education", userId: userId}, (err, edDeals) => {
        if(err){
            console.log(err);
        } else {
            edDeals.forEach(deal => {
                result.education += deal.attemptsCount;
            });
            result.education += 1;
            models.Deal.find({category: "Hobby", userId: userId}, (err, hoDeals) => {
                if(err){
                    console.log(err);
                } else {
                    hoDeals.forEach(deal => {
                        result.hobby += deal.attemptsCount;
                    });
                    result.hobby+=2;
                    models.Deal.find({category: "Sport", userId: userId}, (err, spDeals) => {
                        if(err){
                            console.log(err);
                        } else {
                            spDeals.forEach(deal => {
                                result.sport += deal.attemptsCount;
                            });
                            result.sport+=3;
                            res.json({
                                ok:true,
                                result
                            })
                        }
                    })
                }
            })
        }
    })    
})

router.post('/getStatistics/categoryActivity/:userId', (req, res) => {
    const userId = req.params.userId;
    const from = req.body.from;
    const to = req.body.to;

    var result = {
        education: 0,
        hobby: 0,
        sport: 0
    };

    models.Deal.find({category: "Education", userId: userId}, (err, edDeals) => {
        if(err){
            console.log(err);
        } else {
            models.Results.find({iterationDate: {$gt : from, $lt: to}, dealId: edDeals._id}, (err, results) => {
                if(err){
                    console.log(err);
                } else {
                    result.education = results.length;
                }
            })
            models.Deal.find({category: "Hobby", userId: userId}, (err, hoDeals) => {
                if(err){
                    console.log(err);
                } else {
                    models.Results.find({iterationDate: {$gt : from, $lt: to}, dealId: hoDeals._id}, (err, results) => {
                        if(err){
                            console.log(err);
                        } else {
                            result.hobby = results.length;
                        }                        
                    })
                    models.Deal.find({category: "Sport", userId: userId}, (err, spDeals) => {
                        if(err){
                            console.log(err);
                        } else {
                            models.Results.find({iterationDate: {$gt : from, $lt: to}, dealId: spDeals._id}, (err, results) => {
                                if(err){
                                    console.log(err);
                                } else {
                                    result.sport = results.length;
                                }
                            })
                            res.json({
                                ok:true,
                                result
                            })
                        }
                    })
                }
            })
        }
    })   
})

module.exports = router;