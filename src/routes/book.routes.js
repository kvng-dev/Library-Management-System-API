const Router = require("express").Router;
const {
  createBook,
  updateBookById,
  deleteBookById,
  getAllBooks,
  borrowBook,
  returnBook,
  findBookById,
} = require("../controllers/book.controller");
const { auth, librarianAuth } = require("../middleware/auth.middleware");

const bookRouter = Router();

bookRouter.post("/", auth, librarianAuth, createBook);
bookRouter.get("/", getAllBooks);
bookRouter.get("/:bookId", auth, findBookById);
bookRouter.put("/:bookId", auth, librarianAuth, updateBookById);
bookRouter.delete("/:bookId", auth, librarianAuth, deleteBookById);
bookRouter.post("/borrow/:bookId", auth, borrowBook);
bookRouter.post("/return/:bookId", auth, returnBook);

module.exports = bookRouter;
