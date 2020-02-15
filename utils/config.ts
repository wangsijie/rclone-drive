import nanoid from 'nanoid';
import * as path from 'path';
import { homedir } from 'os';

export interface ConfigOptions {
    listen?: string;
    baseRemote?: string;
    password?: string;
    sessionSecret?: string;
    rclonePath?: string;
    rcloneConfigPath?: string;
    publicPath?: string;
    token?: string;
}

const data: ConfigOptions = {
    baseRemote: process.env.RD_BASE_REMOTE,
    password: process.env.RD_PASSWORD || nanoid(),
    sessionSecret: process.env.RD_SESSION_SECRET || null,
    rclonePath: process.env.RD_RCLONE_PATH || '/usr/local/bin/rclone',
    rcloneConfigPath: process.env.RD_RCLONE_CONFIG_PATH || path.join(homedir(), '.config/rclone/rclone.conf'),
    publicPath: process.env.RD_PUBLIC_PATH ? String(process.env.RD_PUBLIC_PATH).replace(/^\//, '') : null,
    token: process.env.RD_TOKEN || null,
    listen: process.env.LISTEN || null,
};

export default data;
