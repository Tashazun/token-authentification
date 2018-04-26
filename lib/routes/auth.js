const router = require('express').Router();
const { respond } = require('./route-helpers');
const Reviewer = require('../models/Reviewer');

module.exports = router
    .post('/signup', respond(
        ({ body }) => {
            const { email, password } = body;
            delete body.password;

            return Reviewer.exists({ email })
                .then(exists => {
                    if(exists) {
                        throw {
                            status: 400,
                            error: 'Email already exists.'
                        };
                    }
                    const user = new Reviewer(body);
                    user.generateHash(password);
                    return user.save(); 
                })
                .then(user => {
                    return { token: user._id };
                });
        }
    ))
    .post('/signin', respond(
        ({ body }) => {
            const { email, password } = body;
            delete body.password;

            return Reviewer.findOne({ email })
                .then(user => {

                    return { token: user._id };
                });
        }
    ));

