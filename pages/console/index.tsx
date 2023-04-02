import LoadingPage from "@/components/LoadingPage";
import SiteContext from "@/lib/site-context";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";

export default function Console() {
    let { school } = useContext(SiteContext);
    let router = useRouter();

    useEffect(() => {
        if (school) router.replace("/console/dashboard");
        else if (!localStorage.getItem("school")) router.replace("/console/school");

        // elsewise loading
    }, [school]);

    return <LoadingPage />
}