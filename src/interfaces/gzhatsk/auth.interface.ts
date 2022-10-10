//======== User ========//
import {RoleType} from "../shop-interfaces";

export enum RoleEnum {
    user = "user",
    admin = "admin"
}

export interface IUsers {
    [key: string]: IUser
}

export interface IRegisterData {
    login: string
    email: string
    password: string
}

export interface ILoginData {
    email: string
    password: string
    userId: string
}

export interface IUser {
    id: string
    login: string
    email: string
    password: string
    role: RoleType
    nickName: string
    avatar: IAvatar | null
    isActivated: boolean
    activationLink: string
}

export interface IAvatar {
    small: string
    full: string
}

import {JwtPayload} from "jsonwebtoken";

export interface IDecodedData extends JwtPayload {
    userId: string
    role: string
    login: string
}
