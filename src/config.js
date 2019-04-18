const nanoid = require('nanoid');
const path = require('path');
const homedir = require('os').homedir();

const data = {};

data.init = (config) => {
    data.baseRemote = config.baseRemote;
    data.password = config.password || nanoid();
    data.sessionSecret = config.sessionSecret || nanoid();
    data.sessionKey = 'user';
    data.rclonePath = config.rclonePath || '/usr/local/bin/rclone';
    data.rcloneConfigPath = config.rcloneConfigPath || path.join(homedir, '.config/rclone/rclone.conf');
};

module.exports = data;
