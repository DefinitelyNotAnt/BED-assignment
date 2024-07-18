module.exports = {
    user: "userapi_user", // Username of SQL server
    password: "VeryTempPassword", // Temporary SQL server password
    server: "localhost",
    database: "user_db", // Database name
    trustServerCertificate: true,
    options: {
      port: 1433, // Default SQL Server port
      connectionTimeout: 60000,
    },
  };
  
// Temporary SQL
// CREATE TABLE Users
// (
//     UserID INT IDENTITY(1,1) NOT NULL UNIQUE,
//     LoginName NVARCHAR(40) NOT NULL,
//     PasswordHash BINARY(64) NOT NULL,
//     Email NVARCHAR(40) NULL,
// 	   Access CHAR(1) NOT NULL,
//     CONSTRAINT [PK_User_UserID] PRIMARY KEY CLUSTERED (UserID ASC)
// )

