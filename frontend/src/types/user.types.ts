export interface UserRole {
    name: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: string;
    createdAt: string;
}
