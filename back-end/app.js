const express = require('express');
const bodyParser = require('body-parser');

const placesRoutes = require('./routes/places-routes.js');
const usersRoutes = require('./routes/users-routes.js');

const app = express();

app.use('/api/places',placesRoutes);
app.use('/api/users', usersRoutes);

app.use((error, req, res, next)=>{
    if(res.headerSent){
        return next(error);
    }
    res.status(error.code || 500)
    res.json({message: error.message || 'An unkown error occured'});
})

app.listen(3000);