import * as React from 'react';
import { NextPage, NextPageContext } from 'next';
import absoluteUrl from 'next-absolute-url';
import nextCookie from 'next-cookies';
import { get } from '../../utils/api';
import { RCloneFile } from '../../interfaces';
import Browser from '../../components/browser';
import { withAuthSync } from '../../utils/auth';
import { RCloneErrorRemark } from '../../utils/rclone/error';

type Props = {
  files: RCloneFile[];
  path?: string;
  notFound?: boolean;
}

const BrowserPage: NextPage<Props> = ({ files, path, notFound }) => {
  return (
    <Browser files={files} path={path} notFound={notFound} />
  )
}

BrowserPage.getInitialProps = async (ctx: NextPageContext) => {
  const { token } = nextCookie(ctx);
  const { query, req } = ctx;
  const { protocol, host } = absoluteUrl(req);
  const path: string = Buffer.from(String(query.path), 'base64').toString('utf-8');
  try {
    const endpoint = `/api/browser/ls?token=${token}&path=${encodeURIComponent(String(query.path))}`;
    const files: RCloneFile[] = await get(`${protocol}//${host}${endpoint}`);
    return { files, path };
  } catch (e) {
    if (e.response.data.remark === RCloneErrorRemark.DirectoryNotFound) {
      return { files: [], notFound: true, path }
    }
    return { files: [], path: '' }
  }
}

export default withAuthSync(BrowserPage);
