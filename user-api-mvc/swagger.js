const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger-output.json"; // Output file for the spec
const routes = ["./authServer.js"]; // Path to your API route files

const doc = {
  info: {
    title: "Elderly Community Website API",
    description: "Elderly Community Website API, for BED Assignment",
  },
  host: "localhost:3000", // Replace with your actual host if needed
};

swaggerAutogen(outputFile, routes, doc);