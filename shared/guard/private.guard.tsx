import { NextPageContext } from 'next';
import React, { Component } from 'react';
import { KEY_TOKEN } from '../Constants';
import Store from '../Store';
import { cookiesHelper, redirectToLogin } from './guardUtils';

export type AuthProps = {
    token: string;
};

export interface AppContextWithAuthToken extends NextPageContext {
    token: string;
}

/**
 * Wraps the component as private component. If user
 * is not logged in, then redirects the user to login
 * or auth page with current url as redirect URL.
 * @param WrappedComponent Component to be made private
 */
export function privateRoute(WrappedComponent: any) {
    return class extends Component<AuthProps> {
        /**
         * for checking user login status and redicting to
         * auth page if required
         * @param ctx Page Context, will be null in case of client-side rendering
         */
        static async getInitialProps(ctx: AppContextWithAuthToken) {
            const { req, query } = ctx;
            let token = ctx['token'];
            if (!token && req) {
                token = cookiesHelper(req.headers.cookie)[KEY_TOKEN];
            }

            if (!token) {
                token = Store.getToken();
            }

            const initialProps = { token };
            // if the token does not exists, or if it is empty, then redirect to
            // login page
            if (!token) {
                redirectToLogin(ctx);
            }

            // if not, then call the wrapped components getInitialProps
            if (WrappedComponent.getInitialProps) {
                // intial prop function should receive context with additional props required;
                const Context: AppContextWithAuthToken = { ...ctx, ...initialProps };
                const wrappedProps = await WrappedComponent.getInitialProps(Context);
                // make sure our token is always returned
                return { ...wrappedProps, ...initialProps };
            }
            return initialProps;
        }

        render() {
            // return the wrappedComponent as child
            const { token, ...propsWithoutAuth } = this.props;
            return <WrappedComponent token={token} {...propsWithoutAuth} />;
        }
    };
}
