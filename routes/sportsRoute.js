const express = require('express');
const sportsController = require('../controller/sportsController');

const router = express.Router();

router.get('/', sportsController.sportsDirectory);
router.get('/create', sportsController.newSportGET);
router.post('/create', sportsController.newSportPOST);
router.get('/:id', sportsController.sportDetails);
router.get('/:id/edit', sportsController.editSportGET);
router.post('/:id/edit', sportsController.editSportPOST);
router.get('/:id/delete', sportsController.deleteSportGET);
router.post('/:id/delete', sportsController.deleteSportPOST);

module.exports = router;
