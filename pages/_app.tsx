import '@/styles/globals.scss';
import type { AppProps } from 'next/app';
import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import theme from '@/lib/theme';
import Head from 'next/head';
import { SessionProvider, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import SiteContext from '@/lib/site-context';
import { Profile, School, Enrollment } from '@/lib/schema';
import { RouterTransition } from '@/components/RouterTransition';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import { DatesProvider } from '@mantine/dates';
import { useLocalStorage } from '@mantine/hooks';
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

function Layout({ children, ...props }: any) {
    let { status } = useSession();

    let [user, setUser] = useState<Profile>(undefined);
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
            let s = sid !== null ? await (await fetch(`/api/school`, { headers: { school: sid } })).json() : undefined;
            setSchool(s);

            // Get enrollments
            let er = await (await fetch("/api/user/enrollment")).json();
            setEnrollments(er);
        } catch (error) {
            return;
        }
    }

    const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
        key: 'mantine-color-scheme',
        defaultValue: 'light',
        getInitialValueInEffect: true,
    });

    const toggleColorScheme = (value?: ColorScheme) => setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

    // TODO - fix dark mode not being applied
    return (
        <SiteContext.Provider value={{ user, school, enrollments }} >
            <Head>
                <title>{user ? `Welcome, ${user.name}` : "MyExtraDuty"}</title>
            </Head>

            <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
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
            </ColorSchemeProvider>
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