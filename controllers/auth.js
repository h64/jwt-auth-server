require('dotenv').config()
const jwt = require('jsonwebtoken');
const router = require('express').Router();
const db = require('../models');

router.post('/login', (req, res) => {
    res.send('STUB - post /auth/login')
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
    res.send('STUB - current user data')
})

module.exports = router;