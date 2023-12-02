require('dotenv').config();
const express = require('express');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
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
  const sports = await Sport.find();
  res.render('./athletes/new-athlete', { sports });
});

exports.newAthletePOST = [
  body('firstName').notEmpty().trim().escape(),
  body('lastName').notEmpty().trim().escape(),
  body('sex.*').escape(),
  body('height').notEmpty().isNumeric().escape(),
  body('weight').notEmpty().isNumeric().escape(),
  body('sport').notEmpty().trim().escape(),
  body('dob').notEmpty().isISO8601().toDate()
    .escape(),
  body('password').notEmpty().equals(process.env.PASSWORD)
    .withMessage('Password incorrect. Please try again.'),

  asyncHandler(async (req, res, next) => {
    const newAthlete = new Athlete({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
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
