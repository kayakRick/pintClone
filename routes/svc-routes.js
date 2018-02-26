"use strict";

const router = require('express').Router();

router.get('/pics', (req, res) => {
    let col = db.collection('pc_users');

    if (req.user) {
        col.find({userId: req.user.userId}, {_id: 0, pics: 1}).limit(1).toArray(function (err, docs) {

            if (err) {
                res.send({message: err});
            }else{
                res.send({message: "", pics: docs[0].pics});
            }
        });
    }
});

router.post('/pics', (req, res) => {

    if(!req.user){
        res.status(401).send('Unauthorized');
        return;
    }

    let picURL = req.body.addPicURL;
    let picDesc = req.body.addPicDesc;
    let col = db.collection('pc_users');

    col.find({userId: req.user.userId, "pics.url": picURL}).limit(1).toArray(function(err, docs) {
        if (err) {
            res.send({message: err});
            return;
        }

        if (docs.length != 0) {
            res.send({message: picURL + " is already in your collection"});
            return;
        }

        let pic = {url: picURL, desc: picDesc};

        col.updateOne({userId: req.user.userId}, {$push: {pics: pic}}, function(err, r) {
            if (err) {
                res.send({message: err});
                return;
            }

            res.send({message: "", pic: pic})
        });
    });

});


module.exports = router;