const sql = require("mssql");
const database = require("../database");


class Place 
{
  constructor(id, name, description, operatinghours, address)
  {
    this.id = id;
    this.name = name;
    this.description = description;
    this.operatinghours = operatinghours;
    this.address = address;
  }
  //getAllPlaces: This method retrieves all places records from the "Place" table using a SELECT * query. It establishes a connection, executes the query, parses the results, and returns an array of Book objects constructed from the retrieved data. Finally, it closes the connection.
  static async getAllPlaces() 
  {
    const connection = await sql.connect(database);

    const sqlQuery = `SELECT * FROM Places`; // Replace with your actual table name

    const request = connection.request();
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset.map
    (
      (row) => new Place(row.id, row.name, row.description, row.operatinghours, row.address)
    ); // Convert rows to Book objects
  }
  //getBookById: This method retrieves a specific book by its ID using a parameterized query to prevent SQL injection vulnerabilities. It takes an id parameter, connects to the database, executes the query with the provided ID, and returns either a Book object if found or null if not found. It also closes the connection upon completion.
  static async getPlaceById(id) 
  {
    const connection = await sql.connect(database);

    const sqlQuery = `SELECT * FROM Places WHERE id = @id`; // Parameterized query

    const request = connection.request();
    request.input("id", id);
    const result = await request.query(sqlQuery);

    
    connection.close();

    return result.recordset[0]
      ? new Place
        (
          result.recordset[0].id,
          result.recordset[0].name,
          result.recordset[0].description,
          result.recordset[0].operatinghours,
          result.recordset[0].address
        )
      : null; // Handle book not found
  }

  //Generates a unique ID (finding the maximum existing ID and adding 1), creates a new Book object, pushes it to the books array, and returns the newly created book.
  static async createPlace(newPlaceData) 
  {
    const connection = await sql.connect(database);

    const sqlQuery = `INSERT INTO Places (name, description, operatinghours, address) VALUES (@name, @description, @operatinghours, @address); SELECT SCOPE_IDENTITY() AS id;`; // Retrieve ID of inserted record

    const request = connection.request();
    request.input("name", newPlaceData.name);
    request.input("description", newPlaceData.description);
    request.input("operatinghours", newPlaceData.operatinghours);
    request.input("address", newPlaceData.address)

    const result = await request.query(sqlQuery);

    connection.close();

    // Retrieve the newly created book using its ID
    return this.getPlaceById(result.recordset[0].id);
  }

  //Finds the book by ID, updates its properties with the provided newBookData, and returns the updated book object. If the book is not found, it returns null.
  static async updatePlace(id, newPlaceData)
  {
    const connection = await sql.connect(database);

    const sqlQuery = `UPDATE Places SET name = @name, description = @description, operatinghours = @operatinghours, address = @address WHERE id = @id`; // Parameterized query

    const request = connection.request();
    request.input("id", id);
    request.input("name", newPlaceData.name || null); // Handle optional fields
    request.input("description", newPlaceData.description || null);
    request.input("operatinghours", newPlaceData.operatinghours || null);
    request.input("address", newPlaceData.address || null);

    await request.query(sqlQuery);

    connection.close();

    return this.getPlaceById(id); // returning the updated book data
  }

  //Finds the book by ID, removes it from the books array using splice, and returns true for success or false if the book is not found.
  static async deletePlace(id) {
    const connection = await sql.connect(database);

    const sqlQuery = `DELETE FROM Places WHERE id = @id`; // Parameterized query

    const request = connection.request();
    request.input("id", id);
    const result = await request.query(sqlQuery);

    connection.close();

    return result.rowsAffected > 0; // Indicate success based on affected rows
  }

}


module.exports = Place;