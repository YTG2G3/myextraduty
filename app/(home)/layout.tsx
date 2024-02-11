import Nav from "./nav";
import getServerSession from "@/lib/get-server-session";

export default async function HomeLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    let session = await getServerSession();

    return (
        <>
            <Nav authed={!!session} />

            {children}
        </>
    );
}
