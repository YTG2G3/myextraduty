import { createConnection } from 'mysql2/promise';
import { User, School, Enrollment, Task, Member, Assignment, Attendant } from './schema';
import dayjs from 'dayjs';

const connectDB = async () => createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    timezone: "+00:00"
});

export async function getUser(email: string): Promise<User> {
    let db = await connectDB();
    try {
        let [rows]: any[] = await db.execute(`SELECT * FROM user WHERE email=?`, [email]);
        if (rows.length === 0) return null;

        db.end();
        return rows[0];
    } catch (error) {
        db.end();
        return null;
    }
}

export async function createUser(email: string, name: string, picture: string, admin = false): Promise<boolean> {
    let db = await connectDB();
    try {
        await db.execute(`INSERT INTO user VALUES (?,?,?,?)`, [email, name, picture, admin]);

        db.end();
        return true;
    } catch (error) {
        db.end();
        return false;
    }
}

export async function updateUserInfo(email: string, name: string, picture: string): Promise<boolean> {
    let db = await connectDB();
    try {
        await db.execute(`UPDATE user SET name=?, picture=? WHERE email=?`, [name, picture, email]);

        db.end();
        return true;
    } catch (error) {
        db.end();
        return false;
    }
}

export async function getSchool(sid: number): Promise<School> {
    let db = await connectDB();
    try {
        let [rows]: any[] = await db.execute(`SELECT * FROM school WHERE id=?`, [sid]);
        if (rows.length === 0) return null;

        let s: School = { ...rows[0], opening_at: rows[0].opening_at === "null" ? null : rows[0].opening_at };

        db.end();
        return s;
    } catch (error) {
        console.log(error);

        db.end();
        return null;
    }
}

export async function getEnrollments(email: string): Promise<Enrollment[]> {
    let db = await connectDB();
    try {
        let [rows]: any[] = await db.execute(`SELECT * FROM enrollment WHERE user=?`, [email]);

        db.end();
        return rows as Enrollment[];
    } catch (error) {
        db.end();
        return null;
    }
}

export async function listSchools(): Promise<School[]> {
    let db = await connectDB();
    try {
        let [rows]: any[] = await db.execute(`SELECT * FROM school`);
        rows = rows.map((v: School) => ({ ...v, opening_at: String(v.opening_at) }));

        db.end();
        return rows as School[];
    } catch (error) {
        db.end();
        return null;
    }
}

export async function createSchool(name: string, owner: string, address: string, primary_color: string, logo: string): Promise<boolean> {
    let db = await connectDB();
    try {
        let [rows]: any[] = await db.execute(`INSERT INTO school(name, owner, address, primary_color, logo) VALUES (?, ?, ?, ?, ?) RETURNING id`, [name, owner, address, primary_color, logo]);
        let sid = rows[0].id;

        await db.execute(`INSERT INTO enrollment VALUES (?, ?, 1)`, [sid, owner]);

        db.end();
        return true;
    } catch (error) {
        db.end();
        return false;
    }
}

export async function updateSchool(id: number, address: string, primary_color: string, logo: string, opening_at: string, quota: number, max_assigned: number): Promise<boolean> {
    let db = await connectDB();
    try {
        await db.execute(`UPDATE school SET address=?, primary_color=?, logo=?, opening_at=?, quota=?, max_assigned=? WHERE id=?`, [address, primary_color, logo, opening_at, quota, max_assigned, id]);

        db.end();
        return true;
    } catch (error) {
        db.end();
        return false;
    }
}

export async function deleteSchool(id: number): Promise<boolean> {
    let db = await connectDB();
    try {
        await db.execute(`DELETE FROM school WHERE id=?`, [id]);

        db.end();
        return true;
    } catch (error) {
        db.end();
        return false;
    }
}

export async function listUsers(): Promise<User[]> {
    let db = await connectDB();
    try {
        let [rows] = await db.execute(`SELECT * FROM user`);

        db.end();
        return rows as User[];
    } catch (error) {
        db.end();
        return null;
    }
}

