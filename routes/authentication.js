var express = require('express');
var router = express.Router();
const { check } = require('express-validator');
const {signout,signup,signin,isSignedIn} = require("../controllers/authentication");

router.post("/signup",[
   check("firstname").isLength({ min: 2 }).withMessage('Name must be at least 2 chars long'),
   check("email","email is needed").isEmail(),
   check("password").isLength({ min: 5 }).withMessage('Password must be at least 5 chars long')

], signup);

router.post("/signin",[
   
   check("email","email is needed").isEmail(),
   check("password").isLength({ min: 1 }).withMessage('Password is required')

], signin);


router.get("/signout",signout);



module.exports=router;
