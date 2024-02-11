import RoleRoute from "../role-route";
import Manager from "./manager";
import User from "./user";

export default async function Task({ params }: { params: { id: string } }) {
    return <RoleRoute id={params.id} user={User} manager={Manager} />
}