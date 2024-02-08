'use client'

import { Button } from "@/components/ui/button";
import boardingSteps from "@/lib/boarding-steps";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { redirect, usePathname } from "next/navigation";
import { useContext } from "react";
import { FormContext } from "./form-ref-provider";
import { navigate } from "@/lib/navigate";

export default function Nav() {
    let ref = useContext(FormContext);

    let pathname = usePathname();
    if (!pathname) return <></>

    let path = pathname.substring(pathname.lastIndexOf("/") + 1);
    let index = boardingSteps.findIndex(s => s.to === path);

    function previous() {
        let p = boardingSteps[index - 1];
        navigate(p.to);
    }

    function next() {
        ref.current.requestSubmit();
    }

    if (index === 0) return (
        <nav className="flex justify-end mt-8">
            <NextBtn next={next} />
        </nav>
    );

    if (index < boardingSteps.length - 1) return (
        <nav className="flex justify-between mt-8">
            <PrevBtn previous={previous} />
            <NextBtn next={next} />
        </nav>
    );
}

function PrevBtn({ previous }: { previous: () => void }) {
    return (
        <Button variant="link" onClick={previous}>
            <ChevronLeft />
            Previous
        </Button>
    );
}

function NextBtn({ next }: { next: () => void }) {
    return (
        <Button variant="link" onClick={next}>
            Next
            <ChevronRight />
        </Button>
    );
}