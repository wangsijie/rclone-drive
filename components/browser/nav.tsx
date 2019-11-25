import * as React from 'react';
import Link from 'next/link';
import { Breadcrumbs, Typography } from '@material-ui/core';
import './index.less';

type Props = {
    path: string;
}

const BrowserNav: React.FunctionComponent<Props> = ({ path }) => {
    const normalizedDirectory: string =
        path[path.length - 1] === '/'
            ? path.substr(0, path.length - 1)
            : path;
    const navItems = normalizedDirectory.split('/');
    let url = '/';
    const navs = navItems.map((nav, index) => {
        const active = index === navItems.length - 1;
        if (index === 0) {
            return { name: 'Home', url: '/browser', active };
        }
        url += `${nav}/`;
        return { name: nav, url: `/browser/${encodeURIComponent(Buffer.from(url).toString('base64'))}`, active };
    });
    return (
        <div className='ui-browser-nav'>
            <Breadcrumbs aria-label="breadcrumb">
                {navs.map(nav => nav.active ? <Typography color="textPrimary" key={nav.url}>
                    {nav.name}
                </Typography> : <Link key={nav.url} href={nav.url}>
                    <a>{nav.name}</a>
                </Link>)}
            </Breadcrumbs>
        </div>
    )
}

export default BrowserNav;
