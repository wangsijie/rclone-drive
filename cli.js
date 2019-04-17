#!/usr/bin/env node
const program = require('commander');

program
    .version('0.1.0')
    .option('-P, --port', 'Server port, default 3000')
    .option('-p, --password', 'Password to login')
    .option('-s, --secret', 'Session scret, default is random string')
    .option('-r, --rclone', 'Rclone bin path')
    .option('-R, --rclone-config', 'Rclone config file path')
    .option('-d, --base-dir', 'Rclone base dir')
    .parse(process.argv);

console.log('hit')
