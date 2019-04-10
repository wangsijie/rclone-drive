const spawn = require('spawn-promise');
const { isDir } = require('../util');

module.exports.ls = async (path) => {
    const output = await spawn('rclone', [
        'lsf',
        `sijie:document${path}`
    ]);
    if (!output) {
        return [];
    }
    const files = output.toString().split('\n');
    return files.filter(item => item).sort((a, b) => {
        const scoreA = isDir(a) ? 1 : 0;
        const scoreB = isDir(b) ? 1 : 0;
        return scoreB - scoreA;
    });
};
