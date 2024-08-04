require('dotenv').config();
const { Pool } = require('pg');
const capitalise = require('../controller/capitalise');

const pool = new Pool({
  connectionString: `postgresql://${process.env.USERNAME}:${process.env.PASSWORD}@localhost:5432/${process.env.DATABASE}`,
});

async function getAthleteCount() {
  const { rows } = await pool.query('SELECT count(*) FROM athletes');
  return rows;
}

async function getSportCount() {
  const { rows } = await pool.query('SELECT count(*) FROM sports');
  return rows;
}

async function getStaffCount() {
  const { rows } = await pool.query('SELECT count(*) FROM staff');
  return rows;
}

async function getAllAthletesInfo() {
  const { rows } = await pool.query(
    `SELECT 
    CONCAT(firstName, ' ',lastName) AS fullname, 
    CONCAT('/athletes/', athletes.id) AS url, 
    sex, 
    height, 
    weight, 
    sports.name AS sportname, 
    CONCAT('/sports/', sports.id) AS sporturl, 
    TO_CHAR(dateOfBirth, 'DD Mon YYYY') dateofbirthformatted 
    FROM athletes 
    JOIN sports 
    ON athletes.sport=sports.id ORDER BY firstname`,
  );
  return rows;
}

async function getAthleteDetails(athleteId) {
  const { rows } = await pool.query(
    `SELECT 
    athletes.id,
    CONCAT(firstName, ' ',lastName) AS fullname, 
    image_path,
    image_filename,
    sex, 
    height, 
    weight, 
    sports.name AS sportname, 
    CONCAT('/sports/', sports.id) AS sporturl, 
    TO_CHAR(dateOfBirth, 'DD Mon YYYY') dateofbirthformatted
    FROM athletes 
    JOIN sports 
    ON athletes.sport=sports.id 
    WHERE athletes.id = $1
    ORDER BY firstname`,
    [athleteId],
  );
  return rows;
}

async function getAllSports() {
  const { rows } = await pool.query('SELECT * FROM sports ORDER BY name');
  return rows;
}

async function createNewAthlete(req) {
  if (req.file) {
    await pool.query(
      `INSERT INTO athletes (
        image_fieldname,
        image_originalname,
        image_encoding,
        image_mimetype,
        image_destination,
        image_filename, 
        image_path,
        image_size,
        firstName,
        lastName,  
        sex,
        height,
        weight,
        sport,
        dateOfBirth)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
      [
        req.file.fieldname,
        req.file.originalname,
        req.file.encoding,
        req.file.mimetype,
        req.file.destination,
        req.file.filename,
        req.file.path,
        req.file.size,
        capitalise(req.body.firstName),
        capitalise(req.body.lastName),
        req.body.sex,
        req.body.height,
        req.body.weight,
        req.body.sport,
        req.body.dob,
      ],
    );
    const { rows } = await pool.query(
      'SELECT * from athletes WHERE firstName = $1 AND lastName = $2',
      [capitalise(req.body.firstName), capitalise(req.body.lastName)],
    );
    return rows;
  }
  await pool.query(
    `INSERT INTO athletes (
        firstName,
        lastName,  
        sex,
        height,
        weight,
        sport,
        dateOfBirth)
        VALUES ($1,$2,$3,$4,$5,$6,$7)`,
    [
      capitalise(req.body.firstName),
      capitalise(req.body.lastName),
      req.body.sex,
      req.body.height,
      req.body.weight,
      req.body.sport,
      req.body.dob,
    ],
  );

  const { rows } = await pool.query(
    'SELECT * from athletes WHERE firstName = $1 AND lastName = $2',
    [capitalise(req.body.firstName), capitalise(req.body.lastName)],
  );
  return rows;
}

async function getTargetAthlete(athleteId) {
  const { rows } = await pool.query(
    `SELECT 
    CONCAT(firstName, ' ',lastName) AS fullname
    FROM athletes WHERE id=$1`,
    [athleteId],
  );
  return rows;
}

async function deleteAthlete(athleteId) {
  await pool.query('DELETE FROM athletes WHERE id=$1', [athleteId]);
}

module.exports = {
  getAthleteCount,
  getSportCount,
  getStaffCount,
  getAllAthletesInfo,
  getAthleteDetails,
  getAllSports,
  createNewAthlete,
  getTargetAthlete,
  deleteAthlete,
};
