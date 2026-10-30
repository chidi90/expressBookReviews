const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = []; // Temporary storage array for registered users

// Helper function to check if a username already exists in our array
const isValid = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    return userswithsamename.length > 0;
}

// TASK 6: Register a new user
regd_users.post("/register", (req, res) => {
    // STEP 1: Grab the username and password sent from the frontend request body
    const username = req.body.username;
    const password = req.body.password;

    // STEP 2: Error Check - Did the user leave username or password blank?
    if (!username || !password) {
        return res.status(400).json({ message: "Error: Username and password are required!" });
    }

    // STEP 3: Error Check - Does this username already exist?[cite: 46]
    if (isValid(username)) {
        return res.status(409).json({ message: "Error: User already exists!" });
    }

    // STEP 4: Success - Push the new user into our 'users' array database
    users.push({ "username": username, "password": password });

    // STEP 5: Send a success message back to the frontend
    return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// Helper function to check if the username and password match our database records
const authenticatedUser = (username, password) => {
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    return validusers.length > 0;
}

// TASK 7: Login as a registered user
regd_users.post("/login", (req, res) => {
    // STEP 1: Grab username and password from the frontend request body
    const username = req.body.username;
    const password = req.body.password;

    // STEP 2: Error Check - Did the user leave fields blank?
    if (!username || !password) {
        return res.status(400).json({ message: "Error logging in: Missing credentials" });
    }

    // STEP 3: Verify credentials against our database
    if (authenticatedUser(username, password)) {
        
        // STEP 4: GENERATE THE DIGITAL WRISTBAND (JWT Token)
        let accessToken = jwt.sign({
            data: password
        }, 'fingerprint_customer', { expiresIn: 60 * 60 }); // Token expires in 1 hour

        // STEP 5: Save the token and username inside the user's session
        req.session.authorization = {
            accessToken,
            username
        }

        // STEP 6: Send success response back to the frontend
        return res.status(200).json({ message: "User successfully logged in" });
    } else {
        return res.status(401).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
// TASK 8: Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    // STEP 1: Grab the ISBN from the URL parameters
    const isbn = req.params.isbn;
    
    // STEP 2: Grab the review text sent from the frontend via request query (?review=...)
    const review = req.query.review;
    
    // STEP 3: Grab the username directly from the user's active session (set during login)
    const username = req.session.authorization.username;

    // STEP 4: Error Check - Did the user forget to write review text in the query?
    if (!review) {
        return res.status(400).json({ message: "Error: Review content is required!" });
    }

    // STEP 5: Check if the book exists in our database
    if (books[isbn]) {
        // Access the reviews object of this specific book
        let bookReviews = books[isbn].reviews;
        
        // Add or update the review keyed by the logged-in username
        bookReviews[username] = review;
        
        // STEP 6: Send success response back to the frontend
        return res.status(200).json({ message: `Review successfully posted/modified for book ISBN ${isbn}` });
    } else {
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
    }
});

// TASK 9: Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    // STEP 1: Grab the ISBN from the URL parameters
    const isbn = req.params.isbn;
    
    // STEP 2: Grab the username directly from the user's active session
    const username = req.session.authorization.username;

    // STEP 3: Check if the book exists in our database
    if (books[isbn]) {
        let bookReviews = books[isbn].reviews;
        
        // STEP 4: Check if this user actually has a review written for this book
        if (bookReviews[username]) {
            // Delete only this user's review object property
            delete bookReviews[username];
            
            // STEP 5: Send success response back to the frontend
            return res.status(200).json({ message: `Review for book ISBN ${isbn} posted by user ${username} successfully deleted.` });
        } else {
            return res.status(404).json({ message: "No review found for this user on this book." });
        }
    } else {
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
