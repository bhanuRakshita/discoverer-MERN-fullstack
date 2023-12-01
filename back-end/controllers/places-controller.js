const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../utils/location");
const Place = require("../models/place");

let DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    address: "20 W 34th St, New York, NY 10001",
    creator: "u1",
  },
];

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;

  try {
    place = await Place.findById(placeId);
  } catch (err) {
    // following erroris if there was a problwth get request
    const error = new HttpError("Something went wrong, could not find a place");
  }

  if (!place) {
    const error = new HttpError("No place found with given place id", 404);
    return next(error);
  }

  res.json({ place: place.toObject({ getters: true }) });
};

const getPlaceByUserId = (req, res, next) => {
  const uid = req.params.uid;
  const places = DUMMY_PLACES.filter((place) => place.creator === uid);
  if (places.length === 0) {
    return next(new HttpError("No place found with given user id", 404));
  }
  res.json(places);
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    next(new HttpError("Invalid input", 422));
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
  try {
    await createdPlace.save();
  } catch (err) {
    const error = new HttpError("Creating place failed, please try again", 500);
    return next(error);
  }
  res.status(201).json({ place: createdPlace });
};

const updatePlaceById = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new HttpError("Invalid input", 422);
  }
  const pid = req.params.pid;
  const { title, description } = req.body;
  const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === pid) };
  const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === pid);
  updatedPlace.title = title;
  updatedPlace.description = description;

  DUMMY_PLACES[placeIndex] = updatedPlace;

  res.status(200).json({ place: updatedPlace });
};

const deletePlaceById = (req, res, next) => {
  const pid = req.params.pid;
  if (!DUMMY_PLACES.find((p) => p.id === pid)) {
    throw new HttpError("No place found with given id", 422);
  }

  DUMMY_PLACES = DUMMY_PLACES.filter((place) => place.id !== pid);
  res.status(201).json({ message: "Deleted place", newPlaces: DUMMY_PLACES });
};

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;
