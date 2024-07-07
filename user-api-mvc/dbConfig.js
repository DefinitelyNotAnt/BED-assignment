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

// INSERT INTO Users(LoginName,PasswordHash, Email, Access)
// VALUES
//   ('AdministratorAcc', HASHBYTES('SHA2_256','JustAdminPassword?'),'s10258331@connect.np.edu.sg','A'),
//   ('TestAcc', HASHBYTES('SHA2_256','12345678'),'s10258331@connect.np.edu.sg','M'),
//   ('VariableGuy', HASHBYTES('SHA2_256','Randompass'),'fake@gmail.com','M'),
//   ('Guestmember', HASHBYTES('SHA2_256','zqal,pxws'),'competency@photon.com','M'),
//   ('TestV2', HASHBYTES('SHA2_256','TestingWIP'),'s10258331@connect.np.edu.sg','M');