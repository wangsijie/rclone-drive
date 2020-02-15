import config from '../config';
import { NextApiRequest, NextApiResponse } from 'next';

const checkToken = (bear: string | string[]) => {
    if (!config.token || !config.publicPath) {
        return false;
    }
    if (!bear) {
        return false;
    }
    const stringBear = typeof bear === 'string' ? bear : bear.join('');
    const search = /bearer\s(.*)/i.exec(stringBear);
    if (!search) {
        return false;
    }
    const token = search[1];
    return token === config.token;
}

export const openAuth = (req: NextApiRequest, res: NextApiResponse) => {
    if (!checkToken(req.headers.authorization)) {
        res.status(401).end();
        return false;
    }
    return true;
}
