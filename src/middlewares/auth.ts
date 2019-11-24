import { Response, NextFunction } from 'express';
import { checkLogin } from '../services/auth';
import { Request } from '../types';

export default (req: Request, res: Response, next: NextFunction): void => {
    if (process.env.NODE_ENV === 'development') {
        return next();
    }
    if (/^\/user\/(login|logout)/.test(req.path)) {
        return next();
    }
    if (checkLogin(req)) {
        return next();
    }
    return res.redirect('/user/login');
};
