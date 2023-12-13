const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const User = require("../models/user");

const JWT_SECRET = process.env.JWT_SECRET;

const getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError("Some error occured. Could not find users");
    return next(error);
  }

  if (users.length === 0) {
    const error = new HttpError("Could not find any users");
    return next(error);
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new HttpError("Invalid input", 422);
    console.log(errors);
    return next(error);
  }

  const { name, email, password } = req.body;
  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later",
      422
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User already exists, pleast login instead",
      422
    );
    return next(error);
  }

  let hashedPwd;

  try {
    hashedPwd = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create user, please try again.",
      500
    );
    return next(error);
  }

  const newUser = new User({
    name,
    email,
    password: hashedPwd,
    image: req.file.path,
    places: [],
  });

  try {
    await newUser.save();
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign({ userId: newUser.id, email: newUser.email }, JWT_SECRET, {
      expiresIn: "1h",
    });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later",
      422
    );
    return next(error);
  }

  res.status(201).json({
    userId: newUser.id,
    email: newUser.email,
    token: token,
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  console.log(req.body.password);

  let identifiedUser;

  try {
    identifiedUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Some internal error occured, please try again later",
      500
    );
    return next(error);
  }

  if (!identifiedUser) {
    return next(new HttpError("User not found", 401));
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, identifiedUser.password);
  } catch (err) {
    const error = new HttpError("Could not log you in, please try again", 500);
    return next(error);
  }
  if (!isValidPassword) {
    return next(new HttpError("incorrect password", 401));
  }

  let token;
  try {
    token = jwt.sign(
      { userId: identifiedUser.id, email: identifiedUser.email },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later",
      422
    );
    return next(error);
  }

  res.json({
    userId: identifiedUser.id,
    email: identifiedUser.emai,
    token: token
  });
};

exports.getAllUsers = getAllUsers;
exports.signup = signup;
exports.login = login;
