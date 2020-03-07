import nanoid from 'readableuuid';
import crypto from 'crypto';
import config from '../config';

const sessions: string[] = [];

export const generateToken = (): string => {
    if (config.sessionSecret) {
        const content = `${nanoid()}.${new Date().getTime() + 30 * 24 * 3600 * 100}`;
        const hash = crypto.createHmac('sha256', config.sessionSecret).update(content).digest('hex');
        return `${content}.${hash}`;
    }
    const token: string = nanoid();
    sessions.push(token);
    return token;
}

export const checkToken = (token: string): boolean => {
    if (!token) {
        return false;
    }
    if (config.sessionSecret) {
        const search = /(.*)\.(.*)\.(.*)/.exec(token);
        if (!search) {
            return false;
        }
        const [, rand, time, signature] = search;
        if (!rand || rand.length < 6) {
            return false;
        }
        const hash = crypto.createHmac('sha256', config.sessionSecret).update(`${rand}.${time}`).digest('hex');
        if (hash !== signature) {
            return false;
        }
        if (Number(time) < (new Date().getTime())) {
            return false;
        }
        return true;
    }
    return sessions.includes(token);
}

export const removeToken = (token: string) => {
    if (!config.sessionSecret) {
        const index = sessions.indexOf(token);
        if (index > -1) {
            sessions[index] = '';
        }
    }
}
