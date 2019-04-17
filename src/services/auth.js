module.exports.checkLogin = (req) => req.session.user;

module.exports.login = (req) => new Promise((resolve, reject) => req.session.regenerate(err => {
    if (err) {
        reject(err);
    }
    req.session.user = 'default';
    resolve();
}));
