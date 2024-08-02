// usersController.test.js

const usersController = require("../controllers/usersController");
const sql = require("mssql");
const User = require("../models/user");
const UserProfile = require("../models/userProfile");

// Mock the User model
jest.mock("../models/user");
jest.mock("../models/userProfile");
// Mock the mssql library
jest.mock("mssql"); 



// ========================================================================
// ============================ Test getAllUsers ==========================
// ========================================================================


describe("usersController.getAllUsers", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
  });

  it("should fetch all users and return a JSON response", async () => {
    const mockUsers = [
      { UserId: 47, LoginName: "TestUser1", PasswordHash: "$2b$10$mUgUmIkBimG5dHrnqSlN0uSnAR/IDDXFBRqxAKu6EJjgMjth2v3Mq", Email: "lmaoant5@gmail.com", Access: "M" },
      { UserId: 48, LoginName: "TestUser2", PasswordHash: "$2b$10$ZOMaXK4cBBpgvCTisY33YelNhcfjcfzJVuBAiXyIGpUE8m6ckBezS", Email: "s10258331@connect.np.edu.sg", Access: "M" }
    ];

    // Mock the users.getAllUsers function to return the mock data
    User.getAllUsers.mockResolvedValue(mockUsers);

    const req = {};
    const res = {
      json: jest.fn(), // Mock the res.json function
    };

    await usersController.getAllUsers(req, res);

    expect(User.getAllUsers).toHaveBeenCalledTimes(1); // Check if getAllUsers was called
    expect(res.json).toHaveBeenCalledWith(mockUsers); // Check the response body
  });

  it("should handle errors and return a 500 status with error message", async () => {
    const errorMessage = "Database error";
    User.getAllUsers.mockRejectedValue(new Error(errorMessage)); // Simulate an error

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await usersController.getAllUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("Error retrieving Users");
  });
});


// ========================================================================
// ============================ Test getUserById ==========================
// ========================================================================


describe("usersController.getUserById", () => {
    beforeEach(() => {
      jest.clearAllMocks(); // Clear mock calls before each test
    });
  
    it("should fetch a users and return a JSON response", async () => {
      const mockUsers = [
        { UserId: 47, LoginName: "TestUser1", PasswordHash: "$2b$10$mUgUmIkBimG5dHrnqSlN0uSnAR/IDDXFBRqxAKu6EJjgMjth2v3Mq", Email: "lmaoant5@gmail.com", Access: "M" },
        { UserId: 48, LoginName: "TestUser2", PasswordHash: "$2b$10$ZOMaXK4cBBpgvCTisY33YelNhcfjcfzJVuBAiXyIGpUE8m6ckBezS", Email: "s10258331@connect.np.edu.sg", Access: "M" }
      ];
  
      // Mock the users.getAllUsers function to return the mock data
      User.getUserById.mockResolvedValue(mockUsers);
  
      const req = {
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + "$2b$10$mUgUmIkBimG5dHrnqSlN0uSnAR/IDDXFBRqxAKu6EJjgMjth2v3Mq" // For User TestUser1
        }
      };
      console.log(req.headers.authorization)
      const res = {
        json: jest.fn(), // Mock the res.json function
      };
  
      await usersController.getUserById(req, res);
  
      expect(User.getUserById).toHaveBeenCalledTimes(1); // Check if getAllUsers was called
      expect(res.json).toHaveBeenCalledWith(mockUsers); // Check the response body
    });
  
    it("should handle errors and return a 500 status with error message", async () => {
      const errorMessage = "Database error";
      User.getAllUsers.mockRejectedValue(new Error(errorMessage)); // Simulate an error
  
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
  
      await usersController.getAllUsers(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Error retrieving Users");
    });
  });


  // ========================================================================
// ============================ Test UpdateUser ==========================
// ========================================================================


