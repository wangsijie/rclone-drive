import { NextApiRequest, NextApiResponse } from 'next';
import Busboy from 'busboy';
import path from 'path';
import * as browserService from '../../../utils/browser';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const requestPath = req.query.path ? Buffer.from(String(req.query.path), 'base64').toString('utf-8') : '/';
        const busboy = new Busboy({ headers: req.headers });
        req.pipe(busboy);

        let uploaded: boolean = false;
        busboy.on('file', async (_: unknown, file: any, filename: string) => {
            if (uploaded) {
                return;
            }
            uploaded = true; // 只上传一个文件

            await browserService.rcat(path.join(requestPath, filename), file);
            // Wait for rclone to refresh (1s)
            await new Promise((r) => setTimeout(r, 1000));
            const files = await browserService.ls(requestPath);
            const uploadedFile = files.find(f => f.name === filename);
            res.status(201).json(uploadedFile);
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({ statusCode: 500, message: err.message })
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
}
