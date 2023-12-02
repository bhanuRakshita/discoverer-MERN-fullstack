const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../utils/location");
const Place = require("../models/place");
const User = require("../models/user");
const { default: mongoose } = require("mongoose");

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;

  try {
    place = await Place.findById(placeId);
  } catch (err) {
    // following erroris if there was a problwth get request
    const error = new HttpError(
      "Something went wrong, could not find a place",
      400
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError("No place found with given place id", 404);
    return next(error);
  }

  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const uid = req.params.uid;
  let places;

  try {
    places = await Place.find({ creator: uid });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a place",
      400
    );
    return next(error);
  }

  if (places.length === 0) {
    return next(new HttpError("No place found with given user id", 404));
  }

  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    next(new HttpError("Invalid input 123", 422));
  }
  const { title, description, address, creator } = req.body;
  let coordinates;

  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image:
      "https://cdn.britannica.com/86/170586-120-7E23E561/Taj-Mahal-Agra-India.jpg",
    creator,
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError(
      "An unknown error occured while adding place, please try again later.",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError(
      "Could not find user with said id, so failed to add place. Please try again later.",
      404
    );
    return next(error);
  }

  console.log(user);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace); // mongoose sets the place field of user as id of created place
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }
  res.status(201).json({ place: createdPlace });
};

const updatePlaceById = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new HttpError("Invalid input", 422);
  }
  const pid = req.params.pid;
  const { title, description } = req.body;
  let updatedPlace;

  try {
    updatedPlace = await Place.findByIdAndUpdate(pid, {
      title: title,
      description: description,
    });
  } catch (err) {
    const error = new HttpError("Could not update place", 400);
    return next(error);
  }

  res.status(200).json({ place: updatedPlace.toObject({ getters: true }) });
};

const deletePlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;

  try {
    place = await Place.findById(placeId).populate('creator');
  } catch (err) {
    // following erroris if there was a problwth get request
    const error = new HttpError(
      "Something went wrong, could not find a place",
      400
    );
    return next(error);
  }

  console.log(place);
  if (!place) {
    const error = new HttpError("Could not delete place", 404);
    return next(error);
  }

  let deletedPlace;
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    deletedPlace = await Place.findByIdAndDelete(placeId);
    place.creator.places.pull(deletedPlace);
    await place.creator.save({session: sess});
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  res.status(201).json({ message: "Deleted place" });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;
