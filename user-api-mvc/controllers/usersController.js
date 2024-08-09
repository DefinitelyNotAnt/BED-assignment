require('dotenv').config();
const { error } = require("console");
const { user } = require("../dbConfig");
const User = require("../models/user");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const UserProfile = require("../models/userProfile");
const Otp = require("../models/otps");
var nodemailer = require('nodemailer');



const getAllUsers = async (req, res) => {
  try {
    console.log("In")
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
  const userId = req.body.userid;
  const newUserData = req.body.newUserData;
  const oldPassword = req.body.oldPassword;
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
    res.status(500).send("Error creating user");
  }
};

const deleteUser = async (req, res) => {
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
  const username = req.body.username;
  const password = req.body.password;
  try{
    const tokens = await User.loginUser(username, password);
    if (tokens == null) {
      res.status(404).send("Failed to log in.");
      return error;
    }
    else{
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



const resetPassword = async (req, res) => {
    try {
      const { userId, otp } = req.query;
      const users = await User.getUserById(userId);
      console.log(users)
      if (users != null){
        var returnData = {
          "userid": users.userId,
          "password": users.password,
          "newUserData": {
            "username": users.loginName,
            "password": users.password,
            "email": users.email
          }
        }
        const validateOtp = await Otp.getOtpCheck(users.userId, otp);
        if (!validateOtp){
          return res.status(404).send("Otp not valid.");
        }
        const refreshToken = jwt.sign(returnData, process.env.REFRESH_TOKEN_SECRET);
        res.cookie("usrdta", refreshToken, {
          sameSite: 'None', 
          secure: true,
          maxAge: 24 * 60 * 60 * 1000
        })
        res.status(201).json(returnData);
      }
    } catch (error) { 
      console.error(error);
      console.log("Error 500: Error updating user");
    }
}

async function searchUsers(req, res) {
  const searchTerm = req.body.searchTerms; // Extract search term from query params
  try {    
    const users = await User.searchUsers(searchTerm);
    // const OTP = Math.floor(Math.random()*999999);
    // const otpString = String(OTP).padStart(6, '0');
    // var transporter = nodemailer.createTransport({
    //   host: 'smtp.gmail.com',
    //   port: 465,
    //   secure: true,
    //   service: 'gmail',
    //   auth: {
    //     user: 'noreply.resetpassauthenticator@gmail.com',
    //     pass: 'mizv kmef kciq xhrb'
    //   }
    // }); 

    // var mailOptions = {
    //   from: 'noreply.resetpassauthenticator@gmail.com',
    //   to: users.email,
    //   subject: 'Password reset',
    //   text: 'Your OTP is: ' + otpString
    // };
    // try{
    //   transporter.sendMail(mailOptions, function(error, info){
    //     if (error) {
    //       console.log(error);
    //     } else {
    //       console.log('Email sent: ' + info.response);
    //     }
    //   });
    // }
    // catch{
    //   console.log("Failed to send email.");
    // }
    
    
    var returnData = {
      "userid": users.userId,
      "password": users.password,
      "newUserData": {
        "username": users.loginName,
        "password": users.password,
        "email": users.email
      }
    }

    try{
      var returnOtp = Otp.sendOtp(users.userId,users.email);
      if (returnOtp == null){
        throw error;
      }
    }
    catch{
      res.status(400).json({
        message: "Error sending email."
      });
    }

    res.json(returnData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error searching users" });
  }
}

  module.exports = {
    // getUserByName
    getAllUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser,
    loginUser,
    resetPassword,
    searchUsers
  };