import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import App, { AppContext } from 'next/app';
import Head from 'next/head';
import { SWRConfig } from 'swr';
import UserDashboardSummaryProvider from '../components/contexts/UserDashboardSummaryProvider';
import { GRAY_COLOR, PRIMARY_COLOR, SECONDARY_COLOR, TERTIARY_COLOR } from '../shared/Constants';
import { createCustomTheme, ThemeProps } from '../styles/MuiTheme';
const themeConfig: ThemeProps = {
    colors: {
        primary: PRIMARY_COLOR,
        secondary: SECONDARY_COLOR,
        tertiary: TERTIARY_COLOR,
        grey: GRAY_COLOR,
    },
};

const appTheme = createCustomTheme(themeConfig);
class MyApp extends App {
    static async getInitilaProps(appContext: AppContext) {
        const appProps = await App.getInitialProps(appContext);
        return { ...appProps };
    }

    componentDidMount() {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles && jssStyles.parentNode) {
            jssStyles.parentNode.removeChild(jssStyles);
        }
    }

    render() {
        const { Component, pageProps } = this.props;

        return (
            <ThemeProvider theme={appTheme}>
                <Head>
                    <meta
                        name='viewport'
                        content='width=device-width, initial-scale=1.0, maximum-scale=1'
                    />
                </Head>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline />
                <UserDashboardSummaryProvider>
                    <SWRConfig
                        value={{
                            shouldRetryOnError: false,
                            fetcher: (resource, init) =>
                                fetch(resource, init).then(res => res.json()),
                        }}
                    >
                        <Component {...pageProps} />
                    </SWRConfig>
                </UserDashboardSummaryProvider>
            </ThemeProvider>
        );
    }
}

export default MyApp;
