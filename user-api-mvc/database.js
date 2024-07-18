module.exports = 
{
    user: "placesapi_user", // Replace with your SQL Server login username
    password: "Pa$$word", // Replace with your SQL Server login password
    server: "localhost",
    database: "places_db",
    trustServerCertificate: true,
    options: 
    {
      port: 1433, // Default SQL Server port
      connectionTimeout: 60000, // Connection timeout in milliseconds
    },
};