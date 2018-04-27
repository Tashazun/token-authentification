const router = require('express').Router();
const { respond } = require('./route-helpers');
const Reviewer = require('../models/Reviewer');
const { sign } = require('../util/token-service');
const createEnsureAuth = require('../util/ensure-auth');

const requiredFields = ({ body }, res, next) => {
    const { email, password } = body;
    if(!email || !password) {
        throw {
            status: 400,
            error: 'Email and password are required'
        };
    }
    next();
};

module.exports = router
    .get('/verify', createEnsureAuth(), respond(
        () => Promise.resolve({ verified: true })
    ))
    .post('/signup', requiredFields, respond(
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
                    return { token: sign(user) };
                });
        }
    ))
    .post('/signin', respond(
        ({ body }) => {
            const { email, password } = body;
            delete body.password;

            return Reviewer.findOne({ email })
                .then(user => {
                    if(!user || !user.comparePassword(password)) {
                        throw {
                            status: 401,
                            error: 'Invalid Email or Password'
                        };
                    }
                    return { token: sign(user) };
                });
        }
    ));

