import { NextApiRequest, NextApiResponse } from 'next';
import * as browserService from '../../../utils/browser';
import { RCloneErrorRemark } from '../../../utils/rclone/error';

export default (req: NextApiRequest, res: NextApiResponse) => {
  const path = Buffer.from(String(req.query.path), 'base64').toString('utf-8');
  browserService.cat(path, res, (e: any) => {
    if (e.remark === RCloneErrorRemark.DirectoryNotFound) {
      res.status(404).json({ statusCode: 404, message: 'Directory not found' })
    } else {
      res.status(404).json({ statusCode: 404, message: e.message })
    }
  });
}
