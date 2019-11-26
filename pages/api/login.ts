import { NextApiRequest, NextApiResponse } from 'next';
import { login } from '../../utils/auth';
import config from '../../utils/config';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { password } = req.body;
        if (password === config.password) {
            const token = login();

            res.writeHead(200, {
                'Set-Cookie': `token=${token}; HttpOnly; Path=/`,
            });
            res.end();
        } else {
            res.status(403).json({ statusCode: 403, message: 'Incorrect password' })
        }
    } catch (err) {
        res.status(500).json({ statusCode: 500, message: err.message })
    }
}
