import { createConnection } from 'mysql2/promise';
import { User, School, Enrollment } from './schema';

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
        let [rows] = await db.execute(`SELECT * FROM school`);

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

        console.log(sid);

        await db.execute(`INSERT INTO enrollment VALUES (1, ?, ?)`, [sid, owner]);

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