const { user } = require("../dbConfig");
const User = require("../models/user");

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
  const userId = parseInt(req.params.userId);
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
  const userId = req.query.userId;
  const newUserData = req.query;
  try {
    const updatedUser = await User.updateUser(userId, newUserData);
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
    res.status(201).json(createdUser);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating user");
  }
};

const deleteUser = async (req, res) => {
  console.log(req.query.userId);
  const userId = req.query.userId;
  try {
    const success = await User.deleteUser(userId);
    if (!success) {
      return res.status(404).send("User not found");
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting user");
  }
};

const loginUser = async (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  try{
    const success = await User.loginUser(username, password);
    if (!success) {
      return res.status(404).send("Failed to log in.");
    }
  }
  catch(error){
    console.error(error);
    res.status(500).send("Error logging in.");
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