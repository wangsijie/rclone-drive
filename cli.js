#!/usr/bin/env node
var program = require('commander');
var next = require('next');
var express = require('express');
var nanoid = require('readableuuid');
var app = next({ dev: false, dir: __dirname});
var handler = app.getRequestHandler(app);

program
    .version('0.5.0')
    .option('-P, --port [port]', 'Server port', '3000')
    .option('-a, --address [address]', 'Server address', 'localhost')
    .option('-p, --password [password]', 'Password to login, default is random string')
    .option('-s, --secret [secret]', 'Session scret, default is random string')
    .option('-r, --rclone [rclone]', 'Rclone bin path, e.g "/usr/local/bin/rclone"')
    .option('-R, --rclone-config [rcloneConfig]', 'Rclone config file path, e.g "/Users/wangsijie/.config/rclone/rclone.conf"')
    .option('-d, --base-dir [baseDir]', 'Rclone base dir, e.g "s3:defaultbucket"')
    .parse(process.argv);

try {
    if (!program.baseDir) {
        throw new Error('baseDir is required');
    }

    var resolveQuote = function (str) {
        if (!str) {
            return str;
        }
        return replace(/"/g, '');
    }

    process.env['RD_BASE_REMOTE'] = program.baseDir;
    process.env['RD_PASSWORD'] = program.password || nanoid(6);
    process.env['RD_SESSION_SECRET'] = program.secret;
    process.env['RD_RCLONE_PATH'] = resolveQuote(program.rclone);
    process.env['RD_RCLONE_CONFIG_PATH'] = resolveQuote(program.rcloneConfig);

    var port = program.port || 3000;
    var address = program.address || 'localhost';
    app.prepare().then(function() {
        express().use(handler).listen(port, address, function() {
            // eslint-disable-next-line no-console
            console.log(`RClone-Drive running on http://${address}:${port} password: ${process.env['RD_PASSWORD']}`);
        });
    });
} catch (e) {
    // eslint-disable-next-line no-console
    console.error(e.message);
}
