import express from "express";
import { authenticateUser, createUserAccount, getCurrentUserProfile, signOutUser, updateUserProfile } from "../controllers/user.controller.js";
import { isAuthenticated } from "../middleware/auth.js";
import upload from "../utils/multer.js";

const route = express.Router()

route.post('/signup',createUserAccount)
route.post('/signin',authenticateUser)
route.post('/signout',signOutUser)

route.get('/profile',isAuthenticated,getCurrentUserProfile)
route.patch('/profile',isAuthenticated,upload.single("avatar"),updateUserProfile)


export default route