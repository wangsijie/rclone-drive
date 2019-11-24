import moment from 'moment';
import fileSize from 'filesize';
import mime from 'mime-types';
import * as rclone from '../rclone';

export const ls = async (directory: string) => {
    const normalizedDirectory: string =
        directory[directory.length - 1] === '/'
            ? directory.substr(0, directory.length - 1)
            : directory;
    const result = await rclone.ls(directory);
    const files = result
        .sort((a, b) => b.IsDir - a.IsDir)
        .map((file) => ({
            name: file.Name,
            time: file.IsDir
                ? '-'
                : moment(file.ModTime).format('YYYY-MM-DD HH:mm:ss'),
            type: file.IsDir ? '-' : mime.extension(file.MimeType),
            size: file.Size ? fileSize(file.Size) : '-',
            icon: file.IsDir ? 'folder' : 'file',
            isDir: file.IsDir,
            url: `/${
                file.IsDir ? 'browser' : 'file/download'
            }${normalizedDirectory}/${file.Name}`,
            path: `${normalizedDirectory}/${file.Name}`,
        }));
    let url = '/browser/';
    const navItems = normalizedDirectory.split('/');
    const navs = navItems.map((nav, index) => {
        const active = index === navItems.length - 1;
        if (index === 0) {
            return { name: 'Home', url, active };
        }
        url += `${nav}/`;
        return { name: nav, url, active };
    });
    return {
        page: `${directory} - RClone Drive`,
        files,
        navs,
        directory: normalizedDirectory,
    };
};
