export type User = {
    email: string,
    name: string,
    picture: string,
    is_admin: boolean
};

export type School = {
    id: number,
    owner: string,
    domain: string,
    name: string,
    address: string,
    opening_at: Date,
    primary_color: string,
    quota: number,
    max_assigned: number
};

export type Enrollment = {
    school: number,
    user: string,
    is_manager: boolean
}