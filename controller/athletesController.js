require('dotenv').config();
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const capitalise = require('./capitalise');
const queries = require('../db/queries');

exports.athletesDirectory = asyncHandler(async (req, res) => {
  const athletes = await queries.getAllAthletesInfo();
  res.render('./athletes/athletes', { athletes });
});

exports.athleteDetails = asyncHandler(async (req, res) => {
  const [athlete] = await queries.getAthleteDetails(req.params.id);
  res.render('./athletes/athlete-details', { athlete });
});

exports.newAthleteGET = asyncHandler(async (req, res) => {
  const sports = await queries.getAllSports();
  res.render('./athletes/athlete-form', { sports });
});

exports.newAthletePOST = [
  body('firstName').trim().escape(),
  body('lastName').trim().escape(),
  body('sex.*').escape(),
  body('height').isNumeric().escape(),
  body('weight').isNumeric().escape(),
  body('sport').trim().escape(),
  body('dob').isISO8601().toDate().escape(),
  body('password')
    .equals(process.env.PASSWORD)
    .withMessage('Password incorrect. Please try again.'),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    const newAthlete = await queries.createNewAthlete(req);
    const [athlete] = await queries.getAthleteDetails(newAthlete[0].id);

    if (!errors.isEmpty()) {
      const sports = await queries.getAllSports();
      res.render('./athletes/athlete-form', {
        sports,
        athlete,
        errors: errors.array(),
      });
    } else {
      res.render('./athletes/athlete-details', { athlete });
    }
  }),
];

exports.editAthleteDetailsGET = asyncHandler(async (req, res) => {
  const [sports, [targetAthlete]] = await Promise.all([
    queries.getAllSports(),
    queries.getTargetAthlete(req.params.id),
  ]);

  res.render('./athletes/athlete-form', {
    sports,
    athlete: targetAthlete,
    title: `Edit Particulars - ${targetAthlete.fullname}`,
  });
});

exports.editAthleteDetailsPOST = [
  body('firstName').trim().escape(),
  body('lastName').trim().escape(),
  body('sex.*').escape(),
  body('height').isNumeric().escape(),
  body('weight').isNumeric().escape(),
  body('sport').trim().escape(),
  body('dob').isISO8601().toDate().escape(),
  body('password')
    .equals(process.env.PASSWORD)
    .withMessage('Password incorrect. Please try again.'),

  asyncHandler(async (req, res) => {
    const formatDateToYYYYMMDD = (date) => {
      const d = new Date(date);
      let month = `${d.getMonth() + 1}`;
      let day = `${d.getDate()}`;
      const year = d.getFullYear();

      if (month.length < 2) month = `0${month}`;
      if (day.length < 2) day = `0${day}`;

      return [year, month, day].join('-');
    };

    const newAthlete = {
      id: req.params.id,
      firstname: capitalise(req.body.firstName),
      lastname: capitalise(req.body.lastName),
      sex: req.body.sex,
      height: req.body.height,
      weight: req.body.weight,
      sport: req.body.sport,
      dateofbirthformatted: formatDateToYYYYMMDD(req.body.dob),
    };

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const [sports, [targetAthlete]] = await Promise.all([
        queries.getAllSports(),
        queries.getTargetAthlete(req.params.id),
      ]);

      res.render('./athletes/athlete-form', {
        sports,
        athlete: newAthlete,
        errors: errors.array(),
        title: `Edit Particulars - ${targetAthlete.fullname}`,
      });
    } else {
      await queries.editAthlete(req);
      const athletes = await queries.getAllAthletesInfo();
      res.render('./athletes/athletes', { athletes });
    }
  }),
];

exports.changeAthletePicGET = asyncHandler(async (req, res) => {
  const [targetAthlete] = await queries.getTargetAthlete(req.params.id);
  res.render('./athletes/athlete-change-pic', {
    athlete: targetAthlete,
    title: `Change Picture - ${targetAthlete.fullname}`,
  });
});

exports.changeAthletePicPOST = [
  body('password')
    .equals(process.env.PASSWORD)
    .withMessage('Password incorrect. Please try again.'),

  asyncHandler(async (req, res) => {
    let newAthlete;
    if (req.file) {
      newAthlete = {
        image_fieldname: req.file.fieldname,
        image_originalname: req.file.originalname,
        image_encoding: req.file.encoding,
        image_mimetype: req.file.mimetype,
        image_destination: req.file.destination,
        image_filename: req.file.filename,
        image_path: req.file.path,
        image_size: req.file.size,
      };
    } else {
      newAthlete = {
        image_fieldname: null,
        image_originalname: null,
        image_encoding: null,
        image_mimetype: null,
        image_destination: null,
        image_filename: null,
        image_path: null,
        image_size: null,
        id: req.params.id,
      };
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const [targetAthlete] = await queries.getTargetAthlete(req.params.id);

      res.render('./athletes/athlete-change-pic', {
        athlete: newAthlete,
        errors: errors.array(),
        title: `Change Picture - ${targetAthlete.fullname}`,
      });
    } else {
      await queries.editAthlete(req);
      const athletes = await queries.getAllAthletesInfo();
      res.render('./athletes/athletes', { athletes });
    }
  }),
];

exports.deleteAthleteGET = asyncHandler(async (req, res) => {
  const [targetAthlete] = await queries.getTargetAthlete(req.params.id);
  res.render('./athletes/athlete-delete', { athlete: targetAthlete });
});

exports.deleteAthletePOST = [
  body('password')
    .equals(process.env.PASSWORD)
    .withMessage('Password incorrect. Please try again.'),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    const [targetAthlete] = await queries.getTargetAthlete(req.params.id);
    if (!errors.isEmpty()) {
      res.render('./athletes/athlete-delete', {
        athlete: targetAthlete,
        errors: errors.array(),
      });
    } else {
      await queries.deleteAthlete(req.params.id);
      res.redirect('/athletes');
    }
  }),
];
