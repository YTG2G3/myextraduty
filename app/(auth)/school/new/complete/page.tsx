'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { navigate } from "@/lib/navigate";
import { format } from "date-fns";
import { useEffect, useState } from "react";

// TODO - currently, timezone is local. make that based on the school's timezone
export default function Complete() {
    let [basic, setBasic] = useState(undefined);
    let [advanced, setAdvanced] = useState(undefined);

    useEffect(() => {
        let basic = sessionStorage.getItem("basic");
        let advanced = sessionStorage.getItem("advanced");
        let plan = sessionStorage.getItem("plan");

        if (!basic || !advanced || !plan) navigate("/school/new/basic");

        let { code } = JSON.parse(plan);

        // TODO - remove this dummy code once stripe is ready
        if (code !== "huskies") navigate("/school/new/plan");

        setBasic(JSON.parse(basic));
        setAdvanced(JSON.parse(advanced));
    }, []);

    if (!basic || !advanced) return <></>;

    return (
        <div className="flex flex-col">
            <div className="text-3xl flex space-x-2">
                <b>Review</b>
                <p>{basic.name}</p>
                <b>before creation</b>
            </div>

            <div>
                <div>
                    <p>Timezone: {basic.timezone}</p>
                    <p>Plan: MVP</p>
                    <p>Opening At: {format(advanced.openingAt, "PPP hh:mm a")}</p>
                    <p>Quota: {advanced.quota}</p>
                    <p>Max Assigned: {advanced.maxAssigned}</p>
                    <p>Drop Enabled: {advanced.dropEnabled ? "Yes" : "No"}</p>
                </div>

                <Avatar className="w-72 h-72 border-1">
                    <AvatarImage src={basic.image} />
                    <AvatarFallback>SL</AvatarFallback>
                </Avatar>
            </div>
        </div>
    );
}