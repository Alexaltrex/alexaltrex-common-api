import {id} from "../../../helpers/helpers";
import {IAvatar, IUser, IUsers, RoleEnum} from "../../../interfaces/gzhatsk/auth.interface";
import {userMock} from "./userMock";

interface IAddUser {
    login: string
    email: string
    password: string
    activationLink: string
}

class UserDB {
    private _users: IUsers = userMock

    public add(user: IAddUser): void { // user = {login, email, password, activationLink}
        const key = id();
        this._users[key] = {
            ...user,
            id: key,
            role: RoleEnum.user, // при регистрации доступна только эта роль
            nickName: '',
            avatar: null,
            isActivated: false,
        };
    }

    public findByKeyAndValue(key: string, value: any): IUser | undefined {
        const users = [...Object.values(this._users)];
        // @ts-ignore
        return users.find(user => user[key] === value)
    }

    public changePassword(userId: string, newPassword: string): void {
        this._users[userId].password = newPassword;
    }

    public changeNickname(userId: string, nickName: string) {
        this._users[userId].nickName = nickName;
    }

    public getNickname(userId: string): string {
        return this._users[userId].nickName;
    }

    public getAvatar(userId: string): null | IAvatar {
        return this._users[userId].avatar;
    }

    public setAvatar(userId: string, path: string): void {
        this._users[userId].avatar = {
            small: path,
            full: path,
        }
    }

    public activateUser(userId: string): void {
        this._users[userId].isActivated = true;
    }

    public getAll(): IUser[] {
        return Object.values(this._users)
    }

    public getById(id: string): IUser {
        return this._users[id];
    }

}

export const userDB = new UserDB();