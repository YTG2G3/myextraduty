import { Profile, School, Enrollment, Task, Member, Assignment, Attendant } from './schema';
import dayjs from 'dayjs';
import { Client } from 'pg';

const getClient = async () => {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });
    await client.connect();
    return client;
}

export async function getUser(email: string): Promise<Profile> {
    email = email.toLowerCase();
    let db = await getClient();
    try {
        let { rows } = await db.query(`SELECT * FROM profile WHERE email=$1`, [email]);
        if (rows.length === 0) throw null;

        await db.end();
        return rows[0];
    } catch (error) {
        await db.end();
        return null;
    }
}

export async function createUser(email: string, name: string, picture: string, admin = false): Promise<boolean> {
    email = email.toLowerCase();
    let db = await getClient();
    try {
        await db.query(`INSERT INTO profile VALUES ($1,$2,$3,$4)`, [email, name, picture, admin]);

        await db.end();
        return true;
    } catch (error) {
        await db.end();
        return false;
    }
}

export async function updateUserInfo(email: string, name: string, picture: string): Promise<boolean> {
    email = email.toLowerCase();
    let db = await getClient();
    try {
        await db.query(`UPDATE profile SET name=$1, picture=$2 WHERE email=$3`, [name, picture, email]);

        await db.end();
        return true;
    } catch (error) {
        await db.end();
        return false;
    }
}

export async function getSchool(sid: number): Promise<School> {
    let db = await getClient();
    try {
        let { rows } = await db.query(`SELECT * FROM school WHERE id=$1`, [sid]);
        if (rows.length === 0) throw null;

        let s: School = { ...rows[0], opening_at: rows[0].opening_at === "null" ? null : rows[0].opening_at };

        await db.end();
        return s;
    } catch (error) {
        await db.end();
        return null;
    }
}

export async function getEnrollments(email: string): Promise<Enrollment[]> {
    email = email.toLowerCase();
    let db = await getClient();
    try {
        let { rows } = await db.query(`SELECT * FROM enrollment WHERE email=$1`, [email]);

        await db.end();
        return rows as Enrollment[];
    } catch (error) {
        await db.end();
        return null;
    }
}

export async function listSchools(): Promise<School[]> {
    let db = await getClient();
    try {
        let { rows } = await db.query(`SELECT * FROM school`);
        rows = rows.map((v: School) => ({ ...v, opening_at: String(v.opening_at) }));

        await db.end();
        return rows as School[];
    } catch (error) {
        await db.end();
        return null;
    }
}

export async function createSchool(name: string, owner: string, address: string, primary_color: string, logo: string): Promise<boolean> {
    let db = await getClient();
    try {
        let { rows } = await db.query(`INSERT INTO school(name, owner, address, primary_color, logo) VALUES ($1, $2, $3, $4, $5) RETURNING id`, [name, owner, address, primary_color, logo]);
        let sid = rows[0].id;

        await db.query(`INSERT INTO enrollment VALUES ($1, $2, true)`, [sid, owner]);

        await db.end();
        return true;
    } catch (error) {
        await db.end();
        return false;
    }
}

export async function updateSchool(id: number, address: string, primary_color: string, logo: string, opening_at: string, quota: number, max_assigned: number): Promise<boolean> {
    let db = await getClient();
    try {
        await db.query(`UPDATE school SET address=$1, primary_color=$2, logo=$3, opening_at=$4, quota=$5, max_assigned=$6 WHERE id=$7`, [address, primary_color, logo, opening_at, quota, max_assigned, id]);

        await db.end();
        return true;
    } catch (error) {
        await db.end();
        return false;
    }
}

export async function deleteSchool(id: number): Promise<boolean> {
    let db = await getClient();
    try {
        await db.query(`DELETE FROM school WHERE id=$1`, [id]);

        await db.end();
        return true;
    } catch (error) {
        await db.end();
        return false;
    }
}

export async function listUsers(): Promise<Profile[]> {
    let db = await getClient();
    try {
        let { rows } = await db.query(`SELECT * FROM profile`);

        await db.end();
        return rows as Profile[];
    } catch (error) {
        await db.end();
        return null;
    }
}

