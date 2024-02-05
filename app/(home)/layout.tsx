import Nav from "./(landing)/nav";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth-options";

export default async function HomeLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    let session = await getServerSession(authOptions);

    return (
        <>
            <Nav authed={!!session} />

            {children}
        </>
    );
}
