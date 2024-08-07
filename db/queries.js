require('dotenv').config();
const { Pool } = require('pg');
const capitalise = require('../controller/capitalise');

// const devConnectionString = `postgresql://${process.env.USERNAME}:${process.env.PASSWORD}@localhost:5432/squad_roster`;

const pool = new Pool({
  connectionString: process.env.PROD_DB,
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
    CONCAT(firstname, ' ',lastname) AS fullname, 
    CONCAT('/athletes/', athletes.id) AS url, 
    sex, 
    height, 
    weight, 
    sports.name AS sportname, 
    CONCAT('/sports/', sports.id) AS sporturl, 
    TO_CHAR(dateofbirth, 'DD Mon YYYY') dateofbirthformatted 
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
    CONCAT(firstname, ' ',lastname) AS fullname, 
    image_path,
    image_filename,
    sex, 
    height, 
    weight, 
    sports.name AS sportname, 
    CONCAT('/sports/', sports.id) AS sporturl, 
    TO_CHAR(dateofbirth, 'DD Mon YYYY') dateofbirthformatted
    FROM athletes 
    JOIN sports 
    ON athletes.sport=sports.id 
    WHERE athletes.id = $1
    ORDER BY firstname`,
    [athleteId],
  );
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
        firstname,
        lastname,  
        sex,
        height,
        weight,
        sport,
        dateofbirth)
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
        capitalise(req.body.firstname),
        capitalise(req.body.lastname),
        req.body.sex,
        req.body.height,
        req.body.weight,
        req.body.sport,
        req.body.dob,
      ],
    );
    const { rows } = await pool.query(
      'SELECT * FROM athletes WHERE firstname = $1 AND lastname = $2',
      [capitalise(req.body.firstname), capitalise(req.body.lastname)],
    );
    return rows;
  }
  await pool.query(
    `INSERT INTO athletes (
        firstname,
        lastname,  
        sex,
        height,
        weight,
        sport,
        dateofbirth)
        VALUES ($1,$2,$3,$4,$5,$6,$7)`,
    [
      capitalise(req.body.firstname),
      capitalise(req.body.lastname),
      req.body.sex,
      req.body.height,
      req.body.weight,
      req.body.sport,
      req.body.dob,
    ],
  );

  const { rows } = await pool.query(
    'SELECT * FROM athletes WHERE firstname = $1 AND lastname = $2',
    [capitalise(req.body.firstname), capitalise(req.body.lastname)],
  );
  return rows;
}

async function getTargetAthlete(athleteId) {
  const { rows } = await pool.query(
    `SELECT 
    id,
    CONCAT(firstname, ' ',lastname) AS fullname,
    firstname,
    lastname,
    sex,
    height,
    weight,
    sport,
    TO_CHAR(dateofbirth, 'YYYY-MM-DD') dateofbirthformatted 
    FROM athletes WHERE id=$1`,
    [athleteId],
  );
  return rows;
}

async function editAthlete(req) {
  if (req.file) {
    await pool.query(
      `UPDATE athletes
      SET 
      image_fieldname = $1,
      image_originalname = $2,
      image_encoding = $3,
      image_mimetype = $4,
      image_destination = $5,
      image_filename = $6,
      image_path = $7,
      image_size = $8
      WHERE id = $9`,
      [
        req.file.fieldname,
        req.file.originalname,
        req.file.encoding,
        req.file.mimetype,
        req.file.destination,
        req.file.filename,
        req.file.path,
        req.file.size,
        req.params.id,
      ],
    );
  } else {
    await pool.query(
      `UPDATE athletes
      SET 
      firstname = $1,
      lastname = $2,  
      sex = $3,
      height = $4,
      weight = $5,
      sport = $6,
      dateofbirth = $7
      WHERE id = $8`,
      [
        capitalise(req.body.firstname),
        capitalise(req.body.lastname),
        req.body.sex,
        req.body.height,
        req.body.weight,
        req.body.sport,
        req.body.dob,
        req.params.id,
      ],
    );
  }
}

async function deleteAthlete(athleteId) {
  await pool.query('DELETE FROM athletes WHERE id=$1', [athleteId]);
}

async function getAllSportsInfo() {
  const { rows } = await pool.query(`SELECT *, 
    CONCAT('/sports/', sports.id) AS url 
    FROM sports ORDER BY name`);
  return rows;
}

async function getSportDetails(sportId) {
  const { rows } = await pool.query('SELECT * FROM sports WHERE id=$1', [
    sportId,
  ]);
  return rows;
}

async function getSportAthletes(sportId) {
  const { rows } = await pool.query(
    `SELECT 
    athletes.id,
    CONCAT(firstname, ' ',lastname) AS fullname, 
    sex, 
    height, 
    weight, 
    sports.name AS sportname, 
    CONCAT('/athletes/', athletes.id) AS url, 
    TO_CHAR(dateofbirth, 'DD Mon YYYY') dateofbirthformatted 
    FROM athletes
    JOIN sports
    ON athletes.sport = sports.id
    WHERE sport = $1
    ORDER BY firstname`,
    [sportId],
  );
  return rows;
}

async function getSportStaff(sportId) {
  const { rows } = await pool.query(
    `SELECT 
    staff.id,
    CONCAT(firstname, ' ',lastname) AS fullname, 
    sports.name AS sportname, 
    CONCAT('/staff/', staff.id) AS url,
    designation
    FROM staff
    JOIN sports
    ON staff.sport = sports.id
    WHERE sport = $1
    ORDER BY designation desc`,
    [sportId],
  );
  return rows;
}

async function createNewSport(req) {
  const { rows } = await pool.query('INSERT INTO sports (name) VALUES ($1)', [
    capitalise(req.body.sportName),
  ]);
  return rows;
}

async function checkDuplicateSport(sportName) {
  const { rows } = await pool.query('SELECT * FROM sports WHERE name = $1', [
    capitalise(sportName),
  ]);
  return rows;
}

async function getTargetSport(sportId) {
  const { rows } = await pool.query('SELECT * FROM sports WHERE id = $1', [
    sportId,
  ]);
  return rows;
}

async function editSport(req) {
  await pool.query(
    `UPDATE sports
      SET 
      name = $1
      WHERE id = $2`,
    [capitalise(req.body.sportName), req.params.id],
  );
}

async function deleteSport(sportId) {
  await pool.query('DELETE FROM sports WHERE id=$1', [sportId]);
}

async function getAllStaffInfo() {
  const { rows } = await pool.query(
    `SELECT 
    CONCAT(firstname, ' ',lastname) AS fullname, 
    CONCAT('/staff/', staff.id) AS url, 
    sports.name AS sportname, 
    CONCAT('/sports/', sports.id) AS sporturl,
    designation
    FROM staff
    JOIN sports 
    ON staff.sport=sports.id ORDER BY firstname`,
  );
  return rows;
}

async function getStaffDetails(staffId) {
  const { rows } = await pool.query(
    `SELECT 
    staff.id,
    CONCAT(firstname, ' ',lastname) AS fullname, 
    image_path,
    image_filename,
    sports.name AS sportname, 
    CONCAT('/sports/', sports.id) AS sporturl, 
    designation,
    bio
    FROM staff 
    JOIN sports 
    ON staff.sport=sports.id 
    WHERE staff.id = $1
    ORDER BY firstname`,
    [staffId],
  );
  return rows;
}

async function checkDuplicateStaff(firstname, lastname, sportId) {
  const { rows } = await pool.query(
    `SELECT * FROM staff
    WHERE firstname = $1 AND lastname = $2 AND staff.sport = $3`,
    [capitalise(firstname), capitalise(lastname), sportId],
  );
  return rows;
}

async function createNewStaff(req) {
  if (req.file) {
    await pool.query(
      `INSERT INTO staff (
        image_fieldname,
        image_originalname,
        image_encoding,
        image_mimetype,
        image_destination,
        image_filename,
        image_path,
        image_size,
        firstname,
        lastname,
        sport,
        designation,
        bio)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
      [
        req.file.fieldname,
        req.file.originalname,
        req.file.encoding,
        req.file.mimetype,
        req.file.destination,
        req.file.filename,
        req.file.path,
        req.file.size,
        capitalise(req.body.firstname),
        capitalise(req.body.lastname),
        req.body.sport,
        capitalise(req.body.designation),
        capitalise(req.body.bio),
      ],
    );
  } else {
    await pool.query(
      `INSERT INTO staff (
        firstname,
        lastname,
        sport,
        designation,
        bio)
        VALUES ($1,$2,$3,$4,$5)`,
      [
        capitalise(req.body.firstname),
        capitalise(req.body.lastname),
        req.body.sport,
        capitalise(req.body.designation),
        capitalise(req.body.bio),
      ],
    );
  }
}

