const express = require("./node_modules/express");
const usersController = require("./controllers/usersController");
const sql = require("./node_modules/mssql"); 
const dbConfig = require("./dbConfig");
const bodyParser = require("./node_modules/body-parser");

const app = express();
const port = process.env.PORT || 3000; // Use environment variable or default port

const staticMiddleware = express.static("public");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname));
app.use(express.urlencoded());

app.use(staticMiddleware); // Mount the static middleware

// app.get("/users/login", usersController.loginUser); // Login user
app.post("/users", usersController.createUser); // Create user
app.get("/users", usersController.getAllUsers); // Get all users
app.get("/users", usersController.getUserById); // Get user by ID
app.put("/users", usersController.updateUser); // Update user
app.delete("/users", usersController.deleteUser); // Delete user
// app.get("/users/search", usersController.searchUsers); // Search user




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