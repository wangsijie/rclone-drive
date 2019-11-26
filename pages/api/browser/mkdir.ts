import { NextApiRequest, NextApiResponse } from 'next';
import * as browserService from '../../../utils/browser';
import { apiAuth } from '../../../utils/auth';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (!apiAuth(req, res)) { return; }
    try {
        const { path } = req.body;
        if (!path) {
            throw new Error('Invalid path');
        }
        await browserService.mkdir(path)
        res.status(200).end();
    } catch (err) {
        res.status(500).json({ statusCode: 500, message: err.message })
    }
}
