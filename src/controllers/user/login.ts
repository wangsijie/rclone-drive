import { Response, Request, Router } from 'express';
import config from '../../config';
import * as authService from '../../services/auth';

const router = Router();

router.get('/login', (req: Request, res: Response) => {
    res.render('login', { page: 'Login - RClone Drive' });
});

router.post('/login', async (req: Request, res: Response) => {
    const { password } = req.body;
    if (password !== config.password) {
        res.render('login', { page: 'Login - RClone Drive', wrongPassword: true });
    } else {
        await authService.login(req);
        res.redirect('/browser');
    }
});

export default router;
