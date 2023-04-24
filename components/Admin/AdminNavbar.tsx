import { Avatar, NavLink, Navbar, Stack, Image } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";

export default function AdminNavbar({ pageIndex, setPageIndex, user, pgs }: any) {
    return (
        <Navbar width={{ base: 300 }} p="xs">
            <Navbar.Section grow>
                <Stack>
                    {pgs.map((v: any, i: number) => <NavLink onClick={() => setPageIndex(i)} key={i} active={i === pageIndex} label={v.label} icon={v.icon} rightSection={<IconChevronRight size="1rem" stroke={1.5} />} />)}
                </Stack>
            </Navbar.Section>

            <Navbar.Section>
                <NavLink label={user.name} description={user.email} icon={<Avatar radius="xl"><Image src={user.picture} alt={user.name} /></Avatar>} />
            </Navbar.Section>
        </Navbar>
    );
}