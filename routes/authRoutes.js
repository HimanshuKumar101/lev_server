const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");

const router = express.Router();

// Register route
router.post("/register", (req, res) => {
  registerUser(req,res);
});

// Login route
router.post("/login", (req,res)=>{
    loginUser(req,res);
});

module.exports = { router };
