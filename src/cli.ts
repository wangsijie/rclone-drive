#!/usr/bin/env node
import program from 'commander';
import app from './app';
import config, { init } from './config';

program
    .version('0.1.0')
    .option('-P, --port [port]', 'Server port', '3000')
    .option('-a, --address [address]', 'Server port', 'localhost')
    .option('-p, --password [password]', 'Password to login, default is random string')
    .option('-s, --secret [secret]', 'Session scret, default is random string')
    .option('-r, --rclone [rclone]', 'Rclone bin path, e.g "/usr/local/bin/rclone"')
    .option('-R, --rclone-config [rcloneConfig]', 'Rclone config file path, e.g "/Users/wangsijie/.config/rclone/rclone.conf"')
    .option('-d, --base-dir [baseDir]', 'Rclone base dir, e.g "s3:defaultbucket"')
    .parse(process.argv);

try {
    if (!program.rclone) {
        throw new Error('rclone is required');
    }
    if (!program.rcloneConfig) {
        throw new Error('rcloneConfig is required');
    }
    if (!program.baseDir) {
        throw new Error('baseDir is required');
    }

    const configData = {
        baseRemote: program.baseDir,
        password: program.password,
        sessionSecret: program.secret,
        rclonePath: program.rclone,
        rcloneConfigPath: program.rcloneConfig,
    };

    init(configData);

    const port: number = program.port || 3000;
    const address: string = program.address || 'localhost';
    app.listen(port, address, () => {
        // eslint-disable-next-line no-console
        console.log(`RClone-Drive running on http://${address}:${port} password: ${config.password}`);
    });
} catch (e) {
    // eslint-disable-next-line no-console
    console.error(e.message);
}
