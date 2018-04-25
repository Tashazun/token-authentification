const express = require('express');
const app = express();
const errorHandler = require('./util/error-handler');

app.use(express.json());

const actors = require('./routes/actor');
const films = require('./routes/film');
const reviews = require('./routes/review');
const reviewers = require('./routes/reviewer');
const studios = require('./routes/studio');

app.use('/actors', actors);
app.use('/films', films);
app.use('/reviews', reviews);
app.use('/reviewers', reviewers);
app.use('/studios', studios);


app.use(errorHandler());

module.exports = app;