import { createConnection } from 'mysql2/promise';
import { Session } from 'next-auth';

const connectDB = async () => createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

export type User = {
    email: string,
    name: string,
    picture: string,
    is_admin: boolean
} | null;

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

        await db.execute(`UPDATE user SET name = ? picture = ? admin = ? WHERE email = ?`, [name, picture, admin, email]);

        return true;
    } catch (error) {
        return false;
    }
}