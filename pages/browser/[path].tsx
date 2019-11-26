import * as React from 'react';
import { NextPage, NextPageContext } from 'next';
import absoluteUrl from 'next-absolute-url';
import nextCookie from 'next-cookies';
import { get } from '../../utils/api';
import { RCloneFile } from '../../interfaces';
import Browser from '../../components/browser';
import { withAuthSync } from '../../utils/auth';

type Props = {
  files: RCloneFile[];
  path: string;
}

const BrowserPage: NextPage<Props> = ({ files, path }) => {
  return (
    <Browser files={files} path={path} />
  )
}

BrowserPage.getInitialProps = async (ctx: NextPageContext) => {
    const { token } = nextCookie(ctx);
    const { query, req } = ctx;
    const { protocol, host } = absoluteUrl(req);
    const endpoint = `/api/browser/ls?token=${token}&path=${encodeURIComponent(String(query.path))}`;
    const files: RCloneFile[] = await get(`${protocol}//${host}${endpoint}`);
    const path: string = Buffer.from(String(query.path), 'base64').toString('utf-8');
    return { files, path };
}

export default withAuthSync(BrowserPage);
