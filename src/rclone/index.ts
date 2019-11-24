import spawnP from 'spawn-promise';
import { spawn } from 'child_process';
import { Response } from 'express';
import { Stream } from 'stream';
import config from '../config';

const generateRcloneCommand = (args: string[]): [string, string[]] => ([config.rclonePath, [...args, '--config', config.rcloneConfigPath]]);

export const ls = async (path: string): Promise<any[]> => {
    const output = await spawnP(...generateRcloneCommand(['lsjson', `${config.baseRemote}${path}`]));
    if (!output) {
        return [];
    }
    const files = JSON.parse(output.toString());
    return files;
};

export const cat = async (path: string, res: Response): Promise<void> => {
    const rclone = spawn(...generateRcloneCommand(['cat', `${config.baseRemote}${path}`]));
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
