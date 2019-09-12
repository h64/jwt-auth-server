require('dotenv').config()
const jwt = require('jsonwebtoken');
const router = require('express').Router();
const expressJwt = require('express-jwt');

const db = require('../models');

function protectRoute(req, res, next) {
    expressJwt({
        secret: process.env.JWT_SECRET
    })
    next()
}

router.post('/login', (req, res) => {
    // Fint eh user by their email in the db
    db.User.findOne({ email: req.body.email })
    .then(user => {
        // make sure we have a user, and the user has a password
        if(!user || !user.password) {
            return res.status(404).send({ message: 'User not found' })
        }

        // yay - a user. Let's check their password
        if(!user.isAuthenticated(req.body.password)) {
            // invalid credentials - wrong password
            return res.status(406).send({ messsage: 'Not Acceptable: Invalid Credentials '});
        }

        let token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
            expiresIn: 60 * 60 * 24 * 7 // 1 week
        });
        
        res.send({ token });
    })
    .catch(err => {
        console.log('Error in POST /auth/login', err)
        res.status(503).send({ message: 'Something wrong w/ DB or user input '});
    })

})

router.post('/signup', (req, res) => {
    db.User.findOne({ email: req.body.email })
    .then(user => {
        // If the User already exists, don't allow duplicate account creation
        if(user) {
            return res.status(400).send({ message: 'Email address already in use' })
        }

        db.User.create(req.body)
        .then(newUser => {
            let token = jwt.sign(newUser.toJSON(), process.env.JWT_SECRET, {
                expiresIn: 60 * 60 * 8 // 8 hours
            })

            res.send({ token })
        })
        .catch(err => {
            console.log('Error in POST /auth/signup', err)
            res.status(503).send({ message: 'Error while creating user' });
        })
    })
    .catch(err => {
        console.log('Error in POST /auth/signup', err)
        res.status(503).send({ message: 'Error while creating user' });
    })

})

// Note - user must be logged in to access this route
router.get('/current/user', (req, res) => {
    if(!req.user || !req.user._id) {
        return res.status(417).send({ message: 'Check configuration' });
    }

    res.send({ user: req.user });
})

module.exports = router;