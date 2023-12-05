const express = require('express');
const athletesController = require('../controller/athletesController');

const router = express.Router();

router.get('/', athletesController.athletesDirectory);
router.get('/create', athletesController.newAthleteGET);
router.post('/create', athletesController.newAthletePOST);
router.get('/:id', athletesController.athleteDetails);
router.get('/:id/edit', athletesController.editAthleteDetailsGET);
router.post('/:id/edit', athletesController.editAthleteDetailsPOST);
router.get('/:id/delete', athletesController.deleteAthleteGET);
router.post('/:id/delete', athletesController.deleteAthletePOST);

module.exports = router;
