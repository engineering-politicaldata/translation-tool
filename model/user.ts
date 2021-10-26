export type UserLoginInput = {
    email: string;
    password: string;
};

export type CreateAdminInput = {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    projectIds?: string[];
};

export type AssginProjectsToAdminInput = {
    adminEmail: string;
    projectIds: string[];
};

export type User = {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
};
