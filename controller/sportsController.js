require('dotenv').config();
const express = require('express');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const capitalise = require('./capitalise');
const Sport = require('../models/sport');
const Athlete = require('../models/athlete');
const Staff = require('../models/staff');

exports.sportsDirectory = asyncHandler(async (req, res, next) => {
  const sports = await Sport.find().sort({ name: 1 });
  res.render('./sports/sports', { sports });
});

exports.sportDetails = asyncHandler(async (req, res, next) => {
  const targetSportName = req.params.sportName[0].toUpperCase() + req.params.sportName.slice(1);
  const [[sport], athletes, staffList] = await Promise.all(
    [
      Sport.find({ name: targetSportName }),
      Athlete.find().populate('sport'),
      Staff.find().populate('sport'),
    ],
  );
  const sportAthletes = athletes.filter((athlete) => athlete.sport.name === targetSportName)
    .sort((a, b) => (a.lastName < b.lastName ? -1 : 1));
  const sportStaff = staffList.filter((staff) => staff.sport.name === targetSportName)
    .sort((a, b) => (a.lastName < b.lastName ? -1 : 1));
  res.render('./sports/sport-details', { sport, athletes: sportAthletes, staffList: sportStaff });
});

exports.newSportGET = asyncHandler(async (req, res, next) => {
  const sports = await Sport.find().sort({ name: 1 });
  res.render('./sports/new-sport', { sports });
});

exports.newSportPOST = [
  body('sportName').trim().escape(),
  body('password').equals(process.env.PASSWORD)
    .withMessage('Password incorrect. Please try again.'),

  asyncHandler(async (req, res, next) => {
    const sportName = capitalise(req.body.sportName);

    const newSport = new Sport({ name: sportName });
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('./sports/new-sport', { sport: newSport, errors: errors.array() });
    } else {
      const duplicateCheck = await Sport.find({ name: newSport.name });
      if (duplicateCheck) {
        res.render('./sports/new-sport', { sport: newSport, errors: errors.array(), duplicateError: `'${newSport.name}' already exists` });
      } else {
        await newSport.save();
        res.redirect(newSport.url);
      }
    }
  }),
];
