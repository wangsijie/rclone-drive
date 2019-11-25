import * as React from 'react';
import { NextPage } from 'next';
import { get } from '../../utils/api';
import { RCloneFile } from '../../interfaces';
import Browser from '../../components/browser';

type Props = {
  files: RCloneFile[];
}

const BrowserIndexPage: NextPage<Props> = ({ files }) => {
  return (
    <Browser files={files} />
  )
}

BrowserIndexPage.getInitialProps = async () => {
  const files: RCloneFile[] = await get('/api/browser/ls');
  return { files };
}

export default BrowserIndexPage;
