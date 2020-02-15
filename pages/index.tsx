import * as React from 'react';
import { NextPage, NextPageContext } from 'next';
import nextCookie from 'next-cookies';
import { get, getSelfUrl } from '../utils/api';
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
  const files: RCloneFile[] = await get(`${getSelfUrl(ctx)}/api/browser/ls`, { token });
  return { files };
}

export default withAuthSync(IndexPage);
