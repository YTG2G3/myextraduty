import '@/styles/globals.scss';
import type { AppProps } from 'next/app';
import { MantineProvider } from '@mantine/core';
import theme from '@/lib/theme';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import SiteContext from '@/lib/site-context';

export default function App({ Component, pageProps }: AppProps) {
    let [user, setUser] = useState(undefined);
    let { data: session, status } = useSession();

    useEffect(() => { loadData() }, [status]);

    // Load user data
    const loadData = async () => {
        // When loading
        if (status === "loading") return;

        // When not logged in
        if (status === "unauthenticated") {
            setUser(undefined);
            localStorage.removeItem("school");
            return;
        }

        // When logged in
        let u = axios.get
    }

    return (
        <>
            <Head>
                <title>MyExtraDuty</title>
            </Head>

            <SiteContext.Provider value={{ user }}>
                <MantineProvider
                    withGlobalStyles
                    withNormalizeCSS
                    theme={theme()}
                >
                    <Component {...pageProps} />
                </MantineProvider>
            </SiteContext.Provider>
        </>
    );
}
