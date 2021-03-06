// Required Modules
require('dotenv').config();
const express = require('express');
const expressJwt = require('express-jwt');
const cors = require('cors');
const morgan = require('morgan');
const rowdyLogger = require('rowdy-logger');

// Instantiate server
const app = express();
const rowdyResults = rowdyLogger.begin(app);

// Set up middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));
app.use(cors());

// Controllers
app.use('/auth', 
    expressJwt({
        secret: process.env.JWT_SECRET
    })
    .unless({
        path: [
            { url: '/auth/login', methods: ['POST'] },
            { url: '/auth/signup', methods: ['POST'] }
    ]}), 
    require('./controllers/auth'));

// app.use('/auth', require('./controllers/auth'));

// Routes
app.use('*', (req, res) => {
    res.status(404).send({ message: 'Not Found'});
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server now listening on port', PORT);
    rowdyResults.print()
})