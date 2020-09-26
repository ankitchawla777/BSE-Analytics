const { Router } = require('express');

const {stock} = require('./../controllers/stock.controller')

const apiRoutes = function (router, io) {
    router = Router();

    router.get('/',(req,res) => {
        res.send('Apis are hoted here');
    })

    router.get('/stocks', (req, res) => {
        stock.list(req, res);
    });

    router.post('/stocks', (req, res) => {
        stock.create(req, res, io);
    });

    router.get('/stocks-analytics', (req, res) => {
        stock.getAnalytics(req, res);
    });

    return router;
}

module.exports = apiRoutes