var express = require('express');
const { request } = require('express');
var router = express.Router()
const { check, validationResult } = require('express-validator');
const {signout , signup , signin, isSignedIn} = require("../controllers/auth"); 


router. post(
  "/signup",
  [
    check("name").isLength({ min: 3 }).withMessage('must be at least 3 chars long'),
    check("email","email is required").isEmail(),
    check('password', 'The password must be 7+ chars long and contain a number')
    .not().isIn(['123', 'password', 'god']).withMessage('Do not use a common word as the password')
    .isLength({ min: 7 })
    .matches(/\d/),
  ], 
  signup
);

router. post(
  "/signin",
  [
    check("email","email is required").isEmail(),
    check('password', 'The password field is requir')
    .not().isIn(['123', 'password', 'god']).withMessage('Do not use a common word as the password')
    .isLength({ min: 7 })
    .matches(/\d/),
  ], 
  signin
);


router.get("/signout",signout);

router.get("/testroute", isSignedIn,  (req , res) =>{
  res.json(req.auth);
});

module.exports = router;