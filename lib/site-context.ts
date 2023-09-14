import { createContext } from "react";
import { Enrollment, School, Profile } from "./schema";

// TS Context
type AuthContext = {
    user: Profile,
    school: School,
    enrollments: Enrollment[]
};

let SiteContext = createContext({} as AuthContext);

export default SiteContext;
