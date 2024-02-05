import Nav from "./nav";

export default async function HomeLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Nav />

            {children}
        </>
    );
}
