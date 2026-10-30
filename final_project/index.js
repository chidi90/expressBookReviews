const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next) {
    // Check if the user has an active session and if authorization token exists
    if (req.session && req.session.authorization) {
        let token = req.session.authorization['accessToken']; // Grab the JWT token
        
        // Verify the token using the secret fingerprint key
        jwt.verify(token, "fingerprint_customer", (err, user) => {
            if (!err) {
                req.user = user; // Store user details in the request object
                next(); // Allow them to pass through to the protected route
            } else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
