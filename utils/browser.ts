import moment from 'moment';
import mime from 'mime-types';
import * as rclone from './rclone';
import { RCloneFile } from '../interfaces';

export const ls = async (directory: string): Promise<RCloneFile[]> => {
    const normalizedDirectory: string =
        directory[directory.length - 1] === '/'
            ? directory.substr(0, directory.length - 1)
            : directory;
    const result = await rclone.ls(directory);
    const files = result
        .sort((a, b) => b.IsDir - a.IsDir)
        .map((file): RCloneFile => {
            const result: RCloneFile = {
                name: file.Name,
                icon: file.IsDir ? 'folder' : 'file',
                isDir: file.IsDir,
                // url: `/${
                //     file.IsDir ? 'browser' : 'file/download'
                // }${normalizedDirectory}/${file.Name}`,
                path: `${normalizedDirectory}/${file.Name}`,
            };
            if (!file.IsDir) {
                result.time = moment(file.ModTime).format('YYYY-MM-DD HH:mm:ss');
                result.size = file.Size;
                result.type = mime.extension(file.MimeType) || '';
            }
            return result;
        });
    return files;
};

export const cat = rclone.cat;

export const rcat = rclone.rcat;

export const rm = (path: string, isDir: boolean) => {
    if (isDir) {
        return rclone.purge(path);
    }
    return rclone.deletefile(path);
}

export const mkdir = rclone.mkdir;
