import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import * as browserService from '../../../../utils/browser';
import { RCloneErrorRemark } from '../../../../utils/rclone/error';
import config from '../../../../utils/config';

export default (req: NextApiRequest, res: NextApiResponse) => {
  const dir = typeof req.query.dir === 'string' ? req.query.dir : req.query.dir.join('/');
  const escapedDir = path.normalize(dir).replace(/^(\.\.(\/|\\|$))+/, '');
  browserService.cat(path.join(config.publicPath, escapedDir), res, (e: any) => {
    if (e.remark === RCloneErrorRemark.DirectoryNotFound) {
      res.status(404).json({ statusCode: 404, message: 'Directory not found' })
    } else {
      res.status(404).json({ statusCode: 404, message: e.message })
    }
  });
}
