const express = require('express');
const querystring = require('querystring');
const rclone = require('./src/rclone');

const app = express();

app.use(async (req, res, next) => {
    const path = Object.keys(querystring.decode(req.path))[0];
    const result = await rclone.ls(path);
    res.send(result);
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
