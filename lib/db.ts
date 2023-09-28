import { Profile, School, Enrollment, Task, Assignment } from './schema';
import dayjs from 'dayjs';
import { Client } from 'pg';

export async function getUser(client: Client, email: string): Promise<Profile> {
    try {
        let { rows } = await client.query(`SELECT * FROM profile WHERE email=$1`, [email.toLowerCase()]);
        if (rows.length === 0) throw null;

        return rows[0];
    } catch (error) {
        return null;
    }
}

export async function createUser(client: Client, email: string, name: string, picture: string, admin = false): Promise<boolean> {
    email = email.toLowerCase();
    try {
        await client.query(`INSERT INTO profile VALUES ($1,$2,$3,$4)`, [email.toLowerCase(), name, picture, admin]);
        return true;
    } catch (error) {
        return false;
    }
}

export async function updateUserInfo(client: Client, email: string, name: string, picture: string): Promise<boolean> {
    try {
        await client.query(`UPDATE profile SET name=$1, picture=$2 WHERE email=$3`, [name, picture, email.toLowerCase()]);
        return true;
    } catch (error) {
        return false;
    }
}

export async function getSchool(client: Client, sid: number): Promise<School> {
    try {
        let { rows } = await client.query(`SELECT * FROM school WHERE id=$1`, [sid]);
        if (rows.length === 0) throw null;

        let s: School = { ...rows[0], opening_at: rows[0].opening_at };
        return s;
    } catch (error) {
        return null;
    }
}

export async function listUserEnrollments(client: Client, email: string): Promise<Enrollment[]> {
    try {
        let { rows } = await client.query(`SELECT * FROM enrollment WHERE email=$1`, [email.toLowerCase()]);
        return rows as Enrollment[];
    } catch (error) {
        return null;
    }
}

export async function listSchoolEnrollments(client: Client, sid: number): Promise<Enrollment[]> {
    try {
        let { rows } = await client.query(`SELECT * FROM enrollment WHERE school=$1`, [sid]);
        return rows as Enrollment[];
    } catch (error) {
        return null;
    }
}

export async function listSchools(client: Client): Promise<School[]> {
    try {
        let { rows } = await client.query(`SELECT * FROM school`);
        return rows as School[];
    } catch (error) {
        return null;
    }
}

export async function createSchool(client: Client, name: string, owner: string, address: string, primary_color: string, logo: string, timezone: string): Promise<boolean> {
    try {
        let { rows } = await client.query(`INSERT INTO school(name, owner, address, primary_color, logo, timezone) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`, [name, owner, address, primary_color, logo, timezone]);
        let sid = rows[0].id;

        await client.query(`INSERT INTO enrollment VALUES ($1, $2, true)`, [sid, owner]);
        return true;
    } catch (error) {
        return false;
    }
}

export async function updateSchool(client: Client, id: number, address: string, primary_color: string, logo: string, opening_at: string, quota: number, max_assigned: number, drop_enabled: boolean, timezone: string): Promise<boolean> {
    try {
        await client.query(`UPDATE school SET address=$1, primary_color=$2, logo=$3, opening_at=$4, quota=$5, max_assigned=$6, drop_enabled=$7, timezone=$8 WHERE id=$9`, [address, primary_color, logo, opening_at, quota, max_assigned, drop_enabled, timezone, id]);
        return true;
    } catch (error) {
        console.log(error);

        return false;
    }
}

export async function deleteSchool(client: Client, sid: number): Promise<boolean> {
    try {
        await client.query(`DELETE FROM school WHERE id=$1`, [sid]);
        return true;
    } catch (error) {
        return false;
    }
}

export async function listUsers(client: Client): Promise<Profile[]> {
    try {
        let { rows } = await client.query(`SELECT * FROM profile`);
        return rows as Profile[];
    } catch (error) {
        return null;
    }
}

