#!/usr/bin/env node
var program = require('commander');
var next = require('next');
var express = require('express');
var app = next({ dev: false, dir: __dirname});
var handler = app.getRequestHandler(app);

program
    .version('0.1.0')
    .option('-P, --port [port]', 'Server port', '3000')
    .option('-a, --address [address]', 'Server port', 'localhost')
    .option('-p, --password [password]', 'Password to login, default is random string')
    .option('-s, --secret [secret]', 'Session scret, default is random string')
    .option('-r, --rclone [rclone]', 'Rclone bin path, e.g "/usr/local/bin/rclone"')
    .option('-R, --rclone-config [rcloneConfig]', 'Rclone config file path, e.g "/Users/wangsijie/.config/rclone/rclone.conf"')
    .option('-d, --base-dir [baseDir]', 'Rclone base dir, e.g "s3:defaultbucket"')
    .parse(process.argv);

try {
    if (!program.rclone) {
        throw new Error('rclone is required');
    }
    if (!program.rcloneConfig) {
        throw new Error('rcloneConfig is required');
    }
    if (!program.baseDir) {
        throw new Error('baseDir is required');
    }

    process.env['RD_BASE_REMOTE'] = program.baseDir;
    process.env['RD_PASSWORD'] = program.password;
    process.env['RD_SESSION_SECRET'] = program.secret;
    process.env['RD_RCLONE_PATH'] = program.rclone.replace(/"/g, '');
    process.env['RD_RCLONE_CONFIG_PATH'] = program.rcloneConfig.replace(/"/g, '');

    var port = program.port || 3000;
    var address = program.address || 'localhost';
    app.prepare().then(function() {
        express().use(handler).listen(port, address, function() {
            // eslint-disable-next-line no-console
            console.log(`RClone-Drive running on http://${address}:${port} password: ${program.password}`);
        });
    });
} catch (e) {
    // eslint-disable-next-line no-console
    console.error(e.message);
}
