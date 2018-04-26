const router = require('express').Router();
const Actor = require('../models/Actor');
const Film = require('../models/Film');
const { updateOptions } = require('../util/mongoose-helpers');

const check404 = (actor, id) => {
    if(!actor) {
        throw {
            status: 404,
            error: `No actor by id ${id}`
        };
    }
};

module.exports = router
    .post('/', (req, res, next) => {
        Actor.create(req.body)
            .then(actor => res.json(actor))
            .catch(next);
    })
    .get('/:id', (req, res, next) => {
        const { id } = req.params;

        Promise.all([
            Actor.findById(id)
                .populate({
                    path: 'films',
                    select: 'id title released'
                })
                .lean(),
                
            Film.find({ 'cast.actor': id })
                .lean()
                .select('id title released')
        ])
            .then(([actor, films]) => {
                check404(actor, id);
                actor.films = films;
                res.json(actor);
            })
            .catch(next);
    })
    .get('/', (req, res, next) => {
        Actor.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .select('_id name')
            .then(actor => res.json(actor))
            .catch(next);
    })
    .put('/:id', (req, res, next) => {
        Actor.findByIdAndUpdate(req.params.id, req.body, updateOptions)
            .then(actor => res.json(actor))
            .catch(next);
    })
    .delete('/:id', (req, res, next) => {
        const { id } = req.params;

        Film.find({ 'cast.actor': id })
            .count()
            .then(count => {
                if(count > 0)
                    throw {
                        status: 400,
                        error: 'Cannot delete actor with films'
                    };
                return Actor.findByIdAndRemove(id);
            })
            .then(removed => res.json({ removed }))
            .catch(next);
    });