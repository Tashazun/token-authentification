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
                   const user = new Reviewer(body);
                   user.generateHash(password);
                   return user.save(); 
                })
                .then(user => {
                    return { toke: user._id };
                });
        }
    ));

