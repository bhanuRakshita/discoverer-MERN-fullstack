const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/user");

const getAllUsers = async (req, res, next) => {
    let users;
    try{
        users = await User.find({}, '-password');
    } catch (err) {
        const error = new HttpError('Some error occured. Could not find users');
        return next(error);
    }

    if(users.length===0){
        const error = new HttpError('Could not find any users');
        return next(error);
    }
  res.json({ users: users.map(user=>user.toObject({getters: true})) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new HttpError("Invalid input", 422);
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

  const newUser = new User({
    name,
    email,
    password,
    image:
      "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.vectorstock.com%2Froyalty-free-vectors%2Fblank-profile-picture-vectors&psig=AOvVaw0RN3FOcWyBOCltPmvO7mb1&ust=1701562612649000&source=images&cd=vfe&ved=0CBIQjRxqFwoTCPC9-eu874IDFQAAAAAdAAAAABAE",
    places: [],
  });
  try {
    await newUser.save();
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  res.status(201).json({ message: "new user added", newUser: newUser });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

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
  } else if (identifiedUser.password !== password) {
    return next(new HttpError("incorrect password", 401));
  }

  res.json({ message: "user logged in successfully!!" });
};

exports.getAllUsers = getAllUsers;
exports.signup = signup;
exports.login = login;
