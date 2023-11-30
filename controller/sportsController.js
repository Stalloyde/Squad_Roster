const express = require('express');
const asyncHandler = require('express-async-handler');
const Sport = require('../models/sport');
const Athlete = require('../models/athlete');

exports.sportsDirectory = asyncHandler(async (req, res, next) => {
  const sports = await Sport.find().sort({ name: 1 });
  res.render('./sports/sports', { sports });
});

exports.sportDetails = asyncHandler(async (req, res, next) => {
  const name = req.params.sportName[0].toUpperCase() + req.params.sportName.slice(1);
  const [[sport], athletes] = await Promise.all(
    [
      Sport.find({ name }),
      Athlete.find().populate('sport').sort({ name: 1 }),
    ],
  );
  const sportAthletes = athletes.filter((athlete) => athlete.sport.name === name)
    .sort((a, b) => (a.lastName < b.lastName ? -1 : 1));
  res.render('./sports/sport-details', { sport, athletes: sportAthletes });
});
