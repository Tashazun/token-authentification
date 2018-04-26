const router = require('express').Router();
const Studio = require('../models/Studio');
const Film = require('../models/Film');
const { updateOptions } = require('../util/mongoose-helpers');

const check404 = (studio, id) => {
    if(!studio) {
        throw {
            status: 404,
            error: `Studio id ${id} does not exist`
        };
    }
};

module.exports = router
    .post('/', (req, res, next) => {
        Studio.create(req.body)
            .then(studio => res.json(studio))
            .catch(next);
    })
    .get('/:id', (req, res, next) => {
        const { id } = req.params;

        Promise.all([
            Studio.findById(id)
                .populate({
                    path: 'films',
                    select: 'id title'
                })
                .lean(),
                
            Film.find({ 'studio': id })
                .lean()
                .select('id title')
        ])
            .then(([studio, films]) => {
                check404(studio, id);
                studio.films = films;
                res.json(studio);
            })
            .catch(next);
    })
    .get('/', (req, res, next) => {
        Studio.find(req.query)
            .lean()
            .limit(10)
            .select('name')
            .then(studio => res.json(studio))
            .catch(next);
    })
    .put('/:id', (req, res, next) => {
        Studio.findByIdAndUpdate(req.params.id, req.body, updateOptions)
            .then(studio => res.json(studio))
            .catch(next);
    })
    .delete('/:id', (req, res, next) => {
        const { id } = req.params;

        Film.find({ studio: id })
            .count()
            .then(count => {
                if(count > 0) throw {
                    status: 400,
                    error: 'Cannot delete studio with films'
                };
                
                return Studio.findByIdAndRemove(id);
            })
            .then(removed => res.json({ removed }))
            .catch(next);
    });