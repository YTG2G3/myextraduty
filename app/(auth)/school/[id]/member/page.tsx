import RoleRoute from "../role-route";
import Manager from "./manager";

export default async function Task({ params }: { params: { id: string } }) {
    return <RoleRoute id={params.id} user={null} manager={Manager} />
}