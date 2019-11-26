import Router from 'next/router';
import nextCookie from 'next-cookies';
import { NextPageContext, NextApiRequest, NextApiResponse } from 'next';
import { generateToken, checkToken, removeToken } from './token';

export const login = (): string => {
    return generateToken();
}

export const auth = (ctx: NextPageContext): string => {
    const { token } = nextCookie(ctx);

    // If there's no token, it means the user is not logged in.
    if (!checkToken(token)) {
        if (typeof window === 'undefined') {
            ctx.res.writeHead(302, { Location: '/login' });
            ctx.res.end();
        } else {
            Router.push('/login');
        }
    }

    return token;
}

export const apiAuth = (req: NextApiRequest, res: NextApiResponse): boolean => {
    let token: string = nextCookie({ req }).token;
    if (!token) {
        token = String(req.query.token);
    }

    if (!checkToken(token)) {
        res.status(401).end();
        return false;
    }
    return true;
}

export const logout = (req: NextApiRequest): void => {
    const { token } = nextCookie({ req });
    removeToken(token);
}

export interface InjectedCounterProps {
    getInitialProps(): InjectedCounterProps;
}

export const withAuthSync = (WrappedComponent: any) => {
    const Wrapper = (props: any) => {
        return <WrappedComponent {...props} />
    }

    Wrapper.getInitialProps = async (ctx: NextPageContext) => {
        const token = auth(ctx);

        const componentProps =
            WrappedComponent.getInitialProps &&
            (await WrappedComponent.getInitialProps(ctx))

        return { ...componentProps, token };
    }

    return Wrapper;
}
