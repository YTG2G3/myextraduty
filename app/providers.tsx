'use client'

import { Toaster } from "@/components/ui/sonner";
import { AppProgressBar } from 'next-nprogress-bar';
import { Suspense } from "react";


export default function Providers({ children }) {
    return (
        <>
            {children}

            <Toaster richColors />
            <Suspense fallback={null}>
                <AppProgressBar
                    height="4px"
                    color="#020817"
                />
            </Suspense>
        </>
    );
}