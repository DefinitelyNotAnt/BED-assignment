const express = require("express");
const placesController = require("./controllers/placesController");
const sql = require("mssql"); // Assuming you've installed mssql
const database = require("./database");
const bodyParser = require("body-parser"); // Import body-parser
const validatePlaces = require("./middlewares/validatePlaces");


const app = express();
const port = process.env.PORT || 3000;

const staticMiddleware = express.static("public"); //path to the public folder

// Include body-parser middleware to handle JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // For form data handling

app.use(staticMiddleware);

app.get("/places", placesController.getAllPlaces);
app.get("/places/:id", placesController.getPlaceById);//places/:id: This route with a dynamic parameter :id maps to the getBookById function. The controller function will extract the ID from the request parameters and use it to retrieve the corresponding book record.

app.post("/places", validatePlaces, placesController.createPlace); // POST for creating books (can handle JSON data)
app.put("/places/:id", validatePlaces, placesController.updatePlace); // Add validateBook before updateBook
app.delete("/places/:id", placesController.deletePlace); // DELETE for deleting books and defines a route that can handle DELETE request

app.listen(port, async () => 
{
    try 
    {
        // Connect to the database
       await sql.connect(database);
       console.log("Database connection established successfully");
    } 
    catch (err) 
    {
       console.error("Database connection error:", err);
        // Terminate the application with an error code (optional)
       process.exit(1); // Exit with code 1 indicating an error
    }
    
    console.log(`Server listening on port ${port}`);
});

// Close the connection pool on SIGINT signal
process.on("SIGINT", async () => 
{
    console.log("Server is gracefully shutting down");
    // Perform cleanup tasks (e.g., close database connections)
    await sql.close();
    console.log("Database connection closed");
    process.exit(0); // Exit with code 0 indicating successful shutdown
});
    