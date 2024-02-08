import FormRefProvider from "./form-ref-provider";
import Nav from "./nav";

export default async function NewSchoolLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <FormRefProvider>
            <div className="flex w-full h-full justify-center items-center">
                <div className="w-1/3 flex flex-col">
                    {children}

                    <Nav />
                </div>
            </div>
        </FormRefProvider>
    );
}
