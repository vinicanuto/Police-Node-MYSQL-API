const { Router } = require('express');


const CrimeController = require('./app/controllers/CrimeController');


const routes = new Router();

routes.get('/crimes/weapons', CrimeController.getAllWeaponsOfCrime);

routes.get('/crimes/:crimeId', CrimeController.getInfoById);

routes.delete('/crimes/:crimeId', CrimeController.deleteCrime);

routes.post('/crimes', CrimeController.createCrime);

module.exports = routes;  