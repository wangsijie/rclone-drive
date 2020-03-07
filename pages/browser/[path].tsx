import * as React from 'react';
import { NextPage, NextPageContext } from 'next';
import { RCloneFile } from '../../interfaces';
import Browser from '../../components/browser';
import { withAuthSync } from '../../utils/auth';
import { RCloneErrorRemark } from '../../be-modules/rclone/error';
import * as browserService from '../../be-modules/browser';

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
  const { query } = ctx;
  const path: string = Buffer.from(String(query.path), 'base64').toString('utf-8');
  try {
    const files: RCloneFile[] = await browserService.ls(path);
    return { files, path };
  } catch (e) {
    if (e.remark === RCloneErrorRemark.DirectoryNotFound) {
      return { files: [], notFound: true, path }
    }
    return { files: [], path: '' }
  }
}

export default withAuthSync(BrowserPage);
