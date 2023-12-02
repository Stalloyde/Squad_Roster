const express = require('express');
const athletesController = require('../controller/athletesController');

const router = express.Router();

router.get('/', athletesController.athletesDirectory);
router.get('/create', athletesController.newAthleteGET);
router.post('/create', athletesController.newAthletePOST);
router.get('/:id', athletesController.athleteDetails);

module.exports = router;
