const { Router } = require('express');


const CrimeController = require('./app/controllers/CrimeController');


const routes = new Router();

routes.get('/crimes/weapons', CrimeController.getAllWeaponsOfCrime);

routes.get('/crime/:crimeId', CrimeController.getInfoById);

module.exports = routes;  