import { createContext } from "react";
import { School, User } from "./schema";

// TS Context
type AuthContext = {
    user: User,
    school: School
};

let SiteContext = createContext({} as AuthContext);

export default SiteContext;
