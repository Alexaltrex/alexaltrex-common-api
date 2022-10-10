import {userMock} from "./userMock";
import {id} from "../../helpers/helpers";
import {IUser, IUsers, RegistrationType} from "../../interfaces/auth-sessions.types";


class UserDB {
    private _users: IUsers = userMock

    public add(user: RegistrationType): void { // user = {login, email, password}
        const key = id();
        this._users[key] = {
            id: key,
            ...user,
        };
    }

    public findByKeyAndValue(key: string, value: any): IUser | undefined {
        const users = [...Object.values(this._users)];
        // @ts-ignore
        return users.find(user => user[key] === value)
    }

}

export const userDB = new UserDB();
