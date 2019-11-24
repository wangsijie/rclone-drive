import { Response, Request, Router } from 'express';
import config from '../../config';

const router = Router();

router.get('/logout', (req: Request, res: Response) => {
    res.clearCookie(config.sessionKey);
    res.redirect('/login');
});

export default router;
