import * as React from 'react';
import { NextPage, NextPageContext } from 'next';
import nextCookie from 'next-cookies';
import { get, getSelfUrl } from '../../utils/api';
import { RCloneFile } from '../../interfaces';
import Browser from '../../components/browser';
import { withAuthSync } from '../../utils/auth';

type Props = {
  files: RCloneFile[];
}

const BrowserIndexPage: NextPage<Props> = ({ files }) => {
  return (
    <Browser files={files} />
  )
}

BrowserIndexPage.getInitialProps = async (ctx: NextPageContext) => {
  const { token } = nextCookie(ctx);
  const files: RCloneFile[] = await get(`${getSelfUrl(ctx)}/api/browser/ls`, { token });
  return { files };
}

export default withAuthSync(BrowserIndexPage);
