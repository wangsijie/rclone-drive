import { Router, Request, Response } from 'express';
import path from 'path';
import * as authService from '../../services/auth';
import * as browserService from '../../services/browser';
import * as rclone from '../../rclone';

const router = Router();

router.get('/browser*', async (req: Request, res: Response) => {
    authService.checkLogin(req);
    const queryPath = decodeURIComponent(req.path);
    const directory = queryPath.substr(8);
    const result = await browserService.ls(directory);
    res.render('browser', result);
});

router.post('/browser*', async (req: any, res: Response) => {
    const directory = decodeURIComponent(req.path).substr(8);
    req.pipe(req.busboy); // Pipe it trough busboy
    req.busboy.on('file', async (_: unknown, file: any, filename: string) => {
        await rclone.rcat(path.join(directory, filename), file);
        // Wait for rclone to refresh (1s)
        await new Promise((r) => setTimeout(r, 1000));
        const result = await browserService.ls(directory);
        res.render('browser', { ...result, uploaded: true });
    });
});

export default router;
