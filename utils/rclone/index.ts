import { spawn } from 'child_process';
import { NextApiResponse } from 'next';
import spawnP from '../spawn-promise';
import { Stream } from 'stream';
import config from '../config';
import { RCloneError, RCloneErrorRemark } from './error';

const generateRcloneCommand = (args: string[]): [string, string[]] => {
    if (!config.rclonePath || !config.rcloneConfigPath) {
        throw new Error('rclonePath and rcloneConfigPath is not properly configgerd');
    }
    return [config.rclonePath, [...args, '--config', config.rcloneConfigPath]]
};

export const ls = async (path: string): Promise<any[]> => {
    const output = await spawnP(...generateRcloneCommand(['lsjson', `${config.baseRemote}${path}`]));
    if (!output) {
        return [];
    }
    const files = JSON.parse(output.toString());
    return files;
};

export const cat = async (path: string, res: NextApiResponse, onError?: Function): Promise<void> => {
    const rclone = spawn(...generateRcloneCommand(['cat', `${config.baseRemote}${path}`]));
    rclone.stderr.setEncoding('utf8');
    rclone.stderr.on('data', data => {
		if (/directory\snot\sfound/.test(data)) {
            onError && onError(new RCloneError(undefined, RCloneErrorRemark.DirectoryNotFound));
        } else {
            onError && onError(new Error(data));
        }
	});
    rclone.stdout.pipe(res);
};

export const rcat = (path: string, stream: Stream) =>
    new Promise((resolve, reject) => {
        const rclone = spawn(...generateRcloneCommand(['rcat', `${config.baseRemote}${path}`]));
        rclone.on('error', (e) => reject(e));
        stream.pipe(rclone.stdin);
        rclone.stdin.on('close', () => resolve());
    });

export const deletefile = async (path: string) => spawnP(...generateRcloneCommand(['deletefile', `${config.baseRemote}${path}`]));

export const purge = async (path: string) => spawnP(...generateRcloneCommand(['purge', `${config.baseRemote}${path}`]));

export const mkdir = async (path: string) => spawnP(...generateRcloneCommand(['mkdir', `${config.baseRemote}${path}`]));
