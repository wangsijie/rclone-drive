const authService = require('../services/auth');

module.exports = (req, res, next) => {
    if (/^\/login/.test(req.path)) {
        return next();
    }
    console.log(req.session);
    if (authService.checkLogin(req, res)) {
        return next();
    }
    return res.redirect('/login');
};
