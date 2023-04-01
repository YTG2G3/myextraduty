import { createConnection } from 'mysql2/promise';

const connectDB = async () => createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

/**
 * Retrieve account using email
 * @param email
 * @returns User
 */
export async function getUser(email: string) {
    try {
        let db = await connectDB();

        let [rows]: any = await db.execute(`SELECT * FROM user WHERE email=?`, [email]);
        if (rows.length === 0) return null;

        return rows[0];
    } catch (error) {
        return null;
    }
}

/**
 * Create new account
 * @param email 
 * @param name 
 * @param picture 
 * @param admin 
 * @returns {Promise<Boolean>}
 */
export async function createUser(email: string, name: string, picture: string, admin = false) {
    try {
        let db = await connectDB();

        await db.execute(`INSERT INTO user VALUES (?,?,?,?)`, [email, name, picture, admin]);

        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Change user name
 * @param email 
 * @param name 
 * @returns {Promise<Boolean>}
 */
export async function setUserName(email: string, name: string) {
    try {

    } catch (error) {
        return false;
    }
}