export async function promoteUser(email: string): Promise<boolean> {
    let db = await connectDB();
    try {
        await db.execute(`UPDATE user SET admin=1 WHERE email=?`, [email]);

        db.end();
        return true;
    } catch (error) {
        db.end();
        return false;
    }
}

export async function removeUser(email: string): Promise<boolean> {
    let db = await connectDB();
    try {
        // Only removes non-admins
        await db.execute(`DELETE FROM user WHERE email=? AND admin=0`, [email]);

        db.end();
        return true;
    } catch (error) {
        db.end();
        return false;
    }
}

export async function transferSchoolOwnership(id: number, email: string): Promise<boolean> {
    let db = await connectDB();
    try {
        await db.execute(`UPDATE school SET owner=? WHERE id=?`, [email, id]);

        db.end();
        return true;
    } catch (error) {
        db.end();
        return false;
    }
}

export async function getTask(id: number): Promise<Task> {
    let db = await connectDB();
    try {
        let [rows]: any[] = await db.execute(`SELECT * FROM task WHERE id=?`, [id]);

        let t: Task = {
            id: rows[0].id,
            school: Number(rows[0].school),
            category: rows[0].category,
            name: rows[0].name,
            description: rows[0].description,
            starting_date: dayjs(rows[0].starting_date).format("YYYY-MM-DD"),
            starting_time: rows[0].starting_time.substring(0, 5),
            ending_date: dayjs(rows[0].ending_date).format("YYYY-MM-DD"),
            ending_time: rows[0].ending_time.substring(0, 5),
            capacity: Number(rows[0].capacity)
        };

        db.end();
        return t;
    } catch (error) {
        db.end();
        return null;
    }
}

export async function listTasks(id: number): Promise<Task[]> {
    let db = await connectDB();
    try {
        let [rows]: any[] = await db.execute(`SELECT * FROM task WHERE school=?`, [id]);
        let tx: Task[] = rows.map((v: any) => ({
            id: v.id,
            school: v.school,
            category: v.category,
            name: v.name,
            description: v.description,
            starting_date: dayjs(v.starting_date).format("YYYY-MM-DD"),
            starting_time: v.starting_time.substring(0, 5),
            ending_date: dayjs(v.ending_date).format("YYYY-MM-DD"),
            ending_time: v.ending_time.substring(0, 5),
            capacity: Number(v.capacity)
        }));

        db.end();
        return tx;
    } catch (error) {
        db.end();
        return null;
    }
}

export async function listMembers(id: number): Promise<Member[]> {
    let db = await connectDB();
    try {
        let [rows]: any[] = await db.execute(`SELECT * FROM enrollment WHERE school=?`, [id]);

        let u: Member[] = [];
        for (let er of (rows as Enrollment[])) {
            let [x]: any[] = await db.execute(`SELECT * FROM user WHERE email=?`, [er.user]);
            u.push(x.length === 0 ? { admin: false, email: er.user, manager: false, name: "", picture: "" } : { ...x[0], manager: er.manager });
        }

        db.end();
        return u as Member[];
    } catch (error) {
        db.end();
        return null;
    }
}

export async function enrollUser(id: number, email: string): Promise<boolean> {
    let db = await connectDB();
    try {
        if (!email.trim().match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) throw null;

        await db.execute(`INSERT INTO enrollment (school, user) VALUES (?, ?)`, [id, email]);

        db.end();
        return true;
    } catch (error) {
        db.end();
        return false;
    }
}

export async function enrollUsers(id: number, emails: string[]): Promise<number> {
    let i = 0;

    for (let email of emails) {
        try {
            let r = await enrollUser(id, email);
            if (r) i++;
        } catch (error) {
            continue;
        }
    }

    return i;
}

export async function kickMember(id: number, email: string): Promise<boolean> {
    let db = await connectDB();
    try {
        await db.execute(`DELETE FROM enrollment WHERE school=? AND user=?`, [id, email]);

        db.end();
        return true;
    } catch (error) {
        db.end();
        return false;
    }
}

