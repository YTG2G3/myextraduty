import { MantineThemeOverride } from '@mantine/core';
import { Ubuntu } from 'next/font/google';
const ubuntu = Ubuntu({ weight: '400', subsets: ['latin'] });

// TODO - darkmode
export default function theme(primaryColor: string) {
    let t: MantineThemeOverride = {
        colorScheme: "light",
        primaryColor,
        fontFamily: [ubuntu.style.fontFamily, "sans-serif"].join(',')
    };

    return t;
}