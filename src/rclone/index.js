const spawnP = require('spawn-promise');
const { spawn } = require('child_process');
const { baseRemote } = require('../config');

module.exports.ls = async (path) => {
    const output = await spawnP('rclone', [
        'lsjson',
        `${baseRemote}${path}`
    ]);
    if (!output) {
        return [];
    }
    const files = JSON.parse(output.toString());
    return files;
};

module.exports.cat = async (path, res) => {
    const rclone = spawn('rclone', [
        'cat',
        `${baseRemote}${path}`
    ]);
    rclone.stdout.pipe(res);
};

module.exports.rcat = (path, stream) => new Promise((resolve, reject) => {
    const rclone = spawn('rclone', [
        'rcat',
        `${baseRemote}${path}`
    ]);
    rclone.on('error', (e) => reject(e));
    stream.pipe(rclone.stdin);
    rclone.stdin.on('close', () => resolve());
});
