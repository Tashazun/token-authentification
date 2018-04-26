const router = require('express').Router();
const Film = require('../models/Film');
const Review = require('../models/Review');


const check404 = (actor, id) => {
    if(!actor) {
        throw {
            status: 404,
            error: `No film by id ${id}`
        };
    }
};

module.exports = router
    .post('/', (req, res, next) => {
        Film.create(req.body)
            .then(film => res.json(film))
            .catch(next);
    })
    .get('/:id', (req, res, next) => {
        const { id } = req.params;

        Promise.all([
            Film.findById(id)
                .select('_id title studio released')
                .populate({
                    path: 'cast',
                    select: '_id role actor'
                })
                .populate({
                    path: 'cast.actor',
                    select: '_id name'
                })
                .populate({
                    path: 'studio',
                    select: '_id name'
                })
                .lean(),
            Review.find({ 'film': id })
                .select('_id rating review reviewer')
                .populate({
                    path: 'reviewer',
                    select: '_id name'
                })
                .lean()
        ])
            .then(([film, review]) => {
                check404(film, id);
                film.review = review;
                res.json(film);
            })
            .catch(next);
    })
    .get('/', (req, res, next) => {
        Film.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .select('_id title studio released')
            .populate({
                path: 'studio',
                select: '_id name'
            })
            .then(reviewer => res.json(reviewer))
            .catch(next);
    })
    .delete('/:id', (req, res, next) => {
        Film.findByIdAndRemove(req.params.id)
            .then(removed => res.json(removed))
            .catch(next);
    });
