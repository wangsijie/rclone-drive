import { NextApiRequest, NextApiResponse } from 'next';
import * as browserService from '../../../utils/browser';
import { RCloneErrorRemark } from '../../../utils/rclone/error';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const path = Buffer.from(String(req.query.path), 'base64').toString('utf-8');
  try {
    await browserService.cat(path, res);
  } catch (e) {
    if (e.remark === RCloneErrorRemark.DirectoryNotFound) {
      res.status(404).json({ statusCode: 404, message: 'Directory not found' })
    } else {
      res.status(404).json({ statusCode: 404, message: 'Directory not found' })
    }
  }
  if (!res.headersSent) {
    res.status(404).json({ statusCode: 404, message: 'Directory not found' });
  }
}
