#! /usr/bin/env node
require('dotenv').config();
const { Client } = require('pg');

const SQL = `
CREATE TABLE IF NOT EXISTS sports (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR ( 255 ) NOT NULL
);

INSERT INTO sports (name) 
VALUES
  ('Swimming'),
  ('Basketball')
  ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS athletes (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  image_fieldname VARCHAR(255),
  image_originalname VARCHAR(255),
  image_encoding VARCHAR(50),
  image_mimetype VARCHAR(100),
  image_destination VARCHAR(255),
  image_filename VARCHAR(255),
  image_path VARCHAR(255),
  image_size INTEGER,
  firstName VARCHAR ( 255 ) NOT NULL,
  lastName VARCHAR ( 255 ) NOT NULL,
  sex VARCHAR ( 6 ) NOT NULL,
  height INTEGER NOT NULL,
  weight INTEGER NOT NULL,
  sport INTEGER REFERENCES sports(id),
  dateOfBirth DATE NOT NULL
);

INSERT INTO athletes (firstName, lastName, sex, height, weight, sport, dateOfBirth) 
VALUES
  ('Max', 'Tan', 'Male', 179, 83, 1, '1999-08-12'),
  ('Jed', 'Gates', 'Male', 182, 94, 1, '2004-08-23'),
  ('Langham', 'Cordy', 'Male', 185, 86, 1, '2002-06-11'),
  ('Thomas','Morrison','Male', 183, 79, 1, '2003-09-17'),
  ('Heisky','Boozer','Male', 189, 86, 1, '2001-12-19'),
  ('Len','Tillman','Male', 190, 94, 1, '2005-04-02'),
  ('Morzov','Herro','Male', 175, 84, 1, '2001-01-09'),
  ('Ruf', 'Loyd', 'Male', 187, 97, 1, '2001-05-28'),
  ('Rachel','Bert','Female', 180, 80, 1, '2001-09-17'),
  ('Tet','Tet','Female', 178, 74, 1, '2001-09-12'),
  ('Orit','Orit','Female', 182, 78, 1, '2001-09-13'),
  ('Cassandra','Tet','Female', 174, 82, 1, '2001-09-02'),
  ('Hera','Tet','Female', 174, 81, 1, '2001-04-12'),
  ('Lisa','Tet','Female', 179, 88, 1, '2001-11-15'),
  ('Aurelia','Tet','Female', 172, 74, 1, '2001-10-19'),
  ('Celeste','Tet','Female', 172, 70, 1, '2001-09-27'),
  ('Zack','Brink','Male', 197, 103, 2, '2002-04-06'),
  ('Kobe','James','Male', 199, 110, 2, '2002-07-06'),
  ('Zion','McGrady','Male', 210, 120, 2, '2002-02-19'),
  ('Lamelo','James','Male', 193, 95, 2, '2002-08-03'),
  ('Blake','Curry','Male', 192, 97, 2, '2002-07-12'),
  ('Stephen','Griffin','Male', 192, 92, 2, '2001-12-22'),
  ('Kent','Willionson','Male', 193, 101, 2, '2002-07-30'),
  ('Lenny','Hathaway','Male', 207, 100, 2, '2002-10-01'),
  ('Emma','Prit','Female', 192, 89, 2, '2005-01-03'),
  ('Jordana','Keravac','Female', 192, 80, 2, '2004-01-21'),
  ('Sasha','Stone','Female', 197, 81, 2, '2005-05-25'),
  ('Kate','Winslet','Female', 195, 82, 2, '2003-04-13'),
  ('Moss','Shanks','Female', 182, 83, 2, '2003-03-29'),
  ('Elaine','Peterson','Female', 191, 82, 2, '2004-12-02'),
  ('Benes','James','Female', 183, 78, 2, '2005-02-09'),
  ('Clarisse','Long','Female', 187, 86, 2, '2005-10-06')
  ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS staff (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  image_fieldname VARCHAR(255),
  image_originalname VARCHAR(255),
  image_encoding VARCHAR(50),
  image_mimetype VARCHAR(100),
  image_destination VARCHAR(255),
  image_filename VARCHAR(255),
  image_path VARCHAR(255),
  image_size INTEGER,
  firstName VARCHAR ( 255 ) NOT NULL,
  lastName VARCHAR ( 255 ) NOT NULL,
  designation VARCHAR (255) NOT NULL,
  sport INTEGER REFERENCES sports(id),
  bio VARCHAR (400)
);

INSERT INTO staff (firstName, lastName, designation, sport, bio) 
VALUES
  ('Thomas','Clung','Head Coach', 1,'Fake bio for Thomas Clung, Head Coach since 2004. Lead the swim team to numerous state titles and National top 10 rankings.'),
  ('Jefferson','Howard','Assistant Head Coach', 1,'Started his career as a swim teacher and accumulated experience throughout his 20 year career.'),
  ('Mandy','Jensen','Assistant Coach', 1,'Swam for the team for 10 years.'),
  ('Mia','Richards','Head Coach', 2,'Turned to a coaching career since retiring from the WNBA in 2010. A great teacher and strong disciplinary, players rallying behind her leadership during difficult games are a common sight.'),
  ('Kurt','SkyWalker','Assistant Head Coach', 2,'The newest member of the Basketball coaching staff. Highly versatile in offensive and defensive schemes, as well as the key person in planning and delivering strength and conditioning.'),
  ('Lea','Cobin','Assistant Coach', 2,'From a volunteer coach during the 2020-21 and 2021-22 season, she now leads the nutrition program.')
  ON CONFLICT DO NOTHING;
`;

console.log('This script populates the database');

async function main() {
  console.log('Connecting to DB');
  const client = new Client({
    connectionString: `postgresql://${process.env.USERNAME}:${process.env.PASSWORD}@localhost:5432/${process.env.DATABASE}`,
  });
  await client.connect();
  console.log('Connected to DB');

  // re-populate all staff, athletes and sport via
  await client.query(SQL);
  console.log('DB Populated. Closing DB connection');
  await client.end();
  console.log('done');
}

main().catch((err) => console.log(err));
