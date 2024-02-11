'use client'

import { Toaster } from "@/components/ui/sonner";
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

export default function Providers({ children }) {
    return (
        <>
            {children}

            <Toaster richColors />
            <ProgressBar
                height="4px"
                color="#020817"
                options={{ showSpinner: false }}
                shallowRouting
            />
        </>
    );
}