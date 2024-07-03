Library Management System
This Library Management System allows users to borrow and return books, and allows librarians to add new books to the library and update existing book details. The system is built using Node.js, Express, and MongoDB.

Table of Contents
                        -Features
                        -Installation
                        -Usage
                        -API Endpoints
                        -Authentication and Authorization
                        -Contributing

Features
User Authentication: Secure user authentication using JSON Web Tokens (JWT).
Role-Based Access Control: Different roles (librarian, user) with specific permissions.
Book Management: Librarians can add new books and update existing book details.
Borrowing and Returning Books: Users can borrow available books and return borrowed books.
Book Availability: Track book quantities to ensure availability.


Installation
Clone the repository:
git clone https://github.com/yourusername/library-management-system.git

Navigate to the project directory:
cd library-management-system
Install dependencies:
npm install

Create a .env file in the root directory and add the following environment variables:
env
PORT=3000
MONGO_URI=mongodb://localhost:27017/library
JWT_SECRET=your_jwt_secret


Usage
Start the server:
npm start
The server will be running at http://localhost:5000.


API Endpoints
Auth
POST /users/signup: Register a new user
POST /users/login: Login a user

Books
POST /books: Add a new book (Librarian only)
PUT /books/:bookId
: Update a book's details (Librarian only)
POST /books/borrow/:bookId
: Borrow a book (Authenticated users)
POST /books/return/:bookId
: Return a borrowed book (Authenticated users)
Authentication and Authorization
Authentication: Implemented using JSON Web Tokens (JWT).
Authorization: Role-based access control to restrict certain actions to librarians only.

Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
