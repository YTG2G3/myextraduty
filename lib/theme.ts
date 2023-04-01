import { MantineThemeOverride } from '@mantine/core';
import { Ubuntu } from '@next/font/google';
const ubuntu = Ubuntu({ weight: '400', subsets: ['latin'] });

export default function theme(primaryColor = "blue") {
    let t: MantineThemeOverride = {
        colorScheme: "light",
        primaryColor,
        fontFamily: [ubuntu.style.fontFamily, "sans-serif"].join(',')
    };

    return t;
}