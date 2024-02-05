'use client'

import oauthSignIn from "@/lib/oauthSignIn";
import { Session } from "next-auth"
import { SessionProvider } from "next-auth/react"

export default function AuthProvider({ session, children }: { session: Session, children: React.ReactNode }) {
    // If there is no session, go to the login page
    if (!session) oauthSignIn();

    return (
        <SessionProvider session={session}>
            {children}
        </SessionProvider>
    )
}