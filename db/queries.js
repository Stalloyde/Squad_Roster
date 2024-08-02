require('dotenv').config();
const { Pool } = require('pg');

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

// write queries here

module.exports = {
  getAthleteCount,
  getSportCount,
  getStaffCount,
};
