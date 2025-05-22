export type RegisterTypes = {
    name: string;
    email: string;
    password: string;
};

export type LoginTypes = {
    email: string;
    password: string;
};


export type authAPITypes = {
    register: (data: RegisterTypes) => Promise<any>
    login: (data: LoginTypes) => Promise<any>
};