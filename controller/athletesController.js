require('dotenv').config();
const express = require('express');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const capitalise = require('./capitalise');
const Athlete = require('../models/athlete');
const Sport = require('../models/sport');

exports.athletesDirectory = asyncHandler(async (req, res, next) => {
  const athletes = await Athlete.find().populate('sport').sort({ lastName: 1 });
  res.render('./athletes/athletes', { athletes });
});

exports.athleteDetails = asyncHandler(async (req, res, next) => {
  const athlete = await Athlete.findById(req.params.id).populate('sport');
  res.render('./athletes/athlete-details', { athlete });
});

exports.newAthleteGET = asyncHandler(async (req, res, next) => {
  const sports = await Sport.find().sort({ name: 1 });
  res.render('./athletes/athlete-form', { sports });
});

exports.newAthletePOST = [
  body('firstName').trim().escape(),
  body('lastName').trim().escape(),
  body('sex.*').escape(),
  body('height').isNumeric().escape(),
  body('weight').isNumeric().escape(),
  body('sport').trim().escape(),
  body('dob').isISO8601().toDate()
    .escape(),
  body('password').equals(process.env.PASSWORD)
    .withMessage('Password incorrect. Please try again.'),

  asyncHandler(async (req, res, next) => {
    let newAthlete;
    if (req.file) {
      newAthlete = new Athlete({
        image: {
          fieldname: req.file.fieldname,
          originalname: req.file.originalname,
          encoding: req.file.encoding,
          mimetype: req.file.mimetype,
          destination: req.file.destination,
          filename: req.file.filename,
          path: req.file.path,
          size: req.file.size,
        },
        firstName: capitalise(req.body.firstName),
        lastName: capitalise(req.body.lastName),
        sex: req.body.sex,
        height: req.body.height,
        weight: req.body.weight,
        sport: req.body.sport,
        dateOfBirth: req.body.dob,
      });
    } else {
      newAthlete = new Athlete({
        image: {
          fieldname: null,
          originalname: null,
          encoding: null,
          mimetype: null,
          destination: null,
          filename: null,
          path: null,
          size: null,
        },
        firstName: capitalise(req.body.firstName),
        lastName: capitalise(req.body.lastName),
        sex: req.body.sex,
        height: req.body.height,
        weight: req.body.weight,
        sport: req.body.sport,
        dateOfBirth: req.body.dob,
      });
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const sports = await Sport.find();
      res.render('./athletes/athlete-form', {
        sports, athlete: newAthlete, errors: errors.array(),
      });
    } else {
      await newAthlete.save();
      res.redirect(newAthlete.url);
    }
  }),
];

exports.editAthleteDetailsGET = asyncHandler(async (req, res, next) => {
  const [sports, targetAthlete] = await Promise.all([
    Sport.find().sort({ name: 1 }),
    Athlete.findById(req.params.id).populate('sport'),
  ]);
  res.render('./athletes/athlete-form', { sports, athlete: targetAthlete, title: `Edit Particulars - ${targetAthlete.fullName}` });
});

exports.editAthleteDetailsPOST = [
  body('firstName').trim().escape(),
  body('lastName').trim().escape(),
  body('sex.*').escape(),
  body('height').isNumeric().escape(),
  body('weight').isNumeric().escape(),
  body('sport').trim().escape(),
  body('dob').isISO8601().toDate()
    .escape(),
  body('password').equals(process.env.PASSWORD)
    .withMessage('Password incorrect. Please try again.'),

  asyncHandler(async (req, res, next) => {
    const newAthlete = new Athlete({
      id: req.params.id,
      firstName: capitalise(req.body.firstName),
      lastName: capitalise(req.body.lastName),
      sex: req.body.sex,
      height: req.body.height,
      weight: req.body.weight,
      sport: req.body.sport,
      dateOfBirth: req.body.dob,
    });

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const [sports, targetAthlete] = await Promise.all(
        [
          Sport.find(),
          Athlete.findById(req.params.id),
        ],
      );
      res.render('./athletes/athlete-form', {
        sports, athlete: newAthlete, errors: errors.array(), title: `Edit Particulars - ${targetAthlete.fullName}`,
      });
    } else {
      const updatedAthlete = await Athlete.findOneAndUpdate({ _id: req.params.id }, newAthlete);
      res.redirect(updatedAthlete.url);
    }
  }),
];

exports.changeAthletePicGET = asyncHandler(async (req, res, next) => {
  const targetAthlete = await Athlete.findById(req.params.id);
  res.render('./athletes/athlete-change-pic', { athlete: targetAthlete, title: `Change Picture - ${targetAthlete.fullName}` });
});

exports.changeAthletePicPOST = [
  body('password').equals(process.env.PASSWORD)
    .withMessage('Password incorrect. Please try again.'),

  asyncHandler(async (req, res, next) => {
    let newAthlete;
    if (req.file) {
      newAthlete = new Athlete({
        image: {
          fieldname: req.file.fieldname,
          originalname: req.file.originalname,
          encoding: req.file.encoding,
          mimetype: req.file.mimetype,
          destination: req.file.destination,
          filename: req.file.filename,
          path: req.file.path,
          size: req.file.size,
        },
        id: req.params.id,
      });
    } else {
      newAthlete = new Athlete({
        image: {
          fieldname: null,
          originalname: null,
          encoding: null,
          mimetype: null,
          destination: null,
          filename: null,
          path: null,
          size: null,
        },
        id: req.params.id,
      });
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const targetAthlete = await Athlete.findById(req.params.id);
      res.render('./athletes/athlete-change-pic', {
        athlete: newAthlete, errors: errors.array(), title: `Change Picture - ${targetAthlete.fullName}`,
      });
    } else {
      const updatedAthlete = await Athlete.findOneAndUpdate({ _id: req.params.id }, newAthlete);
      res.redirect(updatedAthlete.url);
    }
  }),
];

exports.deleteAthleteGET = asyncHandler(async (req, res, next) => {
  const targetAthlete = await Athlete.findById(req.params.id);
  res.render('./athletes/athlete-delete', { athlete: targetAthlete });
});

exports.deleteAthletePOST = [
  body('password').equals(process.env.PASSWORD)
    .withMessage('Password incorrect. Please try again.'),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const targetAthlete = await Athlete.findById(req.params.id);
    if (!errors.isEmpty()) {
      res.render('./athletes/athlete-delete', { athlete: targetAthlete, errors: errors.array() });
    } else {
      await Athlete.findByIdAndDelete(req.params.id);
      res.redirect('/athletes');
    }
  }),
];
