const express = require('express');
const multer = require('multer');

const athletesController = require('../controller/athletesController');

const upload = multer({ dest: 'public/images/uploads/' });
const router = express.Router();

router.get('/', athletesController.athletesDirectory);
router.get('/create', athletesController.newAthleteGET);
router.post('/create', upload.single('image'), athletesController.newAthletePOST);
router.get('/:id', athletesController.athleteDetails);
router.get('/:id/edit', athletesController.editAthleteDetailsGET);
router.post('/:id/edit', upload.single('image'), athletesController.editAthleteDetailsPOST);
router.get('/:id/change-profile-pic', athletesController.changeAthletePicGET);
router.post('/:id/change-profile-pic', upload.single('image'), athletesController.changeAthletePicPOST);
router.get('/:id/delete', athletesController.deleteAthleteGET);
router.post('/:id/delete', athletesController.deleteAthletePOST);

module.exports = router;
