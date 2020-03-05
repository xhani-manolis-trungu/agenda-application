const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const port = process.env.PORT || 3001;
const host = '0.0.0.0';
const server = http.createServer(app);

const bookRoutes = require('./api/routes/books');
const userRoutes = require('./api/routes/user');

const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const mongoURL = process.env.MONGOCONNECT;

const CLIENT_BUILD_PATH = path.join(__dirname, '../../client/build');

mongoose.connect(
    mongoURL,
    { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }
);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    console.log('header-interceptor: Start setting headers.')
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers", "*"
    );
    if (req.method === 'OPTIONS') {
        var headers = {};
        headers["Access-Control-Allow-Methods"] = "POST, PATCH ,GET, PUT, DELETE, OPTIONS";
        res.writeHead(200, headers);
        res.end();
    }
    next();
})

app.use('/user', userRoutes);
app.use('/books', bookRoutes);

// All remaining requests return the React app, so it can handle routing.
app.get('*', function (request, response) {
    response.sendFile(path.join(CLIENT_BUILD_PATH, 'index.html'));
});

app.listen(port, host);
console.log(`Running on http://${host}:${port}`);

app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    console.log('header-interceptor: error 500.')
    if (error) {
        res.sendStatus(error.status)
    }
    res.status(error.status || 500);
});

module.exports = app;