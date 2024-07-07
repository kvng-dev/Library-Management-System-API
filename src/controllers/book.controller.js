const Book = require("../model/book.model");
const User = require("../model/user.model");

const createBook = async (req, res, next) => {
  try {
    const { title } = req.body;
    const bookTitle = await Book.findOne({ title });

    if (bookTitle) {
      return res.status(409).json({
        status: "error",
        message: `Book with title ${title} already exists!`,
      });
    }

    const newBook = new Book({
      title,
      author: req.body.author,
      genre: req.body.genre,
      quantity: req.body.quantity,
      available: req.body.available,
      createdBy: req.user._id,
    });

    const book = await Book.create(newBook);

    return res.status(201).json({
      status: "success",
      message: "Book created",
      data: book,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

const getAllBooks = async (req, res, next) => {
  try {
    const { title, genre, author } = req.query;
    const filter = {};

    if (title) {
      filter.title = new RegExp(title, "i");
    }

    if (author) {
      filter.author = new RegExp(title, "i");
    }

    if (genre) {
      filter.genre = genre;
    }

    const books = await Book.find(filter);

    return res.status(200).json({
      status: "success",
      count: books.length,
      message: "Fetched Books successfully",
      data: books,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

const findBookById = async (req, res, next) => {
  try {
    const { bookId } = req.params;

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(400).json({
        status: "error",
        message: `Book with ID: ${bookId} does not exist`,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Book Found",
      data: book,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

const updateBookById = async (req, res, next) => {
  try {
    const { bookId } = req.params;

    const findBook = await Book.findByIdAndUpdate(bookId, req.body, {
      new: true,
    });

    if (!findBook) {
      return res.status(404).json({
        status: "error",
        message: `Book with given id ${bookId} was not found`,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Book updated successfully",
      data: findBook,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

const deleteBookById = async (req, res, next) => {
  try {
    const { bookId } = req.params;

    const foundBook = await Book.findByIdAndDelete(bookId);

    if (!foundBook) {
      return res.status(404).json({
        status: "error",
        message: `Book with given id ${bookId} was not found`,
      });
    }
    return res.status(200).json({
      status: "success",
      message: "Book deleted successfully",
      data: foundBook,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

const borrowBook = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const userId = req.user._id;

    const book = await Book.findById(bookId);

    if (!book || book.quantity <= 0) {
      return res.status(400).json({
        status: "error",
        message: "Book not available",
      });
    }

    if (!book.available) {
      return res.status(400).json({
        status: "error",
        message: `Book with Title: ${book.title} is not available for borrowing`,
      });
    }

    const user = await User.findById(userId);
    user.borrowedBooks.push({ bookId: book, title: book.title });

    book.quantity -= 1;
    book.available = book.quantity > 0;
    await user.save();
    await book.save();

    res.status(200).json({
      status: "success",
      message: "Book borrowed successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

const returnBook = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);
    const bookIndex = user.borrowedBooks.findIndex(
      (borrow) => borrow.bookId.toString() === bookId
    );
    if (bookIndex === -1) {
      return res.status(400).json({
        status: "error",
        message: "Book was not borrowed by user",
      });
    }
    user.borrowedBooks.splice(bookIndex, 1);

    const book = await Book.findById(bookId);
    book.quantity += 1;
    book.available = book.quantity > 0;
    await user.save();
    await book.save();

    res.status(200).json({
      status: "success",
      message: "Book returned successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

module.exports = {
  createBook,
  updateBookById,
  deleteBookById,
  findBookById,
  getAllBooks,
  borrowBook,
  returnBook,
};
