'use client'

import { redirect, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function New() {
    let pathname = usePathname();
    let [hash, setHash] = useState<string>(undefined);
    let [index, setIndex] = useState(0);

    useEffect(() => setHash(pathname.indexOf("#") >= 0 ? pathname.substring(pathname.indexOf("#") + 1) : ""), [pathname]);

    // Load status
    useEffect(() => {
        let basic = JSON.parse(sessionStorage.getItem("basic") ?? "null");
        let customer = JSON.parse(sessionStorage.getItem("customer") ?? "null");
        let advanced = JSON.parse(sessionStorage.getItem("advanced") ?? "null");

        let index = 0;

        if (basic) index++;
        if (customer) index++;
        if (advanced) index++;

        setIndex(index);
    }, []);

    useEffect(() => redirect("#" + index), [index]);

    return (
        <div>{hash}</div>
    );
}