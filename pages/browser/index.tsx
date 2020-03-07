import * as React from 'react';
import { NextPage } from 'next';
import * as browserService from '../../be-modules/browser';
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

BrowserIndexPage.getInitialProps = async () => {
  const files: RCloneFile[] = await browserService.ls('/');
  return { files };
}

export default withAuthSync(BrowserIndexPage);
