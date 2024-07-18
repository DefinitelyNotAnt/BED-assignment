require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const sql = require("mssql");
const dbConfig = require("./dbConfig");
const jwt = require("jsonwebtoken");
const { name } = require('body-parser');
const bcrypt = require("bcrypt");
const usersController = require("./controllers/usersController");

const port = process.env.PORT || 3000; // Use environment variable or default port
const staticMiddleware = express.static("public");

app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(express.urlencoded());

app.use(staticMiddleware); // Mount the static middleware


let refreshTokens = [];

app.post("/users", usersController.createUser); // Create user
app.get("/users", usersController.getAllUsers); // Get all users
app.get("/users", usersController.getUserById); // Get user by ID
app.put("/users", usersController.updateUser); // Update user
app.delete("/users", usersController.deleteUser); // Delete user

app.post('/token', (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken == null){
        return res.sendStatus(401);
    }
    if (refreshTokens.includes(refreshToken)){
        return res.sendStatus(403);
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err){
            return res.sendStatus(403);
        }
        const accessToken = generateAccessToken({name: user.name});
        res.json({
            accessToken: accessToken
        })
    })
})
app.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token);
    res.sendStatus(204);
})
app.post('/login', usersController.loginUser);


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