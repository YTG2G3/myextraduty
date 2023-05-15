import '@/styles/globals.scss';
import type { AppProps } from 'next/app';
import { MantineProvider } from '@mantine/core';
import theme from '@/lib/theme';
import Head from 'next/head';
import { SessionProvider, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import SiteContext from '@/lib/site-context';
import { User, School, Enrollment } from '@/lib/schema';
import { RouterTransition } from '@/components/RouterTransition';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import { DatesProvider } from '@mantine/dates';

function Layout({ children, ...props }: any) {
    let { status } = useSession();

    let [user, setUser] = useState<User>(undefined);
    let [school, setSchool] = useState<School>(undefined);
    let [enrollments, setEnrollments] = useState<Enrollment[]>(undefined);

    useEffect(() => { loadData() }, [status]);

    // Load user data
    const loadData = async () => {
        try {
            // When loading
            if (status === "loading") return;

            // When not logged in
            if (status === "unauthenticated") {
                setUser(undefined);
                localStorage.removeItem("school");
                return;
            }

            // When logged in
            let u = await (await fetch("/api/user")).json();
            setUser(u);

            // Get school if it's stored
            let sid = JSON.parse(localStorage.getItem("school"));
            let s = sid ? await (await fetch(`/api/school`, { headers: { school: sid } })).json() : undefined;
            setSchool(s);

            // Get enrollments
            let er = await (await fetch("/api/user/enrollment")).json();
            setEnrollments(er);
        } catch (error) {
            return;
        }
    }

    return (
        <SiteContext.Provider value={{ user, school, enrollments }} >
            <Head>
                <title>{user ? `Welcome, ${user.name}` : "MyExtraDuty"}</title>
            </Head>

            <MantineProvider
                withGlobalStyles
                withNormalizeCSS
                theme={theme(school?.primary_color ?? "blue")}
                {...props}
            >
                <RouterTransition />
                <Notifications />

                <ModalsProvider>
                    <DatesProvider settings={{ firstDayOfWeek: 0 }}>
                        {children}
                    </DatesProvider>
                </ModalsProvider>
            </MantineProvider>
        </SiteContext.Provider>
    );
}

export default function App({ Component, pageProps }: AppProps) {
    return (
        <SessionProvider>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </SessionProvider>
    );
}