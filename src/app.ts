import express, { Express } from 'express';
import busboy from 'connect-busboy';
import path from 'path';
import bodyParser from 'body-parser';
import session from 'express-session';
import config from './config';
import authMiddleware from './middlewares/auth';

import userController from './controllers/user';
import browserControllser from './controllers/browser';
import fileControllser from './controllers/file';

const app: Express = express();
app.use(
    busboy({
        highWaterMark: 2 * 1024 * 1024, // Set 2MiB buffer
    }),
);
app.use(session({
    // key: config.sessionKey,
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/asset', express.static(path.join(__dirname, '../asset')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.use(authMiddleware);

app.get('/', (req, res) => {
    res.redirect('/browser/');
});

app.use(userController);
app.use(browserControllser);
app.use(fileControllser);

export default app;
