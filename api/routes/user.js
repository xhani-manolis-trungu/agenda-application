const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const User = require('../../models/user');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

router.post('/signup', (req, res, next) => {
    //checking if email already exist
    User.find({ email: req.body.email })
        .exec().then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: 'Email already exists'
                });
            }
            else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        })
                    } else {
                        //creating an instance of User model
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash,
                            name: req.body.name,
                            user_type: 'user'
                        })
                        user.save()
                            .then(result => {
                                res.status(201).json({
                                    message: 'User Created Successfully'
                                });
                            })
                            .catch(err => {
                                res.status(500).json({
                                    message: 'Failure to create user',
                                    error: err
                                });
                            });
                    }
                })
            }
        })
})

router.post('/admin-signup', (req, res, next) => {
    User.find({ email: req.body.email })
        .exec().then(user => {
            if (user.length > 1) {
                return res.status(409).json({
                    message: "Email already exist"
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        })
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash,
                            name: req.body.name,
                            user_type: 'admin'
                        })
                        user.save()
                            .then(result => {
                                res.status(201).json({
                                    message: 'Admin successfully created'
                                });
                            })
                            .catch(err => {
                                res.status(500).json({
                                    message: 'Admin creation failed',
                                    error: err
                                });
                            });
                    }
                })
            }
        })
})

router.post('/login', (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Auth failure'
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth failed'
                    });
                }
                if (result) {
                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id
                    },
                        'secret',
                        {
                            expiresIn: 1896172104
                        }
                    )
                    res.setHeader('Authorization', 'Bearer ' + token)
                    return res.status(200).json({
                        message: "Auth successful",
                        user_type: user[0].user_type,
                        token: token
                    });
                }
                res.status(401).json({
                    mesasge: "Auth Failure"
                });
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;