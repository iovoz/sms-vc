"use strict";
const express = require('express');
require('express-async-errors');
const nocache = require('nocache');

const helmet = require('helmet');
import languageHandler from './server/middlewares/languageHandler';
import errorHandler from './server/middlewares/errorHandler';
import lowercaseUrlHandler from './server/middlewares/lowercaseUrlHandler';
const app = express(),
    path = require('path'),
    config = require(__dirname + '/config'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser');

app.use(helmet());

//app properties setting
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/server/views'));
app.set('view cache', false);

app.use(express.static(path.join(__dirname, (config.clientPath || '/public'))));

global.__base = __dirname;

app.use(cookieParser());

const session = require('express-session');
const sessionConfig = {
    secret: '84t5Qy1C!Whl5rRKS#Wq%hz*%sMaNssL',
    cookie: {
        httpOnly: true
    },
    proxy: true,  // Trust the reverse proxy when setting secure cookies (via the "X-Forwarded-Proto" header)
    resave: false,
    saveUninitialized: false
};

if (process.env.NODE_ENV === 'production') {
    // app.set('trust proxy', 1);  // trust first proxy
    sessionConfig.cookie.secure = true;  // serve secure cookies
}
app.use(session(sessionConfig));

const useragent = require('express-useragent');
app.use(useragent.express());
app.use(lowercaseUrlHandler);
app.use(languageHandler);

app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(nocache());

//routes setting
app.use(require('./server/controllers/homeController'));
app.use(errorHandler);
app.get('*', function (req, res) {
    res.status(404);
    res.render('error');
});

module.exports = app;
