require('dotenv').config();
const app = require('./src/app');
const { password } = require('./src/config');

const requiredEnvs = [
    'BASE_REMOTE',
    'RCLONE_PATH',
    'RCLONE_CONFIG_PATH',
];
requiredEnvs.forEach(env => {
    if (process.env[env] === undefined) {
        throw new Error(`ENV: ${env} is not set properly`);
    }
});

const port = process.env.PORT || 3000;
const address = process.env.ADDRESS || 'localhost';
app.listen(port, address, () => {
    console.log(`RClone-Drive running on http://${address}:${port}, password: ${password}`);
});
