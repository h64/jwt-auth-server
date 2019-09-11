// Required Modules
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Instantiate server
const app = express();

// Set up middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));
app.use(cors());

// Controllers
app.use('/auth', require('./controllers/auth'));

// Routes
app.use('*', (req, res) => {
    res.status(404).send({ message: 'Not Found'});
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server now listening on port', PORT);
})