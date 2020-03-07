import { NextApiRequest, NextApiResponse } from 'next';
import Busboy from 'busboy';
import { Stream } from 'stream';
import path from 'path';
import * as UUID from 'readableuuid';
import moment from 'moment';
import * as browserService from '../../../be-modules/browser';
import { openAuth } from '../../../utils/auth/open';
import { RCloneFile } from '../../../interfaces';
import configs from '../../../utils/config';

const generateName = (filename: string): string => {
    const match = /\.([0-9a-z]+)(?:[\?#]|$)/i.exec(filename);
    const ext = match ? `.${match[1]}` : '';
    return `/${configs.publicPath}/images/${moment().format('YYYY/MM/DD')}/${UUID()}${ext}`;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (!openAuth(req, res)) { return; }
    try {
        const busboy = new Busboy({ headers: req.headers });
        req.pipe(busboy);

        let uploaded: boolean = false;
        busboy.on('file', async (_: unknown, file: Stream, filename: string) => {
            if (uploaded) {
                return;
            }
            uploaded = true; // 只上传一个文件
            let size: number = 0;
            file.on('data', (chunk) => size += chunk.length);
            const requestPath = req.query.path
                ? path.join(Buffer.from(String(req.query.path), 'base64').toString('utf-8'), filename)
                : generateName(filename);
            await browserService.rcat(requestPath, file);
            const uploadedFile: RCloneFile = {
                name: filename,
                time: new Date().toISOString(),
                size,
                icon: 'file',
                isDir: false,
                path: req.query.path ? requestPath : requestPath.replace(`/${configs.publicPath}`, ''),
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
