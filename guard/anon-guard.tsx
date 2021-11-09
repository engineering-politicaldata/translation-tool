import { NextPageContext } from 'next';
import React, { Component } from 'react';
import { AuthProps } from '.';
import { KEY_TOKEN } from '../shared/Constants';
import Store from '../shared/Store';
import { cookiesHelper, redirectToHome } from './GuardUtils';
import { AppContextWithAuthToken } from './private-guard';

/**
 * Wraps the component as public-only component. If user is
 * logged in, then redirect user to home page
 * ie. landing page, login page
 * @param WrappedComponent Component to be made public-only
 */
export function anonRoute(WrappedComponent: any) {
    return class extends Component<AuthProps> {
        /**
         * for checking user login status and redicting to
         * auth page if required
         * @param ctx Page Context, will be null in case of client-side rendering
         */
        static async getInitialProps(ctx: NextPageContext) {
            let req = ctx.req;
            let token;

            if (req) {
                token = cookiesHelper(req.headers.cookie)[KEY_TOKEN];
            }
            if (!token) {
                token = Store.getToken();
            }

            const initialProps = { token };

            // if the token exists, then redirect to home page
            if (token) {
                redirectToHome(ctx);
            }

            // if not, then call the wrapped components getInitialProps
            if (WrappedComponent.getInitialProps) {
                // intial prop function should receive context with additional props required;
                const Context: AppContextWithAuthToken = { ...ctx, ...initialProps };
                const wrappedProps = await WrappedComponent.getInitialProps(Context);
                // make sure our token is always returned
                return { ...wrappedProps };
            }
            return initialProps;
        }

        render() {
            // return the wrappedComponent as child
            const { ...propsWithoutAuth } = this.props;
            return <WrappedComponent token={null} {...propsWithoutAuth} />;
        }
    };
}
