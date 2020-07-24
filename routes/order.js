const express = require('express');
const router= express.Router();
const {isSignedIn,isAuthenticated,isAdmin} = require("../controllers/authentication");
const {getUserbyId, pushOrderInPurchaseList} = require("../controllers/user");
const {updateStock} = require("../controllers/product");

const {getOrderbyId, createOrder, getAllOrders, getOrderStatus, updateStatus} = require("../controllers/order")

//params
router.param("userId", getUserbyId);
router.param("orderId", getOrderbyId);

//Actual routes go here

//create route
router.post("/order/create/:userId", isSignedIn, isAuthenticated, pushOrderInPurchaseList, updateStock, createOrder);

//read route
router.get("/order/all/:userId", isSignedIn, isAuthenticated, isAdmin, getAllOrders)

//order status routes
router.get("/order/status/:userId",  isSignedIn, isAuthenticated, isAdmin, getOrderStatus);
router.put("/order/:orderId/status/:userId",  isSignedIn, isAuthenticated, isAdmin, updateStatus);

module.exports= router;