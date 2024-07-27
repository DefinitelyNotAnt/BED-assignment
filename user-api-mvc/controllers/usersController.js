require('dotenv').config();
const { error } = require("console");
const { user } = require("../dbConfig");
const User = require("../models/user");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const UserProfile = require("../models/userProfile");

// const getUserByName = async (req, res) => {
//     const userName = parseInt(req.params.loginName);
//     try {
//       const user = await User.getUserById(userName);
//       if (!user) {
//         return res.status(404).send("User not found");
//       }
//       res.json(user);
//     } catch (error) {
//       console.error(error);
//       res.status(500).send("Error retrieving user");
//     }
//   };


const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving Users");
  }
};

const getUserById = async (req, res) => {
  var authheader = req.headers.authorization;
  const bearerToken = authheader.split(' ')[1];
  var userId;
  
  jwt.verify(bearerToken, process.env.REFRESH_TOKEN_SECRET, (err, decodedToken) => {
    if (err) {
      console.error('Token verification failed');
    } else {
      // console.log('Decoded token:', decodedToken);
      userId = decodedToken.userid;
    }})
  try {
    const user = await User.getUserById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving user");
  }
};

const updateUser = async (req, res) => {
  const userId = req.body.userId;
  const newUserData = req.body.userData;
  const oldPassword = req.body.oldPassword;
  // console.log(oldPassword);
  try {
    const updatedUser = await User.updateUser(userId, newUserData, oldPassword);
    if (!updatedUser) {
      return res.status(404).send("User not found");
    }
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating user");
  }
};

const createUser = async (req, res) => {
  console.log("Create");
  const newUser = req.body;
  try {
    const createdUser = await User.createUser(newUser);
    if (createUser == "User Taken"){
      console.log("User taken");

    }
    res.status(201).json(createdUser);
  } catch (error) {
    console.error(error);
    console.log("Error 500: Error creating user");
  }
};

const deleteUser = async (req, res) => {
  console.log(req.body.userid);
  const userId = req.body.userid;
  try {
    const step1success = await UserProfile.deleteProfile(userId);
    if (!step1success){
      return res.status(404).send("User not found");
    }
    const success = await User.deleteUser(userId);
    if (!success) {
      return res.status(404).send("User not found");
    }
    return "Success";
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting user");
  }
};

const loginUser = async (req,res) => {
  console.log("logging:")
  const username = req.body.username;
  const password = req.body.password;
  try{
    const tokens = await User.loginUser(username, password);
    console.log(tokens);
    if (tokens == null) {
      res.status(404).send("Failed to log in.");
      return error;
    }
    else{
      console.log(tokens.refresh);
      res.cookie("jwt", tokens.refresh, {
        sameSite: 'None', 
        secure: true,
        maxAge: 24 * 60 * 60 * 1000
      })
      return res.json({
        "accessToken": tokens.access
      });
    }
  }
  catch(error){
    console.error(error);
    console.log("Error 500: Error logging in");
    return "500: Error logging in";
      // const getConfirm = document.getElementById("confirmLabel");
      // if (getConfirm.childElementCount < 2){
      //     const incorrect = document.createElement("div");
      //     incorrect.classList.add("incorrect");
      //     incorrect.innerText="Passwords do not match.";
      //     getConfirm.appendChild(incorrect);
      // }
  }
}

// async function searchUsers(req, res) {
//   const searchTerm = req.query.searchTerm; // Extract search term from query params

//   try {    
//     const users = await User.searchUsers(searchTerm);
//     res.json(users);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error searching users" });
//   }
// }

  module.exports = {
    // getUserByName
    getAllUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser,
    loginUser
    // searchUsers
  };