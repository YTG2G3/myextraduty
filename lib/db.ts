import { createConnection } from 'mysql2/promise';
import { User, School, Enrollment } from './schema';

const connectDB = async () => createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

export async function getUser(email: string): Promise<User> {
    try {
        let db = await connectDB();

        let [rows]: any = await db.execute(`SELECT * FROM user WHERE email=?`, [email]);
        if (rows.length === 0) return null;

        return rows[0];
    } catch (error) {
        return null;
    }
}

export async function createUser(email: string, name: string, picture: string, admin = false): Promise<boolean> {
    try {
        let db = await connectDB();

        await db.execute(`INSERT INTO user VALUES (?,?,?,?)`, [email, name, picture, admin]);

        return true;
    } catch (error) {
        return false;
    }
}

export async function updateUserInfo(email: string, name: string, picture: string, admin = false): Promise<boolean> {
    try {
        let db = await connectDB();

        await db.execute(`UPDATE user SET name=? picture=? admin=? WHERE email=?`, [name, picture, admin, email]);

        return true;
    } catch (error) {
        return false;
    }
}

export async function getSchool(sid: number): Promise<School> {
    try {
        let db = await connectDB();

        let [rows]: any = await db.execute(`SELECT * FROM school WHERE id=?`, [sid]);
        if (rows.length === 0) return null;

        return rows[0];
    } catch (error) {
        return null;
    }
}

export async function getEnrollments(email: string): Promise<Enrollment[]> {
    try {
        let db = await connectDB();

        let [rows] = await db.execute(`SELECT * FROM enrollment WHERE user=?`, [email]);

        return rows as Enrollment[];
    } catch (error) {
        return null;
    }
}