import {IBook, IBooks} from "../../../interfaces/gzhatsk/book.interface";
import {bookMock} from "./bookMock";

class BookDB {
    private _books: IBooks = bookMock

    public getById(id: string): IBook {
        return this._books[id]
    }

    public getAll(): IBook[] {
        return Object.values(this._books)
    }
}
export const bookDB = new BookDB();