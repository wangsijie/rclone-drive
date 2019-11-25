import * as React from 'react';
import { NextPage, NextPageContext } from 'next';
import { get } from '../../utils/api';
import { RCloneFile } from '../../interfaces';
import Browser from '../../components/browser';

type Props = {
  files: RCloneFile[];
  path: string;
}

const BrowserPage: NextPage<Props> = ({ files, path }) => {
  return (
    <Browser files={files} path={path} />
  )
}

BrowserPage.getInitialProps = async ({ query }: NextPageContext) => {
    const files: RCloneFile[] = await get(`/api/browser/ls?path=${encodeURIComponent(String(query.path))}`);
    const path: string = Buffer.from(String(query.path), 'base64').toString('utf-8');
    return { files, path };
}

export default BrowserPage;
