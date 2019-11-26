import { NextApiRequest, NextApiResponse } from 'next';
import { logout } from '../../utils/auth';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    logout(req);
    res.writeHead(302, { Location: '/login', 'Set-Cookie': `token=deleted; HttpOnly; Path=/; Max-Age=0` }).end();
}
