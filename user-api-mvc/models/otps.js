const sql = require("mssql");
const dbConfig = require("../dbConfig");

var nodemailer = require('nodemailer');


class Otp{
    constructor(userId, email, otpString){
        this.userId = userId;
        this.email = email;
        this.otp = otpString;
    }
    static async getOtpCheck(userId, otp){
        try{
            console.log("Otp: "+otp);
            const generatedOtp = await this.getOtpById(userId);
            console.log(generatedOtp.otp);
            if(otp == generatedOtp.otp){
                console.log("Success!");
                const deleteOtp = await this.deleteOtp(userId, otp);
                return true;
            }
            else{
                return false;
            }
        }
        catch{
            return false;
        }
        
    }

    static async deleteOtp(userId, otp){
        // Connect to DB
        const connection = await sql.connect(dbConfig);

        // Delete user by id
        const sqlQuery = `DELETE FROM Otps WHERE UserID = @userId AND Otp = @otp`; // Parameterized query

        // Send request
        const request = connection.request();
        request.input("userId", userId);
        request.input("otp",otp);
        // Get result
        const result = await request.query(sqlQuery);
        // Close connection
        connection.close();

        // Returns true/false based on success/failure
        return result.rowsAffected > 0; // Indicate success based on affected rows
    }

    static async getOtpById(userId){
        // Connect to DB
        const connection = await sql.connect(dbConfig);
        // Select the Otp with the userid
        const sqlQuery = `SELECT * FROM Otps WHERE UserID = @id`; // Parameterized query
        // Send request
        const request = connection.request();
        request.input("id", userId);
        // Get result
        const result = await request.query(sqlQuery);
        // Close connection
        connection.close();
        // Returns Otp Data
        return result.recordset[0]
        ? new Otp(
            result.recordset[0].UserID,
            result.recordset[0].Email,
            result.recordset[0].Otp
            )
        : null; // Handle otp not found
    }

    static async sendOtp(userId, email){
        // Connecting to DB
        const connection = await sql.connect(dbConfig);
        // Get User Data of the User
        const sqlQueryCheck = `DELETE FROM Otps WHERE UserId = @userId;`;
        // Send request
        const request = connection.request();
        const sqlQuery = `INSERT INTO Otps (UserID, Email, Otp) VALUES (@userId, @email, @otp); 
                        SELECT SCOPE_IDENTITY() AS UserID;`; // Retrieve ID of inserted record

        var genOtp = this.generateOtp()
        request.input("userId", userId);
        request.input("email", email);
        request.input("otp", genOtp);

        // Send request
        try{
            const clearOtps = await request.query(sqlQueryCheck);
        }
        catch{
            console.log("Error clearing.")
        }
        const result = await request.query(sqlQuery);
        // Close connection
        connection.close();
        // Sends the Otp over
        this.sendOtpToEmail(email, genOtp);


        // Retrieve the newly created Otp using user ID and email
        return this.getOtpById(result.recordset[0].UserID);
    }

    static generateOtp(){
        const OTP = Math.floor(Math.random()*999999);
        const otpString = String(OTP).padStart(6, '0');
        return otpString;
    }


    static async sendOtpToEmail(email,otp){
        var transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            service: 'gmail',
            auth: {
              user: 'noreply.resetpassauthenticator@gmail.com',
              pass: 'mizv kmef kciq xhrb'
            }
          }); 
      
          var mailOptions = {
            from: 'noreply.resetpassauthenticator@gmail.com',
            to: email,
            subject: 'Password reset',
            text: 'Your OTP is: ' + otp
          };
          try{
            transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.response);
              }
            });
          }
          catch{
            console.log("Failed to send email.");
          }
    }


}
module.exports = Otp;