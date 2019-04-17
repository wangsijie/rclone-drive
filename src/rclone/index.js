const spawnP = require('spawn-promise');
const { spawn } = require('child_process');
const { baseRemote, rcloneConfigPath, rclonePath } = require('../config');

const generateRcloneCommand = (args) => ([rclonePath, [...args, '--config', rcloneConfigPath]]);

module.exports.ls = async (path) => {
    const output = await spawnP(...generateRcloneCommand(['lsjson', `${baseRemote}${path}`]));
    if (!output) {
        return [];
    }
    const files = JSON.parse(output.toString());
    return files;
};

module.exports.cat = async (path, res) => {
    const rclone = spawn(...generateRcloneCommand(['cat', `${baseRemote}${path}`]));
    rclone.stdout.pipe(res);
};

module.exports.rcat = (path, stream) =>
    new Promise((resolve, reject) => {
        const rclone = spawn(...generateRcloneCommand(['rcat', `${baseRemote}${path}`]));
        rclone.on('error', (e) => reject(e));
        stream.pipe(rclone.stdin);
        rclone.stdin.on('close', () => resolve());
    });

module.exports.deletefile = async (path) => spawnP(...generateRcloneCommand(['deletefile', `${baseRemote}${path}`]));

module.exports.purge = async (path) => spawnP(...generateRcloneCommand(['purge', `${baseRemote}${path}`]));

module.exports.mkdir = async (path) => spawnP(...generateRcloneCommand(['mkdir', `${baseRemote}${path}`]));