export async function promoteUser(client: Client, email: string): Promise<boolean> {
    try {
        await client.query(`UPDATE profile SET admin=true WHERE email=$1`, [email.toLowerCase()]);
        return true;
    } catch (error) {
        return false;
    }
}

export async function removeUser(client: Client, email: string): Promise<boolean> {
    try {
        // Only removes non-admins
        await client.query(`DELETE FROM profile WHERE email=$1 AND admin=false`, [email.toLowerCase()]);
        return true;
    } catch (error) {
        return false;
    }
}

export async function transferSchoolOwnership(client: Client, sid: number, email: string): Promise<boolean> {
    try {
        await client.query(`UPDATE school SET owner=$1 WHERE id=$2`, [email.toLowerCase(), sid]);
        return true;
    } catch (error) {
        return false;
    }
}

export async function getTask(client: Client, tid: number): Promise<Task> {
    try {
        let { rows } = await client.query(`SELECT * FROM task WHERE id=$1`, [tid]);
        if (rows.length === 0) throw null;

        return {
            id: rows[0].id,
            school: Number(rows[0].school),
            category: rows[0].category,
            location: rows[0].location,
            description: rows[0].description,
            starting_date: rows[0].starting_date.toISOString().substring(0, 10),
            ending_date: rows[0].ending_date.toISOString().substring(0, 10),
            starting_time: rows[0].starting_time.substring(0, 5),
            ending_time: rows[0].ending_time.substring(0, 5),
            capacity: Number(rows[0].capacity)
        };
    } catch (error) {
        return null;
    }
}

export async function listTasks(client: Client, sid: number): Promise<Task[]> {
    try {
        let { rows } = await client.query(`SELECT * FROM task WHERE school=$1`, [sid]);
        return rows.map((v: any) => ({
            id: v.id,
            school: v.school,
            category: v.category,
            location: v.location,
            description: v.description,
            starting_date: v.starting_date.toISOString().substring(0, 10),
            ending_date: v.ending_date.toISOString().substring(0, 10),
            starting_time: v.starting_time.substring(0, 5),
            ending_time: v.ending_time.substring(0, 5),
            capacity: Number(v.capacity)
        }));
    } catch (error) {
        return null;
    }
}

export async function enrollUser(client: Client, sid: number, email: string): Promise<boolean> {
    try {
        await client.query(`INSERT INTO enrollment (school, email) VALUES ($1, $2)`, [sid, email.toLowerCase()]);
        return true;
    } catch (error) {
        return false;
    }
}

export async function kickMember(client: Client, sid: number, email: string): Promise<boolean> {
    try {
        await client.query(`DELETE FROM enrollment WHERE school=$1 AND email=$2`, [sid, email.toLowerCase()]);
        return true;
    } catch (error) {
        return false;
    }
}

export async function promoteMember(client: Client, sid: number, email: string): Promise<boolean> {
    try {
        await client.query(`UPDATE enrollment SET manager=true WHERE school=$1 AND email=$2`, [sid, email.toLowerCase()]);
        return true;
    } catch (error) {
        return false;
    }
}

export async function createTask(client: Client, sid: number, category: string, location: string, description: string, starting_date: string, ending_date: string, starting_time: string, ending_time: string, capacity: number): Promise<boolean> {
    try {
        if (dayjs(starting_date).isAfter(dayjs(ending_date))) throw null;
        if (dayjs(starting_date + " " + starting_time).isAfter(dayjs(starting_date + " " + ending_time))) throw null;

        await client.query(`INSERT INTO task(school, category, location, description, starting_date, ending_date, starting_time, ending_time, capacity) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`, [sid, category, location, description, starting_date, ending_date, starting_time, ending_time, capacity]);
        return true;
    } catch (error) {
        return false;
    }
}

export async function listCategories(client: Client, sid: number): Promise<string[]> {
    try {
        let { rows } = await client.query(`SELECT category FROM task WHERE school=$1`, [sid]);
        let ctg = Array.from(new Set(rows.map((v: any) => v.category)));

        return ctg as string[];
    } catch (error) {
        return null;
    }
}

