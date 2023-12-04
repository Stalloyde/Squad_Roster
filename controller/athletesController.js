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
  res.render('./athletes/new-athlete', { sports });
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
    const newAthlete = new Athlete({
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
      const sports = await Sport.find();
      res.render('./athletes/new-athlete', { sports, athlete: newAthlete, errors: errors.array() });
    } else {
      await newAthlete.save();
      res.redirect(newAthlete.url);
    }
  }),
];
