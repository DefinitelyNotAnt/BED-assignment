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
//     PasswordHash NVARCHAR(64) NOT NULL,
//     Email NVARCHAR(40) NULL,
// 	   Access CHAR(1) NOT NULL,
//     CONSTRAINT [PK_User_UserID] PRIMARY KEY CLUSTERED (UserID ASC)
// )

// CREATE TABLE Events (
//   EventId INT IDENTITY(1,1) PRIMARY KEY,
//   EventName VARCHAR(50) NOT NULL, -- Name is required and unique (cannot be NULL)
//   EventDesc VARCHAR(800) NOT NULL, -- Description is required (cannot be NULL)
//   EventStartTime smalldatetime NOT NULL,
//   EventEndTime smalldatetime NOT NULL,
//   EntryPrice smallmoney NULL,
//   HostId tinyint NOT NULL
//   --CONSTRAINT FK_HostId FOREIGN KEY (HostId) REFERENCES Users(UserId)
// );