export async function listSchoolAssignments(client: Client, sid: number): Promise<Assignment[]> {
    try {
        let { rows } = await client.query(`SELECT * FROM assignment WHERE school=$1`, [sid]);
        return rows as Assignment[];
    } catch (error) {
        return null;
    }
}

export async function listTaskAssignments(client: Client, tid: number): Promise<Assignment[]> {
    try {
        let { rows } = await client.query(`SELECT * FROM assignment WHERE task=$1`, [tid]);
        return rows as Assignment[];
    } catch (error) {
        return null;
    }
}

export async function assignMember(client: Client, tid: number, email: string, school: number): Promise<boolean> {
    try {
        await client.query(`INSERT INTO assignment (task, email, school) VALUES ($1, $2, $3)`, [tid, email.toLowerCase(), school]);

        return true;
    } catch (error) {
        return false;
    }
}

export async function registerMember(client: Client, tid: number, email: string, school: number, capacity: number, limit: number): Promise<boolean> {
    try {
        await client.query(`
        INSERT INTO assignment (task, email, school)
        SELECT $1, $2, $3
        WHERE (
            -- Check capacity
            (SELECT COUNT(*) FROM assignment WHERE task = $1) < $4
            AND
            -- Check if the user is already assigned to the same task
            (SELECT COUNT(*) FROM assignment WHERE task = $1 AND email = $2 AND school = $3) = 0
            AND
            -- Check the user's task limit
            (SELECT COUNT(*) FROM assignment WHERE email = $2 AND school = $3) < $5
        );
        `, [tid, email.toLowerCase(), school, capacity, limit]);

        // Double check if the user is assigned to the task
        let { rows } = await client.query(`SELECT * FROM assignment WHERE task=$1 AND email=$2 AND school=$3`, [tid, email.toLowerCase(), school]);
        if (rows.length === 0) throw null;

        return true;
    } catch (error) {
        return false;
    }
}

export async function removeMemberFromTask(client: Client, tid: number, email: string): Promise<boolean> {
    try {
        await client.query(`DELETE FROM assignment WHERE task=$1 AND email=$2`, [tid, email.toLowerCase()]);
        return true;
    } catch (error) {
        return false;
    }
}

export async function updateTask(client: Client, tid: number, category: string, location: string, description: string, starting_date: string, ending_date: string, starting_time: string, ending_time: string, capacity: number): Promise<boolean> {
    try {
        await client.query(`UPDATE task SET category=$1, location=$2, description=$3, starting_date=$4, ending_date=$5, starting_time=$6, ending_time=$7, capacity=$8 WHERE id=$9`, [category, location, description, starting_date, ending_date, starting_time, ending_time, capacity, tid]);
        return true;
    } catch (error) {
        return false;
    }
}

export async function deleteTask(client: Client, tid: number): Promise<boolean> {
    try {
        await client.query(`DELETE FROM task WHERE id=$1`, [tid]);
        return true;
    } catch (error) {
        return false;
    }
}

export async function listUserAssignments(client: Client, sid: number, email: string): Promise<Assignment[]> {
    try {
        let { rows } = await client.query(`SELECT * FROM assignment WHERE school=$1 AND email=$2`, [sid, email.toLowerCase()]);
        return rows as Assignment[];
    } catch (error) {
        return null;
    }
}

export async function clearTasks(client: Client, sid: number): Promise<boolean> {
    try {
        await client.query(`DELETE FROM task WHERE school=$1`, [sid]);
        return true;
    } catch (error) {
        return false;
    }
}

export async function clearMembers(client: Client, sid: number, owner: string): Promise<boolean> {
    try {
        await client.query(`DELETE FROM enrollment WHERE school=$1 AND NOT email=$2`, [sid, owner.toLowerCase()]);
        return true;
    } catch (error) {
        return false;
    }
}