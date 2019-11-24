import nanoid from 'nanoid';
import * as path from 'path';
import { homedir } from 'os';

export interface ConfigOptions {
    baseRemote?: string;
    password?: string;
    sessionSecret: string;
    sessionKey?: string;
    rclonePath?: string;
    rcloneConfigPath?: string;
}

const data: ConfigOptions = {
    sessionSecret: nanoid(),
};

export const init = (config: ConfigOptions): void => {
    data.baseRemote = config.baseRemote;
    data.password = config.password || nanoid();
    if (config.sessionSecret) {
        data.sessionSecret = config.sessionSecret;
    }
    data.sessionKey = 'user';
    data.rclonePath = config.rclonePath || '/usr/local/bin/rclone';
    data.rcloneConfigPath = config.rcloneConfigPath || path.join(homedir(), '.config/rclone/rclone.conf');
};

export default data;
