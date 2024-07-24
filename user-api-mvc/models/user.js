// =================================================
// ============== Requires for DB ==================
// =================================================

const sql = require("mssql");
const dbConfig = require("../dbConfig");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



// ================================================
// ================  User Class ===================
// ================================================

class User {
  // Constructor
  constructor(userId,loginName, password, email, access) {
    this.userId = userId;
    this.loginName = loginName;
    this.password = password;
    this.email = email;
    this.access = access;
  }


  // Get All Users
  static async getAllUsers() {
    // Connect to DB
    const connection = await sql.connect(dbConfig);
    // Get all Users
    const sqlQuery = `SELECT * FROM Users`; 
    // Send request
    const request = connection.request();
    // Get result
    const result = await request.query(sqlQuery);
    // Close connection
    connection.close();
    // Returns every User in a map
    return result.recordset.map(
      (row) => new User(row.UserID, row.LoginName, row.PasswordHash, row.Email, row.Access)
    ); // Convert rows to User objects
  }

  // Get specific user by Id
  static async getUserById(id) {
    // Connect to DB
    const connection = await sql.connect(dbConfig);
    // Select the User with the id as id is unique
    const sqlQuery = `SELECT * FROM Users WHERE UserID = @id`; // Parameterized query
    // Send request
    const request = connection.request();
    request.input("id", id);
    // Get result
    const result = await request.query(sqlQuery);
    // Close connection
    connection.close();
    // Returns User Data
    return result.recordset[0]
      ? new User(
          result.recordset[0].UserID,
          result.recordset[0].LoginName,
          result.recordset[0].PasswordHash,
          result.recordset[0].Email
        )
      : null; // Handle user not found
  }
  // Update User
  static async updateUser(id, newUserData, oldPassword) {
    console.log(newUserData);
    // Hash new password + Add hashing time per request 
    const hashedPassword = await bcrypt.hash(newUserData.password, 10);
    // Connect DB
    const connection = await sql.connect(dbConfig);
    // Check for user data
    const sqlQueryCheck = `SELECT * FROM Users WHERE UserID = @userId;`;
    // Send request
    const request = connection.request();
    request.input("userId",id);
    // Get result
    const checkResult = await request.query(sqlQueryCheck);

    // Check if the old password is correct
    if (!await bcrypt.compare(oldPassword, checkResult.recordset[0].PasswordHash)){
      // End function
      return null;
    }

    // Update all User data for that specific user
    const sqlQuery = `UPDATE Users SET LoginName = @loginName, PasswordHash = @hashedPassword, Email = @email WHERE UserID = @id`; // Parameterized query

    request.input("id", id);
    request.input("loginName", newUserData.username); 
    request.input("hashedPassword", hashedPassword);
    request.input("email", newUserData.email || null); // Handle removing email
    console.log(sqlQuery);
    // Send request
    await request.query(sqlQuery);
    // Close connection
    connection.close();

    // Return new data
    return this.getUserById(id); // returning the updated User data
  }

  // Creating new user
  static async createUser(newUserData) {
    // Hash New Password
    const hashedPassword = await bcrypt.hash(newUserData.password, 10);
    // Connecting to DB
    const connection = await sql.connect(dbConfig);
    // Get User Data of the User
    const sqlQueryCheck = `SELECT * FROM Users WHERE LoginName = @userName;`;
    // Send request
    const request = connection.request();
    request.input("userName",newUserData.username);
    // Get result
    const checkResult = await request.query(sqlQueryCheck);

    // if no user has the same username
    if (checkResult.recordset[0] == null){
      const sqlQuery = `INSERT INTO Users (LoginName, PasswordHash, Email, Access) VALUES (@loginName, @hashedPassword, @email, @access); 
                        SELECT SCOPE_IDENTITY() AS UserID;`; // Retrieve ID of inserted record


      request.input("loginName", newUserData.username);
      request.input("hashedpassword", hashedPassword);
      request.input("email", newUserData.email);
      request.input("access","M");

      // Send request
      const result = await request.query(sqlQuery);
      // Close connection
      connection.close();
      // Retrieve the newly created User using its ID
      return this.getUserById(result.recordset[0].id);
    }
    // Close connection in case user creation failed
    connection.close();
    return "User Taken";
    
  }
  
  // Delete user
  static async deleteUser(id) {
    // Connect to DB
    const connection = await sql.connect(dbConfig);

    // Delete user by id
    const sqlQuery = `DELETE FROM Users WHERE UserID = @userId`; // Parameterized query

    // Send request
    const request = connection.request();
    request.input("userId", id);
    // Get result
    const result = await request.query(sqlQuery);
    // Close connection
    connection.close();

    // Returns true/false based on success/failure
    return result.rowsAffected > 0; // Indicate success based on affected rows
  }

  // Login User
  static async loginUser(username,password){
    // Connect to DB
    const connection = await sql.connect(dbConfig);
    // Select user by username
    const sqlQuery = `SELECT * FROM Users WHERE LoginName = @username`; // Parameterized query
    // Create request
    const request = connection.request();
    request.input("username", username);
    const result = await request.query(sqlQuery);
    // Close connection
    connection.close();

    // If no user is found
    if (result.recordset[0] == null){
      // Return to stop function
      return null;
    }
    // A user is found
    try{
      console.log("User exists");
      // Check if password entered matches one in database
      if (await bcrypt.compare(password, result.recordset[0].PasswordHash)){
        // Get user data
        const user = {
            userid: result.recordset[0].UserID,
            username: result.recordset[0].LoginName,
            password: password
        }
        console.log("Success");
        // Create access token
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: '60000s'
        });
        console.log("Works")
        // Create refresh token
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
        // console.log(refreshToken);
        // Add to refresh token list
        return {"access":accessToken,"refresh": refreshToken};
      }
      else{
        return null;
      };
    }
    // On failure
    catch (err){
      // alert("An error has occured");
      console.log(err);
      return null;
    }
  }

  // Generates access token
  generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        // Expiry timer per token (100min)
        expiresIn: '6000s'
    })
  }

  // static async searchUsers(searchTerm) {
  //   const connection = await sql.connect(dbConfig);

  //   try {
  //     const query = `
  //       SELECT *
  //       FROM Users
  //       WHERE LoginName LIKE '%${searchTerm}%'
  //         OR email LIKE '%${searchTerm}%'
  //     `;

  //     const result = await connection.request().query(query);
  //     return result.recordset;
  //   } catch (error) {
  //     throw new Error("Error searching users"); // Or handle error differently
  //   } finally {
  //     await connection.close(); // Close connection even on errors
  //   }
  // }
  // static async getUserByName(loginName,password) {
  //   const connection = await sql.connect(dbConfig);

  //   const sqlQuery = `SELECT * FROM Users WHERE LoginName = @loginName AND PasswordHash = HASHBYTES('SHA2_256','@password')`; // Parameterized query

  //   const request = connection.request();
  //   request.input("loginName", loginName);
  //   request.input("password",password);
  //   const result = await request.query(sqlQuery);

  //   connection.close();

  //   return result.recordset[0]
  //     ? new User(
  //         result.recordset[0].loginName,
  //         result.recordset[0].password,
  //         result.recordset[0].email,
  //         result.recordset[0].access
  //       )
  //     : null; // Handle User not found
  // }
  

}

module.exports = User;