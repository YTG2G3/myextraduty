import { createContext } from "react";
import { Enrollment, School, User } from "./schema";

// TS Context
type AuthContext = {
    user: User,
    school: School,
    enrollments: Enrollment[]
};

let SiteContext = createContext({} as AuthContext);

export default SiteContext;
