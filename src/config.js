const nanoid = require('nanoid');

module.exports = {
    baseRemote: process.env.BASE_REMOTE,
    password: process.env.PASSWORD || nanoid(),
    sessionSecret: process.env.SESSION_SECRET || nanoid(),
    sessionKey: 'user',
    rclonePath: process.env.RCLONE_PATH,
    rcloneConfigPath: process.env.RCLONE_CONFIG_PATH,
};
