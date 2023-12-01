const express = require('express');
const asyncHandler = require('express-async-handler');
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
