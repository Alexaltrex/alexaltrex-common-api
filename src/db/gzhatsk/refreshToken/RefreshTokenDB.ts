export interface IToken {
    userId: string
    refreshToken: string
}

export interface ITokens {
    [key: string]: IToken
}

class RefreshTokenDB {
    private _tokens: ITokens = {}

    public save(userId: string, refreshToken: string): IToken {
        const token = { userId, refreshToken }
        this._tokens[userId] = token;
        return token;
    }

    public delete(userId: string): void {
        delete this._tokens[userId]
    }

    public getById(id: string): IToken {
        return this._tokens[id]
    }

    // test
    public getAll(): IToken[] {
        return Object.values(this._tokens);
    }
}

export const refreshTokenDB = new RefreshTokenDB();