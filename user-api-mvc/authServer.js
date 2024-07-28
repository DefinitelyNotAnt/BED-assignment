require('dotenv').config();

// Basic items
const express = require("express");
const bodyParser = require("body-parser");
const { name } = require('body-parser');
const sql = require("mssql");
const cookieParser = require('cookie-parser');


 // Dbconfig
 // Change to self config using the SQL in seed.sql
const dbConfig = require("./dbConfig");


// Controllers
const usersController = require("./controllers/usersController");
const profilesController = require("./controllers/userProfileController");
const placesController = require("./controllers/placesController");
const eventsController = require("./controllers/eventsController");


// Middlewares
const validatePlaces = require("./middlewares/validatePlaces");
const validateUsers = require("./middlewares/validateUser");
const validateEvent = require("./middlewares/validateEvent");


const port = process.env.PORT || 3000; // Use environment variable or default port
const app = express();
const staticMiddleware = express.static("public");


app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(express.urlencoded());
app.use(cookieParser());

app.use(staticMiddleware); // Mount the static middleware


let refreshTokens = [];

// Users routes
app.post("/users", validateUsers.validateCreateUser, usersController.createUser); // Create user
app.get("/users", usersController.getAllUsers); // Get all users
app.get("/users/id", usersController.getUserById); // Get user by ID
app.post("/profiles", profilesController.createProfile); // Create user
app.get("/profiles", profilesController.getProfileById); // Get user profile by ID
app.put("/profiles", profilesController.updateProfile); // Update user
app.put("/users", validateUsers.validateCreateUser, usersController.updateUser); // Update user
app.delete("/users", usersController.deleteUser); // Delete user
app.post("/users/forgot", usersController.searchUsers); // Search email for user to reset password

// Places routes
app.get("/places", placesController.getAllPlaces);
app.get("/places/:id", placesController.getPlaceById);//places/:id: This route with a dynamic parameter :id maps to the getBookById function. The controller function will extract the ID from the request parameters and use it to retrieve the corresponding book record.

app.post("/places", validatePlaces, placesController.createPlace); // POST for creating books (can handle JSON data)
app.put("/places/:id", validatePlaces, placesController.updatePlace); // Add validateBook before updateBook
app.delete("/places/:id", placesController.deletePlace); // DELETE for deleting books and defines a route that can handle DELETE request


// Events routes
// Routes for GET requests (replace with appropriate routes for update and delete later)
app.get("/events", eventsController.getAllEvents);
app.get("/events/:id", eventsController.getEventById);
app.post("/events", validateEvent, eventsController.createEvent); // POST for creating events (can handle JSON data)
app.put("/events/:id", eventsController.updateEvent); // PUT for updating events
app.delete("/events/:id", eventsController.deleteEvent); // DELETE for deleting events



// app.post('/token', (req, res) => {
//     const refreshToken = req.body.token;
//     if (refreshToken == null){
//         return res.sendStatus(401);
//     }
//     if (refreshTokens.includes(refreshToken)){
//         return res.sendStatus(403);
//     }
//     jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
//         if (err){
//             return res.sendStatus(403);
//         }
//         const accessToken = generateAccessToken({name: user.name});
//         res.json({
//             accessToken: accessToken
//         })
//     })
// })
app.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token);
    res.sendStatus(204);
    res.clearCookie('jwt');
})
app.post('/login', validateUsers.validateUser, usersController.loginUser);


app.listen(port, async () => {
    try {
      // Connect to the database
      await sql.connect(dbConfig);
      console.log("Database connection established successfully");
    } catch (err) {
      console.error("Database connection error:", err);
      // Terminate the application with an error code (optional)
      process.exit(1); // Exit with code 1 indicating an error
    }
  
    console.log(`Server listening on port ${port}`);
  });
  
  // Close the connection pool on SIGINT signal
  process.on("SIGINT", async () => {
    console.log("Server is gracefully shutting down");
    // Perform cleanup tasks (e.g., close database connections)
    await sql.close();
    console.log("Database connection closed");
    process.exit(0); // Exit with code 0 indicating successful shutdown
  });