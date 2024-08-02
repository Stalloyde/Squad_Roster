const asyncHandler = require('express-async-handler');
const queries = require('../db/queries');

exports.homePage = asyncHandler(async (req, res, next) => {
  const [athleteCount] = await queries.getAthleteCount();
  const [sportCount] = await queries.getSportCount();
  const [staffCount] = await queries.getStaffCount();

  return res.render('./home', {
    athleteCount: athleteCount.count,
    sportCount: sportCount.count,
    staffCount: staffCount.count,
  });
});
