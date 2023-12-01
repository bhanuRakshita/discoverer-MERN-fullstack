const { v4: uuidv4 } = require('uuid');

const HttpError = require('../models/http-error');

const DUMMY_USERS = [
    {
        id: 'u1',
        name: "Bhanu Rakshita Paul",
        email: "test@123.com",
        password: 'test123'
    }
];

const getAllUsers = (req, res, next) => {
    res.json({users: DUMMY_USERS});
};

const signup = (req, res, next) => {
    const {name, email, password} = req.body;
    const identifiedUser = DUMMY_USERS.find(user=>user.email===email);
    if(identifiedUser){
        throw new HttpError('User already exists', 422); 
    }
    const newUser = {
        id: uuidv4(),
        name,
        email,
        password
    };
    DUMMY_USERS.push(newUser);
    res.status(201).json({message: 'new user added', newUser: newUser});
};

const login = (req, res, next) => {
    const {email, password} = req.body;
    const identifiedUser = DUMMY_USERS.find(user=>user.email===email);
    if(!identifiedUser) {
        throw new HttpError('User not found', 401); 
    } else if (identifiedUser.password!==password) {
        throw new HttpError('incorrect password', 401); 
    }

    res.json({message: 'userlogged in successfully!!'});

};

exports.getAllUsers = getAllUsers;
exports.signup = signup;
exports.login = login;