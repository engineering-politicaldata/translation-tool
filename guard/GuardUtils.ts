import { NextPageContext } from 'next';
import Router from 'next/router';
import { APP_ROUTES } from '../shared/Constants';

/**
 * redirect user to login page
 * @param ctx Page Context, if null, client side routing will be used
 */
export const redirectToLogin = (ctx: NextPageContext) => {
    let actualPath = ctx ? ctx.asPath : document.location.pathname;
    let pathName = ctx ? ctx.pathname : document.location.pathname;
    if (!actualPath) {
        actualPath = pathName;
    }
    const login = `${APP_ROUTES.LOGIN}?redirectUri=${encodeURI(actualPath)}`;
    const server = ctx.res;
    if (server) {
        // @see https://github.com/zeit/next.js/wiki/Redirecting-in-%60getInitialProps%60
        // server rendered pages need to do a server redirect
        server.writeHead(302, {
            Location: login,
        });
        server.end();
    } else {
        // only client side pages have access to next/router
        Router.push(login);
    }
};

/**
 * used for getting all cookies as one object
 * from the server request object
 * @param cookies Cookie string {ctx.res.cookie}
 */
export function cookiesHelper(cookies?: String): any {
    if (!cookies) return {};
    let allCookies: Array<any> = cookies.split(';');
    return allCookies.reduce((acc, curr) => {
        let i = curr.split('=');
        acc[i[0].trim()] = i[1].trim();
        return {
            ...acc,
        };
    }, {});
}

/**
 * redirect user to home page for trying to access anon urls
 * @param ctx Page Context, if null, client side routing will be used
 */
export const redirectToHome = (ctx: NextPageContext) => {
    // redirect URL
    const homeUrl = APP_ROUTES.LANDING;
    const server = ctx.res;
    if (server) {
        // @see https://github.com/zeit/next.js/wiki/Redirecting-in-%60getInitialProps%60
        // server rendered pages need to do a server redirect
        server.writeHead(302, {
            Location: homeUrl,
        });
        server.end();
    } else {
        // only client side pages have access to next/router
        Router.push(homeUrl);
    }
};
