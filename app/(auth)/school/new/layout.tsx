import Nav from "./nav";

export default async function NewSchoolLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex justify-center items-center">
            <Nav />

            {children}
        </div>
    );
}
