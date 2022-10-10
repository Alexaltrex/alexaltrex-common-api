export interface IUser {
    id: string
    login: string
    email: string
    password: string
}

export interface IUsers {
    [key: string]: IUser
}

export type RegistrationType = Omit<IUser, "id">

export type LoginType = Omit<IUser, "login">
