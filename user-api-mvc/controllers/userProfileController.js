const { user } = require("../dbConfig");
const UserProfile = require("../models/userProfile");

const getProfileById = async (req, res) => {
    var userId = req.headers.userid;
    try {
        const profile = await UserProfile.getProfileById(userId);
        if (!profile) {
            return res.status(404).send("Profile not found");
        }
        res.json(profile);
        } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving profile");
    }
};

const createProfile = async (req, res) => {
  var userId = req.body.userid;
    try {
      const profile = await UserProfile.createProfile(userId);
      if (!profile) {
        return res.status(404).send("Profile not found");
      }
      res.json(profile);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving profile");
    }
}

const updateProfile = async (req, res) => {
  var userId = req.body.userId;
  var newProfileData = req.body.newProfileData;
  try {
    const updatedUser = await UserProfile.updateProfile(userId, newProfileData);
    if (!updatedUser) {
      return res.status(404).send("Profile not found");
    }
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating profile");
  }
};


module.exports = {
    getProfileById,
    createProfile,
    updateProfile
}