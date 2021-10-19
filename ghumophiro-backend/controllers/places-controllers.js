const { v4: uuidv4 } = require("uuid");
const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../util/location");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const Place = require("../models/place");
const User = require("../models/user");

let DUMMY_PLACES = [
  {
    id: "p1",
    title: "Hawa Mahal",
    description: "Hawa hi hawa thandi thandi",
    location: {
      lat: 26.9239,
      lon: 75.8267,
    },
    address:
      "Hawa Mahal Rd, Badi Choupad, J.D.A. Market, Pink City, Jaipur, Rajasthan 302002",
    creator: "u1",
  },
];

// function getPlaceById

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong cound not find place",
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError("Could not find place with provided id", 404);
    return next(error);
  }
  res.json({ place: place.toObject({ getters: true }) }); // getters true adds id to object
};

const getPlaceByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  // let places;
  let userWithPlaces;
  try {
    userWithPlaces = await User.findById(userId).populate("places");
  } catch (err) {
    const error = new HttpError(
      "Fetching Places failed, Please try again",
      404
    );
    return next(error);
  }

  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    return next(
      new HttpError("Could not find place with provided user id", 404)
    );
  }

  res.json({
    places: userWithPlaces.places.map((place) =>
      place.toObject({ getters: true })
    ),
  });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new HttpError("Invalid inputs please check your data", 422));
  }
  const { title, description, address, creator } = req.body;

  let coordinates;

  try {
    coordinates = await getCoordsForAddress(coordinates);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: req.file.path,
    creator,
  });

  let user;

  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError("Creating place failed, Please try again", 500);
    next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided id", 404);
    nect(error);
  }

  console.log(user);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {}

  try {
    await createdPlace.save();
  } catch (err) {
    const error = new HttpError("Creating Place failed Please try again", 500);
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs please check your data", 422));
  }
  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong could not update place",
      500
    );
    return next(error);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong could not update place",
      500
    );
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong could not delete place",
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError("Can't find place for provided id", 404);
    return next(error);
  }

  try {
    const sess = mongoose.startSession();
    sess.startTransaction();
    await place.remove({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await (await sess).commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong could not delete place",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted Place" });
};

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;