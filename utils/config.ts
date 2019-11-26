import nanoid from 'nanoid';
import * as path from 'path';
import { homedir } from 'os';

export interface ConfigOptions {
    baseRemote?: string;
    password?: string;
    sessionSecret?: string;
    rclonePath?: string;
    rcloneConfigPath?: string;
}

const data: ConfigOptions = {
    baseRemote: process.env.RD_BASE_REMOTE,
    password: process.env.RD_PASSWORD || nanoid(),
    sessionSecret: process.env.RD_SESSION_SECRET || null,
    rclonePath: process.env.RD_RCLONE_PATH || '/usr/local/bin/rclone',
    rcloneConfigPath: process.env.RD_RCLONE_CONFIG_PATH || path.join(homedir(), '.config/rclone/rclone.conf'),
};

export default data;
