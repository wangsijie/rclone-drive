import { NextApiRequest, NextApiResponse } from 'next';
import Busboy from 'busboy';
import path from 'path';
import * as browserService from '../../../utils/browser';
import { apiAuth } from '../../../utils/auth';
import { RCloneFile } from '../../../interfaces';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (!apiAuth(req, res)) { return; }
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
            const uploadedFile: RCloneFile = {
                name: filename,
                time: new Date().toISOString(),
                size: file.size,
                icon: 'file',
                isDir: false,
                path: requestPath,
            };
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
