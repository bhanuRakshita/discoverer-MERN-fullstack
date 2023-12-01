const express = require('express');

const HttpError = require('../models/http-error');

const router = express.Router();

const DUMMY_PLACES = [
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

router.get('/:pid', (req, res, next)=> {
    const placeId = req.params.pid;
    const place = DUMMY_PLACES.find((p)=>p.id===placeId);
    console.log('GET Request in places');
    if (!place) {
        throw new HttpError('No place found with given place id', 404);
    };
    
    res.json({place});
});

router.get('/user/:uid', (req, res, next)=>{
    const uid = req.params.uid;
    const places = DUMMY_PLACES.filter((place)=>place.creator===uid);
    if (places.length===0) {
        return next(new HttpError('No place found with given user id', 404));
    };
    res.json(places);
});

module.exports = router;