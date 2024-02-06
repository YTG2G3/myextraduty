import authSession from "@/lib/auth-session";
import Nav from "./(landing)/nav";

export default async function HomeLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    let session = await authSession();

    return (
        <>
            <Nav authed={!!session} />

            {children}
        </>
    );
}
