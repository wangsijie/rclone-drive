import { Router } from 'express';
import Login from './login';
import Logout from './logout';

const router = Router();
router.use('/user', Login);
router.use('/user', Logout);

export default router;
