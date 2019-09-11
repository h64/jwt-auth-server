const router = require('express').Router();

router.post('/login', (req, res) => {
    res.send('STUB - post /auth/login')
})

router.post('/signup', (req, res) => {
    res.send('STUB - post /auth/signup')
})

// Note - user must be logged in to access this route
router.get('/current/user', (req, res) => {
    res.send('STUB - current user data')
})

module.exports = router;