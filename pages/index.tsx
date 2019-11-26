import * as React from 'react';
import { NextPage, NextPageContext } from 'next';
import absoluteUrl from 'next-absolute-url';
import nextCookie from 'next-cookies';
import { get } from '../utils/api';
import { RCloneFile } from '../interfaces';
import Browser from '../components/browser';
import { withAuthSync } from '../utils/auth';

type Props = {
  files: RCloneFile[];
}

const IndexPage: NextPage<Props> = ({ files }) => {
  return (
    <Browser files={files} />
  )
}

IndexPage.getInitialProps = async (ctx: NextPageContext) => {
  const { token } = nextCookie(ctx);
  const { protocol, host } = absoluteUrl(ctx.req);
  const files: RCloneFile[] = await get(`${protocol}//${host}/api/browser/ls`, { token });
  return { files };
}

export default withAuthSync(IndexPage);
