import { ChevronsDown, MousePointer } from "lucide-react";

export default function Hero() {
    return (
        <div className="w-full h-screen flex justify-center items-center flex-col relative">
            <div className="flex items-center sm:flex-col md:flex-col lg:flex-row ">
                <p className={`font-extrabold text-7xl mb-3 text-center mr-3 font-grotesque`}>As simple as clicking a button</p>
                <MousePointer width={60} height={60} />
            </div>

            <p className="text-2xl">An easy way to manage your extra duties.</p>

            <ChevronsDown width={80} height={80} className="absolute bottom-16 animate-bounce" />
        </div>
    );
}   