export type User = {
    email: string,
    name: string,
    picture: string,
    admin: boolean
};

export type School = {
    id: number,
    owner: string,
    name: string,
    address: string,
    logo: string,
    primary_color: string,
    opening_at: Date,
    quota: number,
    max_assigned: number
};

export type Enrollment = {
    school: number,
    user: string,
    manager: boolean
}