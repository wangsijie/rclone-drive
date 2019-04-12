const express = require('express');
const busboy = require('connect-busboy');
const querystring = require('querystring');
const path = require('path');
const rclone = require('./rclone');
const browserService = require('./services/browser');

const app = express();
app.use(
    busboy({
        highWaterMark: 2 * 1024 * 1024, // Set 2MiB buffer
    }),
);
app.use('/asset', express.static('asset'));
app.set('view engine', 'ejs');
app.set('views', './src/views');

app.get('/', (req, res) => {
    res.redirect('/browser/');
});

app.get('/browser*', async (req, res) => {
    const queryPath = Object.keys(querystring.decode(req.path))[0];
    const directory = queryPath.substr(8);
    const result = await browserService.ls(directory);
    res.render('browser', result);
});

app.get('/download*', async (req, res) => {
    const queryPath = Object.keys(querystring.decode(req.path))[0];
    const directory = queryPath.substr(9);
    rclone.cat(directory, res);
});

app.post('/browser*', (req, res) => {
    const directory = Object.keys(querystring.decode(req.path))[0].substr(8);
    req.pipe(req.busboy); // Pipe it trough busboy
    req.busboy.on('file', async (fieldname, file, filename) => {
        await rclone.rcat(path.join(directory, filename), file);
        // Wait for rclone to refresh (1s)
        await new Promise((r) => setTimeout(r, 1000));
        const result = await browserService.ls(directory);
        res.render('browser', { ...result, uploaded: true });
    });
});

module.exports = app;
