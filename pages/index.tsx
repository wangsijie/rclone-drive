import * as React from 'react';
import { NextPage } from 'next';
import { get } from '../utils/api';
import { RCloneFile } from '../interfaces';
import Browser from '../components/browser';

type Props = {
  files: RCloneFile[];
}

const IndexPage: NextPage<Props> = ({ files }) => {
  return (
    <Browser files={files} />
  )
}

IndexPage.getInitialProps = async () => {
  const files: RCloneFile[] = await get('/api/browser/ls');
  return { files };
}

export default IndexPage;
