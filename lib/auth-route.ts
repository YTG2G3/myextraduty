import authOptions from "@/lib/auth-options";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export default async function authRoute(req: NextRequest, school = false) {
    // Retrieve server session
    let session = await getServerSession(authOptions);

    // If the page is authed and the user is not authenticated, redirect to the login page
    if (authed && !session) return NextResponse.json(null, { status: 403 });

    // If the page is unauthed and the user is authenticated, redirect to the home page
    if (unauthed && session) redirect(url);
}                                   