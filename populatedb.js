#! /usr/bin/env node
const mongoose = require('mongoose');

console.log(
  'This script populates the database',
);

const userArgs = process.argv.slice(2);

mongoose.set('strictQuery', false);
const mongoDB = userArgs[0];

async function main() {
  console.log('Connecting to DB');
  await mongoose.connect(mongoDB);
  console.log('Connected to DB');
  await createAthletes();
  await createSports();
  await createStaff();
  console.log('DB Populated');
  mongoose.connection.close();
}

main().catch((err) => console.log(err));

const Athlete = require('./models/athlete');
const Sport = require('./models/sport');
const Staff = require('./models/staff');

const athletesArray = [];
const sportArray = [];
const staffArray = [];

async function newAthlete(index, firstName, lastName, sex, height, weight, sport, dateOfBirth) {
  const athlete = new Athlete({
    index,
    firstName,
    lastName,
    sex,
    height,
    weight,
    sport,
    dateOfBirth,
  });
  athletesArray[index] = athlete;
  await athlete.save();
}

async function createAthletes() {
  console.log('Creating Athletes');
  await Promise.all([
    newAthlete(0, 'Ethan', 'Hunt', 'Male', 178, 80, sportArray[0], '1999-08-12'),
    newAthlete(1, 'Max', 'Tan', 'Male', 179, 83, sportArray[0], '1999-08-12'),
    newAthlete(2, 'Jed', 'Gates', 'Male', 182, 94, sportArray[0], '2004-08-23'),
    newAthlete(3, 'Langham', 'Cordy', 'Male', 185, 86, sportArray[0], '2002-06-11'),
    newAthlete(4, 'Thomas', 'Morrison', 'Male', 183, 79, sportArray[0], '2003-09-17'),
    newAthlete(5, 'Heisky', 'Boozer', 'Male', 189, 86, sportArray[0], '2001-12-19'),
    newAthlete(6, 'Len', 'Tillman', 'Male', 190, 94, sportArray[0], '2005-04-02'),
    newAthlete(7, 'Morzov', 'Herro', 'Male', 175, 84, sportArray[0], '2001-01-09'),
    newAthlete(8, 'Ruf', 'Loyd', 'Male', 187, 97, sportArray[0], '2001-05-28'),
    newAthlete(9, 'Rachel', 'Bert', 'Female', 180, 80, sportArray[0], '2001-09-17'),
    newAthlete(10, 'Brix', 'Tet', 'Female', 178, 74, sportArray[0], '2001-09-12'),
    newAthlete(11, 'Angel', 'Orit', 'Female', 182, 78, sportArray[0], '2001-09-13'),
    newAthlete(12, 'Cassandra', 'Tet', 'Female', 174, 82, sportArray[0], '2001-09-02'),
    newAthlete(13, 'Hera', 'Tet', 'Female', 174, 81, sportArray[0], '2001-04-12'),
    newAthlete(14, 'Lisa', 'Tet', 'Female', 179, 88, sportArray[0], '2001-11-15'),
    newAthlete(15, 'Aurelia', 'Tet', 'Female', 172, 74, sportArray[0], '2001-10-19'),
    newAthlete(16, 'Celeste', 'Tet', 'Female', 172, 70, sportArray[0], '2001-09-27'),
    newAthlete(17, 'Zack', 'Brink', 'Male', 197, 103, sportArray[1], '2002-04-06'),
    newAthlete(18, 'Kobe', 'James', 'Male', 199, 110, sportArray[1], '2002-07-06'),
    newAthlete(19, 'Zion', 'McGrady', 'Male', 210, 120, sportArray[1], '2002-02-19'),
    newAthlete(20, 'Lamelo', 'James', 'Male', 193, 95, sportArray[1], '2002-08-03'),
    newAthlete(21, 'Blake', 'Curry', 'Male', 192, 97, sportArray[1], '2002-07-12'),
    newAthlete(22, 'Stephen', 'Griffin', 'Male', 192, 92, sportArray[1], '2001-12-22'),
    newAthlete(23, 'Kent', 'Willionson', 'Male', 193, 101, sportArray[1], '2002-07-30'),
    newAthlete(24, 'Lenny', 'Hathaway', 'Male', 207, 100, sportArray[1], '2002-10-01'),
    newAthlete(25, 'Emma', 'Prit', 'Female', 192, 89, sportArray[1], '2005-01-03'),
    newAthlete(26, 'Jordana', 'Keravac', 'Female', 192, 80, sportArray[1], '2004-01-21'),
    newAthlete(27, 'Sasha', 'Stone', 'Female', 197, 81, sportArray[1], '2005-05-25'),
    newAthlete(28, 'Kate', 'Winslet', 'Female', 195, 82, sportArray[1], '2003-04-13'),
    newAthlete(29, 'Moss', 'Shanks', 'Female', 182, 83, sportArray[1], '2003-03-29'),
    newAthlete(30, 'Elaine', 'Peterson', 'Female', 191, 82, sportArray[1], '2004-12-02'),
    newAthlete(31, 'Benes', 'James', 'Female', 183, 78, sportArray[1], '2005-02-09'),
    newAthlete(32, 'Clarisse', 'Long', 'Female', 187, 86, sportArray[1], '2005-10-06'),
  ]);
  console.log('Athletes created');
}

async function newSport(index, name, athletes, staff) {
  const sport = new Sport({
    index,
    name,
    athletes,
    staff,
  });
  sportArray[index] = sport;
  await sport.save();
}

async function createSports() {
  console.log('Creating sports');

  const swimAthletes = athletesArray.filter((athlete) => athlete.sport === 'Swimming');
  const swimStaff = staffArray.filter((staff) => staff.sport === 'Swimming');
  const basketballAthletes = athletesArray.filter((athlete) => athlete.sport === 'Basketball');
  const basketballStaff = staffArray.filter((staff) => staff.sport === 'Basketball');

  await Promise.all([newSport(1, 'Swimming', swimAthletes, swimStaff),
    newSport(2, 'Basketball', basketballAthletes, basketballStaff),
  ]);

  console.log('Sports created');
}

async function newStaff(firstName, lastName, sport, designation, bio) {
  const staff = new Staff({
    firstName,
    lastName,
    sport,
    designation,
    bio,
  });
  await staff.save();
}

async function createStaff() {
  console.log('Creating Staff');
  const newStaffs = await Promise.all([
    newStaff('Thomas', 'Clung', 'Swimming', 'Head Coach', 'Fake bio for Thomas Clung, Head Coach since 2004. Lead the swim team to numerous state titles and National top 10 rankings.'),
    newStaff('Jefferson', 'Howard', 'Swimming', 'Assistant Head Coach', 'Started his career as a swim teacher and accumulated experience throughout his 20 year career.'),
    newStaff('Mandy', 'Jensen', 'Swimming', 'Assistant Coach', 'Swam for the team for 10 years.'),
    newStaff('Mia', 'Richards', 'Basketball', 'Head Coach', 'Turned to a coaching career since retiring from the WNBA in 2010. A great teacher and strong disciplinary, players rallying behind her leadership during difficult games are a common sight'),
    newStaff('Kurt', 'SkyWalker', 'Basketball', 'Assistant Head Coach', 'The newest member of the Basketball coaching staff. Highly versatile in offensive and defensive schemes, as well as the key person in planning and delivering strength and conditioning.'),
    newStaff('Lea', 'Cobin', 'Basketball', 'Assistant Coach', 'From a volunteer coach during the 2020-21 and 2021-22 season, she now leads the nutrition program.'),
  ]);
  newStaffs.map((staff) => staffArray.push(staff));
  console.log('Staff created');
}
