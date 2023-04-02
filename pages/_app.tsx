import '@/styles/globals.scss';
import type { AppProps } from 'next/app';
import { MantineProvider } from '@mantine/core';
import theme from '@/lib/theme';
import Head from 'next/head';
import { SessionProvider, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import SiteContext from '@/lib/site-context';
import { User } from '@/lib/db';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>MyExtraDuty</title>
            </Head>

            <SessionProvider>
                <Layout>
                    <MantineProvider
                        withGlobalStyles
                        withNormalizeCSS
                        theme={theme()}
                    >
                        <Component {...pageProps} />
                    </MantineProvider>
                </Layout>
            </SessionProvider>
        </>
    );
}

function Layout(props: any) {
    let [user, setUser] = useState(undefined);
    let { data: session, status } = useSession();

    useEffect(() => { loadData() }, [status])

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
        setUser(await (await fetch("/api/user")).json());
    }

    return <SiteContext.Provider value={{ user }} {...props} />
}