const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const placesRoutes = require('./routes/places-routes.js');
const usersRoutes = require('./routes/users-routes.js');
const HttpError = require('./models/http-error.js');

const app = express();

app.use(bodyParser.json());

app.use('/api/places',placesRoutes);
app.use('/api/users', usersRoutes);

//for unsupported routes
app.use((req, res, next)=> {
    const error = new HttpError('Could not find this route.', 404);
    throw error;
})

app.use((error, req, res, next)=>{
    if(res.headerSent){
        return next(error);
    }
    res.status(error.code || 500)
    res.json({message: error.message || 'An unkown error occured'});
})

app.listen(3000);