
export interface Permission {
    id: string;
    name: string;
    slug: string;
}

export interface Role {
    id: string;
    name: string;
    permissions: Permission[];
    _count?: {
        users: number;
    };
}
