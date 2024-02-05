'use client'

import { useEffect } from "react";

export default function SchoolInit() {
    useEffect(() => {
        // Load school id from local storage
        let school = localStorage.getItem("school");

        // If not set, retrieve from server

    }, []);
}