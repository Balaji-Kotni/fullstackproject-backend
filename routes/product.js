const express = require('express')
const router= express.Router();

const {getProductById,createProduct,getProduct, photo, updateProduct, deleteProduct, getAllProducts, getAllUniqueCategories} = require("../controllers/product")
const {isSignedIn,isAuthenticated,isAdmin} = require("../controllers/authentication")
const {getUserbyId} = require("../controllers/user")

// Params go here
router.param("userId", getUserbyId);
router.param("productId", getProductById);

//Actual routes go here

//create route
router.post("/product/create/:userId", isSignedIn,isAuthenticated,isAdmin, createProduct);

//read routes
router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", photo);

//delete route
router.delete("/product/:productId/:userId",isSignedIn,isAuthenticated,isAdmin, deleteProduct);

//update route
router.put("/product/:productId/:userId",isSignedIn,isAuthenticated,isAdmin, updateProduct);

//listing route
router.get("/products", getAllProducts);
router.get("/products/categories", getAllUniqueCategories)

module.exports=router;  