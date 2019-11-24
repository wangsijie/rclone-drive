import { Router, Request, Response } from 'express';
import path from 'path';
import * as rclone from '../../rclone';

const router = Router();

router.get('/file/download*', async (req: Request, res: Response) => {
    const queryPath = decodeURIComponent(req.path);
    const directory = queryPath.substr(14);
    rclone.cat(directory, res);
});

router.post('/file/delete', async (req, res) => {
    const { path: filePath, isDir } = req.query;
    if (parseInt(isDir, 10)) {
        await rclone.purge(filePath);
    } else {
        await rclone.deletefile(filePath);
    }
    res.redirect(`/browser${path.dirname(filePath)}`);
});

router.post('/file/mkdir', async (req, res) => {
    const { path: dir } = req.query;
    const { folder } = req.body;
    // RClone can't create empty dir, (https://github.com/ncw/rclone/issues/1837)
    // so just navigate to target dir, after upload any file, the dir will automaticly created.
    // await rclone.mkdir(path.join(dir, folder));
    res.redirect(path.join('/browser', dir, folder));
});

export default router;
