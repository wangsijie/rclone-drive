import { NextApiRequest, NextApiResponse } from 'next';
import * as browserService from '../../../utils/browser';
import { apiAuth } from '../../../utils/auth';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (!apiAuth(req, res)) { return; }
    try {
        const { path, isDir } = req.body;
        if (!path) {
            throw new Error('Invalid path');
        }
        res.status(200).json(await browserService.rm(path, isDir));
    } catch (err) {
        res.status(500).json({ statusCode: 500, message: err.message })
    }
}
