const express = require('express');
const morgan = require('morgan');
const { resolve } = require('path');
const app = express();
const errorHandler = require('./util/error-handler');
const createEnsureAuth = require('./util/ensure-auth');
require('./models/registry-plugs');

app.use(morgan('dev'));
app.use(express.json());

const auth = require('./routes/auth');
const actors = require('./routes/actor');
const films = require('./routes/film');
const reviews = require('./routes/review');
const reviewers = require('./routes/reviewer');
const studios = require('./routes/studio');

const ensureAuth = createEnsureAuth();

app.use('/auth', auth);
app.use('/actors', actors);
app.use('/films', films);
app.use('/reviews', reviews);
app.use('/reviewers', reviewers);
app.use('/studios', studios);


app.use(errorHandler());

module.exports = app;