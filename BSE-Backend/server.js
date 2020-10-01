const app = require('express')();
const http = require('http');
const bodyParser = require('body-parser');

const {socket} = require('./app/sockets/sockets.js');
const apiRoutes = require('./app/routes');
const { session, sess_secret } = require('./config/config');
const MongoStore = require('connect-mongo')(session);

app.use(session({
    secret: sess_secret,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        url: process.env.MONGODB_URI,
        ttl: 2 * 24 * 60 * 60, // = 2 days. Default
        autoRemove: 'native'
    }),
    cookie: {
        httpOnly: false
    }}));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,PATCH");
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

app.use(bodyParser.json());

const port = process.env.PORT;

const server = http
    .createServer(app)
    .listen(port, (p) => {
        process.logger(`app live on ${port}`);
    });

const io = socket(server);

app.use('/',apiRoutes(app, io));