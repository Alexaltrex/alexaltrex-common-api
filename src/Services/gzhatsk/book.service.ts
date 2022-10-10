import {bookDB} from "../../db/gzhatsk/book/BookDB";
import {IBook} from "../../interfaces/gzhatsk/book.interface";

export const bookService = {
    //============= GET ALL ===============//
    getAll: (): IBook[] => {
        const items = bookDB.getAll();
        return items;
    },
}