'use client'

import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Redirect({ id }: { id: string }) {
    useEffect(() => {
        // Load school id from local storage
        let school = localStorage.getItem("school");

        // If not set, redirect to id
        if (!school) {
            localStorage.setItem("school", id);
            redirect(`/school/${id}/dashboard`);
        }
        else {
            redirect(`/school/${school}/dashboard`);
        }
    }, [id]);

    return <></>;
}