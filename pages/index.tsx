import * as React from 'react';
import { NextPage } from 'next';
import { RCloneFile } from '../interfaces';
import Browser from '../components/browser';
import { withAuthSync } from '../utils/auth';
import * as browserService from '../be-modules/browser';

type Props = {
  files: RCloneFile[];
}

const IndexPage: NextPage<Props> = ({ files }) => {
  return (
    <Browser files={files} />
  )
}

IndexPage.getInitialProps = async () => {
  const files: RCloneFile[] = await browserService.ls('/');
  return { files };
}

export default withAuthSync(IndexPage);
