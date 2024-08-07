const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const capitalise = require('./capitalise');
const queries = require('../db/queries');

exports.staffDirectory = asyncHandler(async (req, res) => {
  const staffList = await queries.getAllStaffInfo();
  res.render('./staff/staff', { staffList });
});

exports.staffDetails = asyncHandler(async (req, res) => {
  const [staff] = await queries.getStaffDetails(req.params.id);
  res.render('./staff/staff-details', { staff });
});

exports.newStaffGET = asyncHandler(async (req, res) => {
  const sports = await queries.getAllSportsInfo();
  res.render('./staff/staff-form', { sports });
});

exports.newStaffPOST = [
  body('firstname').trim().escape(),
  body('lastname').trim().escape(),
  body('sport').trim().escape(),
  body('designation').trim().escape(),
  body('bio').trim().escape(),
  body('password')
    .equals(process.env.PASSWORD)
    .withMessage('Password incorrect. Please try again.'),

  asyncHandler(async (req, res) => {
    let newStaff;
    const sports = await queries.getAllSportsInfo();
    if (req.file) {
      newStaff = {
        image: {
          image_fieldname: req.file.fieldname,
          image_originalname: req.file.originalname,
          image_encoding: req.file.encoding,
          image_mimetype: req.file.mimetype,
          image_destination: req.file.destination,
          image_filename: req.file.filename,
          image_path: req.file.path,
          image_size: req.file.size,
        },
        firstname: capitalise(req.body.firstname),
        lastname: capitalise(req.body.lastname),
        sport: req.body.sport,
        designation: capitalise(req.body.designation),
        bio: capitalise(req.body.bio),
      };
    } else {
      newStaff = {
        image: {
          image_fieldname: null,
          image_originalname: null,
          image_encoding: null,
          image_mimetype: null,
          image_destination: null,
          image_filename: null,
          image_path: null,
          image_size: null,
          id: req.params.id,
        },
        firstname: capitalise(req.body.firstname),
        lastname: capitalise(req.body.lastname),
        sport: req.body.sport,
        designation: capitalise(req.body.designation),
        bio: capitalise(req.body.bio),
      };
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('./staff/staff-form', {
        sports,
        staff: newStaff,
        errors: errors.array(),
      });
    } else {
      const [duplicateCheck] = await queries.checkDuplicateStaff(
        req.body.firstname,
        req.body.lastname,
        req.body.sport,
      );

      if (duplicateCheck) {
        res.render('./staff/staff-form', {
          sports,
          staff: newStaff,
          errors: errors.array(),
          duplicateError: `'${newStaff.firstname} ${newStaff.lastname}' already exists`,
        });
      } else {
        await queries.createNewStaff(req);
        const staffList = await queries.getAllStaffInfo();
        res.render('./staff/staff', { staffList });
      }
    }
  }),
];

exports.editStaffGET = asyncHandler(async (req, res) => {
  const [[staff], sports] = await Promise.all([
    queries.getTargetStaff(req.params.id),
    queries.getAllSportsInfo(),
  ]);
  res.render('./staff/staff-form', {
    staff,
    sports,
    title: `Edit Staff Particulars - ${staff.firstname} ${staff.lastname}`,
  });
});

exports.editStaffPOST = [
  body('firstname').trim().escape(),
  body('lastname').trim().escape(),
  body('sport').trim().escape(),
  body('designation').trim().escape(),
  body('bio').trim().escape(),
  body('password')
    .equals(process.env.PASSWORD)
    .withMessage('Password incorrect. Please try again.'),

  asyncHandler(async (req, res) => {
    let newStaff;

    if (req.file) {
      newStaff = {
        image: {
          image_fieldname: req.file.fieldname,
          image_originalname: req.file.originalname,
          image_encoding: req.file.encoding,
          image_mimetype: req.file.mimetype,
          image_destination: req.file.destination,
          image_filename: req.file.filename,
          image_path: req.file.path,
          image_size: req.file.size,
        },
        firstname: capitalise(req.body.firstname),
        lastname: capitalise(req.body.lastname),
        sport: req.body.sport,
        designation: capitalise(req.body.designation),
        bio: capitalise(req.body.bio),
      };
    } else {
      newStaff = {
        image: {
          image_fieldname: null,
          image_originalname: null,
          image_encoding: null,
          image_mimetype: null,
          image_destination: null,
          image_filename: null,
          image_path: null,
          image_size: null,
          id: req.params.id,
        },
        firstname: capitalise(req.body.firstname),
        lastname: capitalise(req.body.lastname),
        sport: req.body.sport,
        designation: capitalise(req.body.designation),
        bio: capitalise(req.body.bio),
      };
    }

    const sports = await queries.getAllSportsInfo();

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('./staff/staff-form', {
        sports,
        staff: newStaff,
        errors: errors.array(),
        title: `Edit Staff Particulars - ${newStaff.firstname} ${newStaff.lastname}`,
      });
    } else {
      await queries.editStaff(req);
      const staffList = await queries.getAllStaffInfo();
      res.render('./staff/staff', { staffList });
    }
  }),
];

exports.changeStaffPicGET = asyncHandler(async (req, res) => {
  const [targetStaff] = await queries.getTargetStaff(req.params.id);
  res.render('./staff/staff-change-pic', {
    staff: targetStaff,
    title: `Change Picture - ${targetStaff.firstname} ${targetStaff.lastname}`,
  });
});

exports.changeStaffPicPOST = [
  body('password')
    .equals(process.env.PASSWORD)
    .withMessage('Password incorrect. Please try again.'),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const [targetStaff] = await queries.getTargetStaff(req.params.id);
      res.render('./staff/staff-change-pic', {
        staff: targetStaff,
        errors: errors.array(),
        title: `Change Picture - ${targetStaff.firstname} ${targetStaff.lastname}`,
      });
    } else {
      await queries.editStaff(req);
      const staffList = await queries.getAllStaffInfo();
      res.render('./staff/staff', { staffList });
    }
  }),
];

exports.deleteStaffGET = asyncHandler(async (req, res) => {
  const [targetStaff] = await queries.getTargetStaff(req.params.id);
  res.render('./staff/staff-delete', { staff: targetStaff });
});

exports.deleteStaffPOST = [
  body('password')
    .equals(process.env.PASSWORD)
    .withMessage('Password incorrect. Please try again.'),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    const targetStaff = await queries.getTargetStaff(req.params.id);

    if (!errors.isEmpty()) {
      res.render('./staff/staff-delete', {
        staff: targetStaff,
        errors: errors.array(),
      });
    } else {
      await queries.deleteStaff(req.params.id);
      const staffList = await queries.getAllStaffInfo();
      res.render('./staff/staff', { staffList });
    }
  }),
];
