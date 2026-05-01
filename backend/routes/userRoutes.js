const express = require("express");
const {updateProfile, deleteResume, getPublicProfile}=require("../controllers/userController");
const {protect}=require("../middlewares/authMiddleware");


const router=express.Router();
router.put("/profile", protect, updateProfile);
router.delete("/resume", protect, deleteResume);
router.get("/:id", getPublicProfile);

module.exports=router;