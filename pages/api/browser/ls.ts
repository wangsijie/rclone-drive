import { NextApiRequest, NextApiResponse } from 'next';
import * as browserService from '../../../utils/browser';
import { apiAuth } from '../../../utils/auth';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (!apiAuth(req, res)) { return; }
    try {
        const requestPath = req.query.path ? Buffer.from(String(req.query.path), 'base64').toString('utf-8') : '/';
        res.status(200).json(await browserService.ls(requestPath))
    } catch (err) {
        res.status(500).json({ statusCode: 500, message: err.message })
    }
}
