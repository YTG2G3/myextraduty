import '@/styles/globals.scss';
import type { AppProps } from 'next/app';
import { MantineProvider } from '@mantine/core';
import theme from '@/lib/theme';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>MyExtraDuty</title>
            </Head>

            <MantineProvider
                withGlobalStyles
                withNormalizeCSS
                theme={theme()}
            >
                <Component {...pageProps} />
            </MantineProvider>
        </>
    );
}
