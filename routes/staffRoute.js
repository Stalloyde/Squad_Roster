const express = require('express');
const multer = require('multer');

const staffController = require('../controller/staffController');

const upload = multer({ dest: 'public/images/uploads/' });
const router = express.Router();

/* GET users listing. */
router.get('/', staffController.staffDirectory);
router.get('/create', staffController.newStaffGET);
router.post('/create', upload.single('image'), staffController.newStaffPOST);
router.get('/:id', staffController.staffDetails);
router.get('/:id/edit', staffController.editStaffGET);
router.post('/:id/edit', upload.single('image'), staffController.editStaffPOST);
router.get('/:id/change-profile-pic', staffController.changeStaffPicGET);
router.post('/:id/change-profile-pic', upload.single('image'), staffController.changeStaffPicPOST);
router.get('/:id/delete', staffController.deleteStaffGET);
router.post('/:id/delete', staffController.deleteStaffPOST);

module.exports = router;
