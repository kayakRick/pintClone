"use strict";

const router = require('express').Router();

router.get('/pics', (req, res) => {
    let col = db.collection('pc_users');

    if (req.user) {
        col.find({userId: req.user.userId}, {_id: 0, pics: 1}).limit(1).toArray(function (err, docs) {

            if (err) {
                res.send({message: err});
            } else {
                res.send({message: "", pics: docs[0].pics});
            }
        });
    }
});

router.post('/pics', (req, res) => {

    if (!req.user) {
        res.status(401).send('Unauthorized');
        return;
    }

    let picURL = req.body.addPicURL;
    let picDesc = req.body.addPicDesc;
    let col = db.collection('pc_users');

    col.find({userId: req.user.userId, "pics.url": picURL}).limit(1).toArray(function (err, docs) {
        if (err) {
            res.send({message: err});
            return;
        }

        if (docs.length != 0) {
            res.send({message: picURL + " is already in your collection"});
            return;
        }

        let pic = {url: picURL, desc: picDesc, likes: 0};

        col.updateOne({userId: req.user.userId}, {$push: {pics: pic}}, function (err, r) {
            if (err) {
                res.send({message: err});
                return;
            }

            res.send({message: "", pic: pic})
        });
    });

});

router.post('/deletePic', (req, res) => {
    if (!req.user) {
        res.status(401).send('Unauthorized');
        return;
    }

    let picNum = req.body.picNum;
    let col = db.collection('pc_users');

    col.find({userId: req.user.userId}, {_id: 0, pics: 1}).limit(1).toArray(function (err, docs) {
        if (err) {
            res.send({message: err});
            return;
        }

        let pics = docs[0].pics;
        let newPics = [];

        pics.forEach((element, idx) => {
            if (idx != picNum) newPics.push(element);
        });

        col.updateOne({userId: req.user.userId}, {$set: {pics: newPics}}, function (err, r) {
            if (err) {
                res.send({message: err});
                return;
            }

            res.send({message: "", picNum: picNum});
        });
    })
});

router.get('/allPics', (req, res) => {
    let col = db.collection('pc_users');
    col.aggregate([
        {$unwind: "$pics"},
        {
            $project: {
                _id: 0, userId: 1, url: "$pics.url",
                desc: "$pics.desc", likes: "$pics.likes"
            }
        }
    ]).toArray(function (err, docs) {

        if (err) {
            res.send({message: err});
            return;
        }

        if (docs.length == 0)
            res.send({message: "", pics: []});
        else
            res.send({message: "", pics: docs});
    });
});

router.post('/likePic', (req, res) => {
    //db.pc_users.update({"userId": "956325858398044160", "pics.url": "http://x"},
    // {$inc: {"pics.$.likes": 1}})
    let col = db.collection('pc_users');
    col.updateOne({"userId": req.body.userId, "pics.url": req.body.picUrl},
        {$inc: {"pics.$.likes": 1}}, function (err, r) {
            if (err) {
                res.send({message: err});
                return;
            }

            col.findOne({"userId": req.body.userId, "pics.url": req.body.picUrl},
                {_id: 0,  "pics.$.likes": 1}, function (err, docs) {
                    if (err) {
                        res.send({message: err});
                        return;
                    }

                    res.send({message: "", picNum: req.body.picNum, likes: docs.pics[0].likes});
                });
        });

});

module.exports = router;