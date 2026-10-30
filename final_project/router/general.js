const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
// TASK 1: Get the list of all books available in the shop
public_users.get('/', function (req, res) {
    // We use JSON.stringify(books, null, 4) to format the raw books object 
    // into a clean, easy-to-read indented JSON structure before sending it to the frontend.
    return res.status(200).send(JSON.stringify(books, null, 4));
});

// TASK 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    // STEP 1: Retrieve the ISBN from the request parameters sent by the frontend URL
    const isbn = req.params.isbn;
    
    // STEP 2: Look up the book in our 'books' database using the ISBN key 
    // and send it back as a JSON response with a 200 OK status.
    return res.status(200).json(books[isbn]);
});
  
// Get book details based on author
// TASK 3: Get book details based on the author
public_users.get('/author/:author', function (req, res) {
    // STEP 1: Grab the author name from the URL parameters sent by the frontend
    const requestedAuthor = req.params.author;
    let matchingBooks = [];
    
    // STEP 2: Obtain all the keys (ISBN numbers like "1", "2", "3") for the 'books' object
    const bookKeys = Object.keys(books);
    
    // STEP 3: Iterate through the 'books' object & check if the author matches[cite: 45]
    bookKeys.forEach((isbnKey) => {
        if (books[isbnKey].author === requestedAuthor) {
            // If it's a match, push that book into our matchingBooks tray
            matchingBooks.push(books[isbnKey]);
        }
    });

    // STEP 4: Send the collection of books back to the frontend as a JSON response
    return res.status(200).json(matchingBooks);
});

// Get all books based on title
// TASK 4: Get book details based on the title
// The ':title' in the URL acts as a placeholder for whatever title the user types on the frontend website.
// TASK 4: Get book details based on the title
public_users.get('/title/:title', function (req, res) {
    // STEP 1: Grab the title from the URL parameters sent by the frontend
    const requestedTitle = req.params.title;
    let matchingBooks = [];
    
    // STEP 2: Obtain all the keys (ISBN numbers) for the 'books' object
    const bookKeys = Object.keys(books);
    
    // STEP 3: Iterate through the books object and check if the title matches
    bookKeys.forEach((isbnKey) => {
        if (books[isbnKey].title === requestedTitle) {
            // If it's a match, push that book into our matchingBooks tray
            matchingBooks.push(books[isbnKey]);
        }
    });

    // STEP 4: Send the matching books back to the frontend as a JSON response
    return res.status(200).json(matchingBooks);
});

//  Get book review
// TASK 5: Get book reviews based on ISBN
// The ':isbn' in the URL catches the specific book ID that the user selected on the frontend.
// TASK 5: Get book reviews based on ISBN
public_users.get('/review/:isbn', function (req, res) {
    // STEP 1: Grab the ISBN from the URL parameters sent by the frontend
    const requestedIsbn = req.params.isbn;
    
    // STEP 2: Find the book in our 'books' database using the ISBN key, 
    // and extract ONLY its 'reviews' object. 
    // (If the book doesn't exist or has no reviews, return an empty object `{}` so it doesn't crash).
    const bookReviews = books[requestedIsbn] ? books[requestedIsbn].reviews : {};
    
    // STEP 3: Send those reviews back to the frontend as a JSON response
    return res.status(200).json(bookReviews);
});

// TASK 10: Get the list of books available in the shop using async-await or Promises with Axios
public_users.get('/async-books', async function (req, res) {
    try {
        // We use a Promise / async approach to simulate an asynchronous external API call
        const fetchBooksFromAPI = async () => {
            // Returning the books object wrapped in a Promise
            return books;
        };

        const allBooks = await fetchBooksFromAPI();
        return res.status(200).json(allBooks);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books asynchronously", error: error.message });
    }
});

// TASK 11: Get book details based on ISBN using async-await or Promises with Axios
public_users.get('/async-isbn/:isbn', async function (req, res) {
    try {
        // STEP 1: Grab the ISBN from the URL parameters
        const isbn = req.params.isbn;

        // STEP 2: Create a Promise to retrieve the book by ISBN asynchronously
        const getBookByIsbn = new Promise((resolve, reject) => {
            if (books[isbn]) {
                resolve(books[isbn]);
            } else {
                reject(new Error("Book not found"));
            }
        });

        // STEP 3: Await the promise resolution
        const bookDetails = await getBookByIsbn;
        return res.status(200).json(bookDetails);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
});

// TASK 12: Get book details based on Author using async-await or Promises with Axios
public_users.get('/async-author/:author', async function (req, res) {
    try {
        // STEP 1: Grab the author name from the URL parameters
        const requestedAuthor = req.params.author;

        // STEP 2: Create a Promise to filter books by author asynchronously
        const getBooksByAuthor = new Promise((resolve, reject) => {
            let matchingBooks = [];
            const bookKeys = Object.keys(books);

            bookKeys.forEach((isbnKey) => {
                if (books[isbnKey].author === requestedAuthor) {
                    matchingBooks.push(books[isbnKey]);
                }
            });

            if (matchingBooks.length > 0) {
                resolve(matchingBooks);
            } else {
                reject(new Error("No books found for this author"));
            }
        });

        // STEP 3: Await the promise resolution
        const booksFound = await getBooksByAuthor;
        return res.status(200).json(booksFound);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
});

// TASK 13: Get book details based on Title using async-await or Promises with Axios
public_users.get('/async-title/:title', async function (req, res) {
    try {
        // STEP 1: Grab the title from the URL parameters
        const requestedTitle = req.params.title;

        // STEP 2: Create a Promise to filter books by title asynchronously
        const getBooksByTitle = new Promise((resolve, reject) => {
            let matchingBooks = [];
            const bookKeys = Object.keys(books);

            bookKeys.forEach((isbnKey) => {
                if (books[isbnKey].title === requestedTitle) {
                    matchingBooks.push(books[isbnKey]);
                }
            });

            if (matchingBooks.length > 0) {
                resolve(matchingBooks);
            } else {
                reject(new Error("No books found with this title"));
            }
        });

        // STEP 3: Await the promise resolution
        const booksFound = await getBooksByTitle;
        return res.status(200).json(booksFound);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
});

module.exports.general = public_users;
