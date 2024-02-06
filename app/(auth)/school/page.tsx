import authSession from "@/lib/auth-session";
import Redirect from "./redirect";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";

export default async function SchoolInit() {
    let session = await authSession();
    let school = await prisma.enrollment.findFirst({ where: { userId: session.user.id } });

    if (!school) redirect("/school/new");

    // Just in case localstorage has a previous record, client component is used
    return <Redirect id={school.id} />
}