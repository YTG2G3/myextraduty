import Redirect from "./redirect";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import getServerSession from "@/lib/get-server-session";

// TODO - optimize
export default async function SchoolInit() {
    let session = await getServerSession();
    let enrollment = await prisma.enrollment.findFirst({ where: { userId: session.user.id } });

    if (!enrollment) redirect("/school/new");

    let school = await prisma.school.findUnique({ where: { id: enrollment.schoolId } });

    // Just in case localstorage has a previous record, client component is used
    return <Redirect id={school.id} />
}