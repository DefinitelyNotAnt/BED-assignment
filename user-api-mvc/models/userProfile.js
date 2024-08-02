// =================================================
// ============== Requires for DB ==================
// =================================================

const sql = require("mssql");
const dbConfig = require("../dbConfig");
const bcrypt = require("bcrypt");



// ================================================
// ================  User Class ===================
// ================================================

class UserProfile {
    // Constructor
    constructor(userId, userDesc, userProfile) {
        this.userId = userId;
        this.userDesc = userDesc;
        this.userProfile = userProfile;
    }

     // Get specific user by Id
    static async getProfileById(id) {
        // Connect to DB
        const connection = await sql.connect(dbConfig);
        // Select the User Profile with the id as id is unique
        const sqlQuery = `SELECT * FROM UserProfiles WHERE UserID = @id`; // Parameterized query
        // Send request
        const request = connection.request();
        request.input("id", id);
        // Get result
        const result = await request.query(sqlQuery);
        // Close connection
        connection.close();
        // Returns Profile Data
        return result.recordset[0]
        ? new UserProfile(
            result.recordset[0].UserID,
            result.recordset[0].UserDesc,
            result.recordset[0].ProfilePic
        )
        : null; // Handle user not found
    }



    // Create Profile
    static async createProfile(id){
        // Connect DB
        const connection = await sql.connect(dbConfig);
        // Send request
        const request = connection.request();

        // Update all User data for that specific user
        const sqlQuery = `INSERT INTO UserProfiles (ProfilePic, UserID, UserDesc) VALUES (@profile, @id, @desc); 
                        SELECT SCOPE_IDENTITY() AS UserID;`; // Parameterized query

        request.input("id", id);
        request.input("profile", null); 
        request.input("desc", "Hi, I'm a person who's too lazy to make a description."); // Handle empty description with template
        // Send request
        await request.query(sqlQuery);
        // Close connection
        connection.close();
        // Return new data
        return this.getProfileById(id); // returning the updated User data
    }
    // Update Profile
    static async updateProfile(id, newUserData) {
        // Connect DB
        const connection = await sql.connect(dbConfig);
        // Send request
        const request = connection.request();

        // Update all User data for that specific user
        const sqlQuery = `UPDATE UserProfiles SET ProfilePic = @profileUrl, UserDesc = @desc WHERE UserID = @id`; // Parameterized query

        request.input("id", id);
        if (newUserData.profileUrl == "undefined" || newUserData.profileUrl == ""){
            request.input("profileUrl", null); 
        }
        else{
            request.input("profileUrl", newUserData.profileUrl); 
        }
        if (newUserData.desc == "undefined" || newUserData.desc == ""){
            request.input("desc", "Hi, I'm a person who's too lazy to make a description."); // Handle empty description with template
        }
        else{
            request.input("desc", newUserData.desc);
        }
        // Send request
        await request.query(sqlQuery);
        // Close connection
        connection.close();
        // Return new data
        return this.getProfileById(id); // returning the updated User data
    }


    // Delete profile
  static async deleteProfile(id) {
    // Connect to DB
    const connection = await sql.connect(dbConfig);

    // Delete user profile by id
    const sqlQuery = `DELETE FROM UserProfiles WHERE UserID = @userId`; // Parameterized query

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
}

module.exports = UserProfile;