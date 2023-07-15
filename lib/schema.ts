export type User = {
    email: string,
    name: string,
    picture: string,
    admin: boolean
};

export type Member = User & {
    manager: boolean
}

export type School = {
    id: number,
    owner: string,
    name: string,
    address: string,
    logo: string,
    primary_color: string,
    opening_at: string,
    quota: number,
    max_assigned: number
};

export type Enrollment = {
    school: number,
    user: string,
    manager: boolean
}

export type Task = {
    id: number,
    school: number,
    category: string,
    name: string,
    description: string,
    starting_date: string,
    ending_date: string,
    starting_time: string,
    ending_time: string,
    capacity: number
}

export type Assignment = {
    school: number,
    user: string,
    task: number,
    assigned_at: string
}

export type Attendant = {
    user: User,
    assigned_at: string
}