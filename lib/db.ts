import { createConnection } from 'mysql2/promise';
import { User, School, Enrollment, Task, Member, Assignment } from './schema';

const connectDB = async () => createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

export async function getUser(email: string): Promise<User> {
    let db = await connectDB();
    try {
        let [rows]: any = await db.execute(`SELECT * FROM user WHERE email=?`, [email]);
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
        let [rows]: any = await db.execute(`SELECT * FROM school WHERE id=?`, [sid]);
        if (rows.length === 0) return null;
        rows[0] = { ...rows[0], opening_at: String(rows[0].opening_at) };

        db.end();
        return rows[0];
    } catch (error) {
        db.end();
        return null;
    }
}

export async function getEnrollments(email: string): Promise<Enrollment[]> {
    let db = await connectDB();
    try {
        let [rows] = await db.execute(`SELECT * FROM enrollment WHERE user=?`, [email]);

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
        let [rows]: any = await db.execute(`INSERT INTO school(name, owner, address, primary_color, logo) VALUES (?, ?, ?, ?, ?) RETURNING id`, [name, owner, address, primary_color, logo]);
        let sid = rows[0].id;

        await db.execute(`INSERT INTO enrollment VALUES (?, ?, 1)`, [sid, owner]);

        db.end();
        return true;
    } catch (error) {
        db.end();
        return false;
    }
}

export async function updateSchool(id: number, address: string, primary_color: string, logo: string, opening_at: Date, quota: number): Promise<boolean> {
    let db = await connectDB();
    try {
        await db.execute(`UPDATE school SET address=?, primary_color=?, logo=?, opening_at=?, quota=? WHERE id=?`, [address, primary_color, logo, opening_at, quota, id]);

        db.end();
        return true;
    } catch (error) {
        console.log(error);

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

export async function listTasks(id: number): Promise<Task[]> {
    let db = await connectDB();
    try {
        let [rows]: any[] = await db.execute(`SELECT * FROM task WHERE school=?`, [id]);

        db.end();
        return rows as Task[];
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
        await db.execute(`INSERT INTO enrollment (school, user) VALUES (?, ?)`, [id, email]);

        db.end();
        return true;
    } catch (error) {
        db.end();
        return false;
    }
}

export async function enrollUsers(id: number, emails: string[]): Promise<number> {
    let db = await connectDB();
    let i = 0;

    for (let email of emails) {
        try {
            let r = await enrollUser(id, email);
            if (r) i++;
        } catch (error) {
            continue;
        }
    }

    db.end();
    return i;
}

export async function getAssignedTasks(id: number, email: string): Promise<Task[]> {
    let db = await connectDB();
    try {
        // TODO - optimize this part by saving school
        let [rows]: any[] = await db.execute(`SELECT * FROM assignment WHERE user=?`, [email]);

        let t: Task[] = [];
        for (let a of (rows as Assignment[])) {
            let [x]: any[] = await db.execute(`SELECT * FROM task WHERE id=? AND school=?`, [a.task, id]);
            if (x.length !== 0) t.push(x[0]);
        }

        db.end();
        return t;
    } catch (error) {
        console.log(error);

        db.end();
        return null;
    }
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
        console.log(id, email);

        await db.execute(`UPDATE enrollment SET manager=1 WHERE school=? AND user=?`, [id, email]);

        db.end();
        return true;
    } catch (error) {
        db.end();
        return false;
    }
}