import type { Metadata } from "next";
import "./globals.css";
import { bricolage, inter } from "./fonts";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
    title: "MyExtraDuty",
    description: "An easy way to manage your extra duties. Powered by Algorix.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${inter.variable} ${bricolage.variable}`}>
            <body className="font-sans">
                {children}

                <Toaster richColors />
            </body>
        </html>
    );
}
