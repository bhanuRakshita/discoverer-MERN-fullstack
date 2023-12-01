const { v4: uuidv4 } = require('uuid');
const {validationResult} = require('express-validator');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../utils/location');

let DUMMY_PLACES = [
    {
      id: 'p1',
      title: 'Empire State Building',
      description: 'One of the most famous sky scrapers in the world!',
      location: {
        lat: 40.7484474,
        lng: -73.9871516
      },
      address: '20 W 34th St, New York, NY 10001',
      creator: 'u1'
    }
  ];

const getPlaceById = (req, res, next)=> {
    const placeId = req.params.pid;
    const place = DUMMY_PLACES.find((p)=>p.id===placeId);
    console.log('GET Request in places');
    if (!place) {
        throw new HttpError('No place found with given place id', 404);
    };
    
    res.json({place});
};

const getPlaceByUserId = (req, res, next)=>{
    const uid = req.params.uid;
    const places = DUMMY_PLACES.filter((place)=>place.creator===uid);
    if (places.length===0) {
        return next(new HttpError('No place found with given user id', 404));
    };
    res.json(places);
};

const createPlace = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()){
        next(new HttpError('Invalid input', 422)) ;
    }
    const { title, description, address, creator} = req.body;
    let coordinates; 
    
    try {
        coordinates = await getCoordsForAddress(address);
    } catch(error) {
        return next(error);
    }

    const createdPlace = {
        id: uuidv4(),
        title,
        description,
        location: coordinates,
        address,
        creator
    };

    DUMMY_PLACES.push(createdPlace);
    res.status(201).json({place: createdPlace});
};

const updatePlaceById = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()){
        throw new HttpError('Invalid input', 422);
    }
    const pid = req.params.pid;
    const { title, description} = req.body;
    const updatedPlace = {...DUMMY_PLACES.find((p)=>p.id===pid)};
    const placeIndex = DUMMY_PLACES.findIndex((p)=>p.id===pid);
    updatedPlace.title = title;
    updatedPlace.description = description;

    DUMMY_PLACES[placeIndex] = updatedPlace;

    res.status(200).json({place: updatedPlace});
};

const deletePlaceById = (req, res, next) => {
    const pid = req.params.pid;
    if (!DUMMY_PLACES.find(p=>p.id===pid)) {
        throw new HttpError('No place found with given id', 422);
    }

    DUMMY_PLACES = DUMMY_PLACES.filter((place)=>place.id!==pid);
    res.status(201).json({message: 'Deleted place', newPlaces: DUMMY_PLACES});
}

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;