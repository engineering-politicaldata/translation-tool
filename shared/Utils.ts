import { NextRouter } from 'next/router';
import { APP_ROUTES } from './Constants';

export const handleBack = (
    router: NextRouter,
    fallbackRouter = APP_ROUTES.LANDING,
    forceFallback?: boolean,
) => {
    if (forceFallback) {
        router.push(fallbackRouter);
        // copied from below, doesn't work when forceFallback is used
        if (fallbackRouter === APP_ROUTES.LANDING) {
            router.push('/error', '/');
        }
        return;
    }

    if (window.history.length > 2) {
        router.back();
    } else {
        router.push(fallbackRouter);
        if (fallbackRouter === APP_ROUTES.LANDING) {
            // This is a work around as push('/') does not work and the issue is logged in nextJs Repo
            router.push('/error', '/');
        }
    }
};
