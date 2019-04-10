module.exports.isDir = path => {
    if (!path) {
        return false;
    }
    return path[path.length - 1] === '/';
};
