const sql = require("mssql");
const dbConfig = require("../dbConfig");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class User {
  constructor(userId,loginName, password, email, access) {
    this.userId = userId;
    this.loginName = loginName;
    this.password = password;
    this.email = email;
    this.access = access;
    this.refreshTokens = [];
  }



  static async getAllUsers() {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM Users`; 
    const request = connection.request();
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset.map(
      (row) => new User(row.UserID, row.LoginName, row.PasswordHash, row.Email, row.Access)
    ); // Convert rows to User objects
  }

  static async getUserById(id) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM Users WHERE UserID = @id`; // Parameterized query

    const request = connection.request();
    request.input("id", id);
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset[0]
      ? new User(
          result.recordset[0].UserID,
          result.recordset[0].LoginName,
          result.recordset[0].PasswordHash
        )
      : null; // Handle user not found
  }

  static async updateUser(id, newUserData) {
    const hashedPassword = await bcrypt.hash(newUserData.password, 10);
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `UPDATE Users SET LoginName = @loginName, PasswordHash = @hashedPassword, Email = @email WHERE UserID = @id`; // Parameterized query

    const request = connection.request();
    request.input("id", id);
    request.input("loginName", newUserData.loginName || null); // Handle optional fields
    request.input("password", password || null);
    request.input("email", newUserData.email || null);

    await request.query(sqlQuery);

    connection.close();

    return this.getUserById(id); // returning the updated User data
  }

  static async createUser(newUserData) {
    const hashedPassword = await bcrypt.hash(newUserData.password, 10);
    const connection = await sql.connect(dbConfig);
    const sqlQueryCheck = `SELECT * FROM Users WHERE LoginName = @userName;`;
    const request = connection.request();
    request.input("userName",newUserData.username);

    const checkResult = await request.query(sqlQueryCheck);
    if (checkResult.recordset[0] == null){
      const sqlQuery = `INSERT INTO Users (LoginName, PasswordHash, Email, Access) VALUES (@loginName, @hashedPassword, @email, @access); SELECT SCOPE_IDENTITY() AS UserID;`; // Retrieve ID of inserted record


      request.input("loginName", newUserData.username);
      request.input("hashedpassword", hashedPassword);
      request.input("email", newUserData.email);
      request.input("access","M");

      const result = await request.query(sqlQuery);
      connection.close();
      // Retrieve the newly created User using its ID
      return this.getUserById(result.recordset[0].id);
    }
    connection.close();
    return "User Taken";
    


  }

  static async deleteUser(id) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `DELETE FROM Users WHERE UserID = @userId`; // Parameterized query

    const request = connection.request();
    request.input("userId", id);
    const result = await request.query(sqlQuery);

    connection.close();

    return result.rowsAffected > 0; // Indicate success based on affected rows
  }

  static async loginUser(username,password){
    const connection = await sql.connect(dbConfig);
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
    const sqlQuery = `SELECT * FROM Users WHERE LoginName = @username`; // Parameterized query
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
    const request = connection.request();
    request.input("username", username);
    const result = await request.query(sqlQuery);

    connection.close();
    if (result.recordset[0] == null){
      return null;
    }
    try{
      console.log("Yes");
      console.log(result.recordset[0].PasswordHash);
      if (await bcrypt.compare(password, result.recordset[0].PasswordHash)){
        const user = {
            userid: result.recordset[0].UserID,
            username: result.recordset[0].LoginName,
            password: password
        }
        console.log("Success");
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: '60000s'
      });
        console.log("Works")
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
        console.log(refreshToken);
        
        // this.refreshTokens.push(refreshToken);
        return {accessToken, refreshToken};
      };
    }
    catch (err){
      console.log(err);
      return null;
    }
  }
  generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '60000s'
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