export async function promoteMember(id: number, email: string): Promise<boolean> {
    let db = await connectDB();
    try {
        await db.execute(`UPDATE enrollment SET manager=1 WHERE school=? AND user=?`, [id, email]);

        db.end();
        return true;
    } catch (error) {
        db.end();
        return false;
    }
}

export async function createTask(id: number, category: string, name: string, description: string, starting_date: string, starting_time: string, ending_date: string, ending_time: string, capacity: number): Promise<boolean> {
    let db = await connectDB();
    try {
        await db.execute(`INSERT INTO task(school, category, name, description, starting_date, starting_time, ending_date, ending_time, capacity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [id, category, name, description, starting_date, starting_time, ending_date, ending_time, capacity]);

        db.end();
        return true;
    } catch (error) {
        db.end();
        return false;
    }
}

export async function createTasks(id: number, tasks: Task[]): Promise<number> {
    let i = 0;

    for (let task of tasks) {
        try {
            let r = await createTask(id, task.category, task.name, task.description, task.starting_date, task.starting_time, task.ending_date, task.ending_time, task.capacity);
            if (r) i++;
        } catch (error) {
            continue;
        }
    }

    return i;
}

export async function listCategories(id: number): Promise<string[]> {
    let db = await connectDB();
    try {
        let [rows]: any[] = await db.execute(`SELECT category FROM task WHERE school=?`, [id]);
        let ctg = Array.from(new Set(rows.map((v: any) => v.category)));

        db.end();
        return ctg as string[];
    } catch (error) {
        db.end();
        return null;
    }
}

export async function listAssignments(id: number): Promise<Assignment[]> {
    let db = await connectDB();
    try {
        let [rows]: any[] = await db.execute(`SELECT * FROM assignment WHERE school=?`, [id]);

        db.end();
        return rows as Assignment[];
    } catch (error) {
        db.end();
        return null;
    }
}

export async function assignMember(id: number, email: string, school: number): Promise<boolean> {
    let db = await connectDB();
    try {
        await db.execute(`INSERT INTO assignment(task, user, school) VALUES (?, ?, ?)`, [id, email, school]);

        db.end();
        return true;
    } catch (error) {
        db.end();
        return false;
    }
}

export async function removeMemberFromTask(id: number, email: string): Promise<boolean> {
    let db = await connectDB();
    try {
        await db.execute(`DELETE FROM assignment WHERE task=? AND user=?`, [id, email]);

        db.end();
        return true;
    } catch (error) {
        db.end();
        return false;
    }
}

export async function updateTask(id: number, category: string, name: string, description: string, starting_date: string, starting_time: string, ending_date: string, ending_time: string, capacity: number): Promise<boolean> {
    let db = await connectDB();
    try {
        await db.execute(`UPDATE task SET category=?, name=?, description=?, starting_date=?, starting_time=?, ending_date=?, ending_time=?, capacity=? WHERE id=?`, [category, name, description, starting_date, starting_time, ending_date, ending_time, capacity, id]);

        db.end();
        return true;
    } catch (error) {
        db.end();
        return false;
    }
}

export async function listAttendants(id: number): Promise<Attendant[]> {
    let db = await connectDB();
    try {
        let [rows]: any[] = await db.execute(`SELECT * FROM assignment WHERE task=?`, [id]);
        let r: Attendant[] = [];

        for (let x of rows) {
            let u = await getUser(x.user);
            r.push({ user: u, assigned_at: x.assigned_at });
        }

        db.end();
        return r;
    } catch (error) {
        db.end();
        return null;
    }
}

export async function deleteTask(id: number): Promise<boolean> {
    let db = await connectDB();
    try {
        await db.execute(`DELETE FROM task WHERE id=?`, [id]);

        db.end();
        return true;
    } catch (error) {
        db.end();
        return false;
    }
}

export async function listUserAssignments(school: number, user: string): Promise<Assignment[]> {
    let db = await connectDB();
    try {
        let [rows]: any[] = await db.execute(`SELECT * FROM assignment WHERE school=? AND user=?`, [school, user]);

        db.end();
        return rows as Assignment[];
    } catch (error) {
        db.end();
        return null;
    }
}