export async function promoteUser(email: string): Promise<boolean> {
    email = email.toLowerCase();
    let db = await getClient();
    try {
        await db.query(`UPDATE profile SET admin=true WHERE email=$1`, [email]);

        await db.end();
        return true;
    } catch (error) {
        console.log(error);

        await db.end();
        return false;
    }
}

export async function removeUser(email: string): Promise<boolean> {
    email = email.toLowerCase();
    let db = await getClient();
    try {
        // Only removes non-admins
        await db.query(`DELETE FROM profile WHERE email=$1 AND admin=false`, [email]);

        await db.end();
        return true;
    } catch (error) {
        await db.end();
        return false;
    }
}

export async function transferSchoolOwnership(id: number, email: string): Promise<boolean> {
    email = email.toLowerCase();
    let db = await getClient();
    try {
        await db.query(`UPDATE school SET owner=$1 WHERE id=$2`, [email, id]);

        await db.end();
        return true;
    } catch (error) {
        await db.end();
        return false;
    }
}

export async function getTask(id: number): Promise<Task> {
    let db = await getClient();
    try {
        let { rows } = await db.query(`SELECT * FROM task WHERE id=$1`, [id]);
        let t: Task = {
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

        await db.end();
        return t;
    } catch (error) {
        await db.end();
        return null;
    }
}

export async function listTasks(id: number): Promise<Task[]> {
    let db = await getClient();
    try {
        let { rows } = await db.query(`SELECT * FROM task WHERE school=$1`, [id]);
        let tx: Task[] = rows.map((v: any) => ({
            id: v.id,
            school: v.school,
            category: v.category,
            location: v.location,
            description: v.description,
            starting_date: v.starting_date.toISOString().substring(0, 10), // TODO - convert this col into string
            ending_date: v.ending_date.toISOString().substring(0, 10),
            starting_time: v.starting_time.substring(0, 5),
            ending_time: v.ending_time.substring(0, 5),
            capacity: Number(v.capacity)
        }));

        await db.end();
        return tx;
    } catch (error) {
        await db.end();
        return null;
    }
}

export async function listMembers(id: number): Promise<Member[]> {
    let db = await getClient();
    try {
        let { rows } = await db.query(`SELECT * FROM enrollment WHERE school=$1`, [id]);

        let u: Member[] = [];
        for (let er of (rows as Enrollment[])) {
            let { rows: x } = await db.query(`SELECT * FROM profile WHERE email=$1`, [er.email]);
            u.push(x.length === 0 ? { admin: false, email: er.email, manager: false, name: "", picture: "" } : { ...x[0], manager: er.manager });
        }

        await db.end();
        return u as Member[];
    } catch (error) {
        await db.end();
        return null;
    }
}

export async function enrollUser(id: number, email: string): Promise<boolean> {
    email = email.toLowerCase();
    let db = await getClient();
    try {
        // Email format
        if (!email.trim().match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) throw null;

        // Already enrolled
        let er = await getEnrollments(email);
        if (er.find(v => v.school === id)) throw null;

        await db.query(`INSERT INTO enrollment (school, email) VALUES ($1, $2)`, [id, email]);

        await db.end();
        return true;
    } catch (error) {
        await db.end();
        return false;
    }
}

export async function kickMember(id: number, email: string): Promise<boolean> {
    email = email.toLowerCase();
    let db = await getClient();
    try {
        await db.query(`DELETE FROM enrollment WHERE school=$1 AND email=$2`, [id, email]);

        await db.end();
        return true;
    } catch (error) {
        await db.end();
        return false;
    }
}

export async function promoteMember(id: number, email: string): Promise<boolean> {
    email = email.toLowerCase();
    let db = await getClient();
    try {
        await db.query(`UPDATE enrollment SET manager=true WHERE school=$1 AND email=$2`, [id, email]);

        await db.end();
        return true;
    } catch (error) {
        await db.end();
        return false;
    }
}

export async function createTask(id: number, category: string, location: string, description: string, starting_date: string, ending_date: string, starting_time: string, ending_time: string, capacity: number): Promise<boolean> {
    let db = await getClient();
    try {
        if (dayjs(starting_date).isAfter(dayjs(ending_date))) throw null;
        if (dayjs(starting_date + " " + starting_time).isAfter(dayjs(starting_date + " " + ending_time))) throw null;

        await db.query(`INSERT INTO task(school, category, location, description, starting_date, ending_date, starting_time, ending_time, capacity) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`, [id, category, location, description, starting_date, ending_date, starting_time, ending_time, capacity]);

        await db.end();
        return true;
    } catch (error) {
        await db.end();
        return false;
    }
}

export async function listCategories(id: number): Promise<string[]> {
    let db = await getClient();
    try {
        let { rows } = await db.query(`SELECT category FROM task WHERE school=$1`, [id]);
        let ctg = Array.from(new Set(rows.map((v: any) => v.category)));

        await db.end();
        return ctg as string[];
    } catch (error) {
        await db.end();
        return null;
    }
}

export async function listAssignments(id: number): Promise<Assignment[]> {
    let db = await getClient();
    try {
        let { rows } = await db.query(`SELECT * FROM assignment WHERE school=$1`, [id]);

        await db.end();
        return rows as Assignment[];
    } catch (error) {
        await db.end();
        return null;
    }
}

export async function assignMember(id: number, email: string, school: number): Promise<boolean> {
    email = email.toLowerCase();
    let db = await getClient();
    try {
        await db.query(`INSERT INTO assignment(task, email, school) VALUES ($1, $2, $3)`, [id, email, school]);

        await db.end();
        return true;
    } catch (error) {
        await db.end();
        return false;
    }
}

export async function removeMemberFromTask(id: number, email: string): Promise<boolean> {
    email = email.toLowerCase();
    let db = await getClient();
    try {
        await db.query(`DELETE FROM assignment WHERE task=$1 AND email=$2`, [id, email]);

        await db.end();
        return true;
    } catch (error) {
        await db.end();
        return false;
    }
}

export async function updateTask(id: number, category: string, location: string, description: string, starting_date: string, ending_date: string, starting_time: string, ending_time: string, capacity: number): Promise<boolean> {
    let db = await getClient();
    try {
        await db.query(`UPDATE task SET category=$1, location=$2, description=$3, starting_date=$4, ending_date=$5, starting_time=$6, ending_time=$7, capacity=$8 WHERE id=$9`, [category, location, description, starting_date, ending_date, starting_time, ending_time, capacity, id]);

        await db.end();
        return true;
    } catch (error) {
        await db.end();
        return false;
    }
}

export async function listAttendants(id: number): Promise<Attendant[]> {
    let db = await getClient();
    try {
        let { rows }: { rows: Assignment[] } = await db.query(`SELECT * FROM assignment WHERE task=$1`, [id]);
        let r: Attendant[] = [];

        for (let x of rows) {
            let u = await getUser(x.email);
            r.push({ ...u, assigned_at: x.assigned_at });
        }

        await db.end();
        return r;
    } catch (error) {
        await db.end();
        return null;
    }
}

export async function deleteTask(id: number): Promise<boolean> {
    let db = await getClient();
    try {
        await db.query(`DELETE FROM task WHERE id=$1`, [id]);

        await db.end();
        return true;
    } catch (error) {
        await db.end();
        return false;
    }
}

export async function listUserAssignments(school: number, email: string): Promise<Assignment[]> {
    email = email.toLowerCase();
    let db = await getClient();
    try {
        let { rows } = await db.query(`SELECT * FROM assignment WHERE school=$1 AND email=$2`, [school, email]);

        await db.end();
        return rows as Assignment[];
    } catch (error) {
        await db.end();
        return null;
    }
}

export async function clearTasks(school: number): Promise<boolean> {
    let db = await getClient();
    try {
        await db.query(`DELETE FROM task WHERE school=$1`, [school]);

        await db.end();
        return true;
    } catch (error) {
        await db.end();
        return false;
    }
}

export async function clearMembers(school: number, owner: string): Promise<boolean> {
    owner = owner.toLowerCase();
    let db = await getClient();
    try {
        await db.query(`DELETE FROM enrollment WHERE school=$1 AND NOT email=$2`, [school, owner]);

        await db.end();
        return true;
    } catch (error) {
        await db.end();
        return false;
    }
}