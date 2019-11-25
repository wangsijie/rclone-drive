import { NextApiRequest, NextApiResponse } from 'next';
import * as browserService from '../../../utils/browser';

export default (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const path = Buffer.from(String(req.query.path), 'base64').toString('utf-8');
    browserService.cat(path, res);
  } catch (err) {
    res.status(404).json({ statusCode: 404, message: err.message })
  }
}