describe("usersController.UpdateUser", () => {
    beforeEach(() => {
      jest.clearAllMocks(); // Clear mock calls before each test
    });
  
    it("should update a users and return a JSON response", async () => {
      const mockUsers = [
        { UserId: 47, LoginName: "TestUser1", PasswordHash: "$2b$10$mUgUmIkBimG5dHrnqSlN0uSnAR/IDDXFBRqxAKu6EJjgMjth2v3Mq", Email: "lmaoant5@gmail.com", Access: "M" },
        { UserId: 48, LoginName: "TestUser2", PasswordHash: "$2b$10$ZOMaXK4cBBpgvCTisY33YelNhcfjcfzJVuBAiXyIGpUE8m6ckBezS", Email: "s10258331@connect.np.edu.sg", Access: "M" }
      ];
  
      // Mock the users.getAllUsers function to return the mock data
      User.updateUser.mockResolvedValue(mockUsers);
  
      const req = {
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + "$2b$10$mUgUmIkBimG5dHrnqSlN0uSnAR/IDDXFBRqxAKu6EJjgMjth2v3Mq" // For User TestUser1
        },
        body: {
            'userid': 47,
            'newUserData': {
                'username': "ChangedTestUser1",
                'password': "ChangePassword",
                'confirmPassword': "ChangePassword",
                'email': "lmaoant5@gmail.com"
            },
            'oldPassword': "$2b$10$mUgUmIkBimG5dHrnqSlN0uSnAR/IDDXFBRqxAKu6EJjgMjth2v3Mq"
        }
      };
      const res = {
        json: jest.fn(), // Mock the res.json function
      };
  
      await usersController.updateUser(req, res);
  
      expect(User.updateUser).toHaveBeenCalledTimes(1); // Check if getAllUsers was called
      expect(res.json).toHaveBeenCalledWith(mockUsers); // Check the response body
    });
  
    it("should handle errors and return a 500 status with error message", async () => {
      const errorMessage = "Database error";
      User.updateUser.mockRejectedValue(new Error(errorMessage)); // Simulate an error
  
      const req = {
        body: {
            'userid': 47,
            'newUserData': {
                'username': "ChangedTestUser1",
                'password': "ChangePassword",
                'confirmPassword': "ChangePassword",
                'email': "lmaoant5@gmail.com"
            },
            'oldPassword': "false"
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
  
      await usersController.updateUser(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Error updating user");
    });
  });


// ========================================================================
// ============================ Test deleteUser ==========================
// ========================================================================


describe("usersController.deleteUser", () => {
    beforeEach(() => {
      jest.clearAllMocks(); // Clear mock calls before each test
    });
  
    it("should delete a users and return 1", async () => {
      const mockUsers = [
        { UserId: 47, LoginName: "TestUser1", PasswordHash: "$2b$10$mUgUmIkBimG5dHrnqSlN0uSnAR/IDDXFBRqxAKu6EJjgMjth2v3Mq", Email: "lmaoant5@gmail.com", Access: "M" },
        { UserId: 48, LoginName: "TestUser2", PasswordHash: "$2b$10$ZOMaXK4cBBpgvCTisY33YelNhcfjcfzJVuBAiXyIGpUE8m6ckBezS", Email: "s10258331@connect.np.edu.sg", Access: "M" }
      ];
  
      // Mock the users.getAllUsers function to return the mock data
      User.deleteUser.mockResolvedValue(1);
  
      const req = {
        body: {
            'userid': 47
        }
      };
      const res = {
        json: jest.fn(), // Mock res.json
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
  
      await usersController.deleteUser(req, res);
  
      expect(UserProfile.deleteProfile).toHaveBeenCalledTimes(1); // Check if getAllUsers was called
    });
  
    it("should handle errors and return a 500 status with error message", async () => {
      const errorMessage = "Error deleting user";
      User.updateUser.mockRejectedValue(new Error(errorMessage)); // Simulate an error
  
      const req = {
        body: {
            'userid': -1
        }
      };
      const res = {
        json: jest.fn(), // Mock res.json
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
  
      await usersController.deleteUser(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404); // Not found
      expect(res.send).toHaveBeenCalledWith("User not found");
    });
  });


  describe("usersController.createUser", () => {
    beforeEach(() => {
      jest.clearAllMocks(); // Clear mock calls before each test
    });
  
    it("should create a user", async () => {
      const mockUser = 
        { UserId: 1, LoginName: "TestUser1", PasswordHash: "$2b$10$mUgUmIkBimG5dHrnqSlN0uSnAR/IDDXFBRqxAKu6EJjgMjth2v3Mq", Email: "lmaoant5@gmail.com", Access: "M" };
  
      // Mock the users.getAllUsers function to return the mock data
      User.deleteUser.mockResolvedValue(1);
  
      const req = {
        body: {
            "username": 'TestUser1',
            "password": "$2b$10$mUgUmIkBimG5dHrnqSlN0uSnAR/IDDXFBRqxAKu6EJjgMjth2v3Mq",
            "confirmPassword": "$2b$10$mUgUmIkBimG5dHrnqSlN0uSnAR/IDDXFBRqxAKu6EJjgMjth2v3Mq",
            "email": "lmaoant5@gmail.com"
        }
      };
      const res = {
        json: jest.fn(), // Mock res.json
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
  
      await usersController.createUser(req, res);
  
      expect(User.createUser).toHaveBeenCalledTimes(1); // Check if createUser was called
    });
  
    it("should handle errors and return a 500 status with error message", async () => {
      const errorMessage = "Error deleting user";
      User.updateUser.mockRejectedValue(new Error(errorMessage)); // Simulate an error
  
      const req = {
        body: {
            'userid': -1
        }
      };
      const res = {
        json: jest.fn(), // Mock res.json
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
  
      await usersController.createUser(req, res);
  
      expect(res.status).toHaveBeenCalledWith(201); // Failed to create
    });
  });
