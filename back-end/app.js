require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const fs = require('fs');

const placesRoutes = require("./routes/places-routes.js");
const usersRoutes = require("./routes/users-routes.js");
const HttpError = require("./models/http-error.js");
const path = require("path");

const app = express();

const MONGO_USERNAME = process.env.MONGO_USERNAME;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;

app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads','images')));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, PATCH, DELETE, POST, PUT");
  next();
});

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

//for unsupported routes
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, err => {
      console.log(err);
    })
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unkown error occured" });
});

mongoose
  .connect(
    `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.bgfe8le.mongodb.net/mernDB?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(8080);
    console.log("Successful connection to db");
  })
  .catch((err) => {
    console.log("Could no connect to DB");
    console.log(err);
  });
