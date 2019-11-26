import * as React from 'react';
import Head from 'next/head';
import { Container } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import LoadingContext from '../contexts/loading';
import './layout.less';

type Props = {
    title?: string,
    className?: string,
}

const Layout: React.FunctionComponent<Props> = ({
    children,
    className = '',
    title = '',
}) => {
    const [loading, setLoading] = React.useState<boolean>(false);
    return (
        <div>
            <Head>
                <title>{title.length ? `${title} - Rclone Drive` : 'Rclone Drive'}</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
            </Head>
            <header>

            </header>
            {loading ? <LinearProgress /> : <div style={{ height: '4px' }} />}
            <LoadingContext.Provider value={{
                loading,
                setLoading,
            }}>
                <Container className={className}>
                    {children}
                </Container>
            </LoadingContext.Provider>
            <footer>
            </footer>
        </div>
    )
}

export default Layout
