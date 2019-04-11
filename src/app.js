const express = require('express');
const busboy = require('connect-busboy');
const querystring = require('querystring');
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const fileSize = require('filesize');
const rclone = require('./rclone');

const app = express();
app.use(busboy({
    highWaterMark: 2 * 1024 * 1024, // Set 2MiB buffer
}));
app.use('/asset', express.static('asset'))
app.set('view engine', 'ejs');
app.set('views', './src/views')

app.get('/', (req, res) => {
    res.redirect('/browser/');
});

app.use(async (req, res, next) => {
    const path = Object.keys(querystring.decode(req.path))[0];
    if (!/^\/browser/.test(path)) {
        return next();
    }
    const { upload } = req.query;
    const directory = path.substr(8);
    const normalizedDirectory = directory[directory.length - 1] === '/' ? directory.substr(0, directory.length - 1) : directory;
    const result = await rclone.ls(directory);
    const files = result.sort((a, b) => b.IsDir - a.IsDir).map(file => {
        return {
            name: file.Name,
            time: moment(file.ModTime).format('YYYY-MM-DD HH:mm:ss'),
            type: file.MimeType,
            size: file.Size ? fileSize(file.Size) : '-',
            icon: file.IsDir ? 'folder' : 'file',
            url: `/${file.IsDir ? 'browser' : 'download'}${normalizedDirectory}/${file.Name}`
        };
    });
    let url = '/browser/';
    const navItems = normalizedDirectory.split('/');
    const navs = navItems.map((nav, index) => {
        const active = index === navItems.length - 1;
        if (index === 0) {
            return { name: 'Home', url, active };
        }
        url += `${nav}/`;
        return { name: nav, url, active };
    });
    res.render('browser', {
        page: `${directory} - RClone Drive`,
        files,
        navs,
        directory: normalizedDirectory,
        uploaded: upload === 'success'
    });
});

app.use(async (req, res, next) => {
    const path = Object.keys(querystring.decode(req.path))[0];
    if (!/^\/download/.test(path)) {
        return next();
    }
    const directory = path.substr(9);
    rclone.cat(directory, res);
});

app.post('/upload', (req, res) => {

    req.pipe(req.busboy); // Pipe it trough busboy

    req.busboy.on('file', (fieldname, file, filename) => {
        console.log(`Upload of '${filename}' started`);

        // Create a write stream of the new file
        const fstream = fs.createWriteStream(path.join(__dirname, filename));
        // Pipe it trough
        file.pipe(fstream);

        // On finish of the upload
        fstream.on('close', () => {
            console.log(`Upload of '${filename}' finished`);
            const { path } = req.query;
            res.redirect(`/browser${path}?upload=success`);
        });
    });
});

module.exports = app;
