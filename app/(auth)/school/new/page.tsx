'use client'

import { navigate } from "@/lib/navigate";
import { useEffect } from "react"

export default function NewInit() {
    useEffect(() => {
        let basic = sessionStorage.getItem('basic');
        if (!basic) navigate('/school/new/basic');

        let plan = sessionStorage.getItem('plan');
        if (!plan) navigate('/school/new/plan');

        let advanced = sessionStorage.getItem('advanced');
        if (!advanced) navigate('/school/new/advanced');

        navigate('/school/new/complete');
    }, []);

    return <></>
}