async function getTargetStaff(staffId) {
  const { rows } = await pool.query(
    `SELECT *,
    id,
    CONCAT(firstname, ' ',lastname) AS fullname 
    FROM staff WHERE id = $1`,
    [staffId],
  );
  return rows;
}

async function editStaff(req) {
  if (req.file) {
    await pool.query(
      `UPDATE staff
      SET 
      image_fieldname = $1,
      image_originalname = $2,
      image_encoding = $3,
      image_mimetype = $4,
      image_destination = $5,
      image_filename = $6,
      image_path = $7,
      image_size = $8
      WHERE id = $9`,
      [
        req.file.fieldname,
        req.file.originalname,
        req.file.encoding,
        req.file.mimetype,
        req.file.destination,
        req.file.filename,
        req.file.path,
        req.file.size,
        req.params.id,
      ],
    );
  } else {
    await pool.query(
      `UPDATE staff
      SET 
      firstname = $1,
      lastname = $2,  
      sport = $3,
      designation = $4,
      bio = $5
      WHERE id = $6`,
      [
        capitalise(req.body.firstname),
        capitalise(req.body.lastname),
        req.body.sport,
        req.body.designation,
        req.body.bio,
        req.params.id,
      ],
    );
  }
}

async function deleteStaff(staffId) {
  await pool.query('DELETE FROM staff WHERE id=$1', [staffId]);
}

module.exports = {
  getAthleteCount,
  getSportCount,
  getStaffCount,
  getAllAthletesInfo,
  getAthleteDetails,
  createNewAthlete,
  getTargetAthlete,
  editAthlete,
  deleteAthlete,
  getAllSportsInfo,
  getSportDetails,
  getSportAthletes,
  getSportStaff,
  createNewSport,
  checkDuplicateSport,
  getTargetSport,
  editSport,
  deleteSport,
  getAllStaffInfo,
  getStaffDetails,
  checkDuplicateStaff,
  createNewStaff,
  getTargetStaff,
  editStaff,
  deleteStaff,
};
