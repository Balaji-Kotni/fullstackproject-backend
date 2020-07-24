const Product = require("../models/product")
const formidable = require("formidable")
const _ = require("lodash")
const fs = require("fs");
const { sortBy } = require("lodash");

exports.getProductById=(req,res, next, id)=> {
    Product.findById(id)
    .populate("category")
    .exec((err,product) => {
        if (err) {
            return res.status(400).json({
                error: "Such product is not found in the DB"
            });           
           }
         req.product= product;
         next();  
    });
};

exports.createProduct = (req,res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req,(err,fields,file) => {
    if (err) {
        return res.status(400).json({
            error: "Product creation Failed. Check with the image properties..!"
        });  
    }
    // DESTRUCTURING THE FIELDS
    const {name, description, price, category, stock} = fields;
    if (
         !name || 
         !description ||
         !price ||
         !category ||
         !stock
         ) {
        return res.status(400).json({
         error: "Please enter all the fields"   
        });
    }

    let product = new Product(fields);

    //File handling
    if(file.photo){
      if (file.photo.size > 3000000) {
        return res.status(400).json({
            error: "Image size should be less than 2 MB"
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path)
      product.photo.contentType = file.photo.type  
    }
    // Save into the db
    product.save((err,product)=>{
        if (err) {
            return res.status(400).json({
                error: "Product couldn't be saved in the DB"
            });  
        }
        res.json(product)   
    });
  });
};

exports.getProduct = (req,res) => {
    req.product.photo = undefined;
    return res.json(req.product)
};
//middleware
exports.photo = (req,res,next) => {
    if (req.product.photo.data) {
      res.set("Content-Type", req.product.photo.contentType)
      return res.send(req.product.photo.data)  
    }
    next();
;}

exports.deleteProduct = (req,res) => {
    let product = req.product;
    product.remove((err,product)=> {
        if (err) {
            return res.status(400).json({
                error: "Sorry! Product could not deleted from the DB"
            });           
           }  
           res.json({
               message: "Product was successfully deleted",
             });
    });
};

exports.updateProduct = (req,res) => {
    let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req,(err,fields,file) => {
    if (err) {
        return res.status(400).json({
            error: "Product updation Failed. Check with the image properties..!"
        });  
    }

    //updating product
    let product = req.product;
    product = _.extend(product, fields)
    //File handling
    if(file.photo){
      if (file.photo.size > 3000000) {
        return res.status(400).json({
            error: "Image size should be less than 2 MB"
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path)
      product.photo.contentType = file.photo.type  
    }
    // Save into the db
    product.save((err,product)=>{
        if (err) {
            return res.status(400).json({
                error: "Product couldn't be updated in the DB"
            });  
        }
        res.json(product)   
    });
  });
};

//get all products
exports.getAllProducts= (req,res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 8
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    
    Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy,"asc"]])
    .limit(limit)
    .exec((err,products)=>{
        if (err) {
            return res.status(400).json({
                error: "No products found in the DB"
            });           
       }
       res.json(products);  
 });
};

exports.getAllUniqueCategories = (req,res)=> {
  Product.distinct("category", {}, (err,categories) => {
    if (err) {
        return res.status(400).json({
            error: "No categories found in the DB"
        });           
    } 
    res.json(categories);  
  });
};

exports.updateStock = (req,res,next) => {
    let myOp = req.body.order.products.map(prod => {
        return {
            updateOne: {
                filter: {_id: prod._id},
                update: {$inc: {stock: -prod.count, sold: +prod.count}}
            }
        }
    });
    Product.bulkWrite(myOp,{}, (err,products)=> {
        if (err) {
            return res.status(400).json({
                error: "Bulk Operations failed.. Failed to update the inventory"
            });           
        }
        next();     
    });
};


