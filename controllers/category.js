const Category = require("../models/category")

exports.getCategoryById= (req,res,next,id) => {
    Category.findById(id).exec((err,category)=> {
        if (err) {
         return res.status(400).json({
             error: "Such category is not found in the DB"
         });           
        }
        req.category = category;
        next();
    });     
};

exports.createCategory = (req, res) => {
    const category = new Category(req.body);
    category.save((err, category) => {
      if (err) {
        return res.status(400).json({
          error: "Couldn't save category in the DB"
        });
      }
      res.json({ category });
    });
  };


  exports.getCategory = (req,res) => {
    return res.json(req.category);
};


exports.getAllCategory = (req,res) => {
    Category.find().exec((err,categories) => {
        if (err) {
            return res.status(400).json({
                error: " No category found in the DB"
            });           
           }
           res.json(categories);
    });
};


exports.updateCategory = (req,res) => {
    const category = req.category; 
    category.name = req.body.name;
    category.save((err,updatedCategory) => {
        if (err) {
            return res.status(400).json({
                error: " Couldn't update category in the DB"
            });           
           }
           res.json(updatedCategory);  
    });
};


exports.removeCategory = (req,res)=> {
    const category = req.category;
    category.remove((err,category) => {
        if (err) {
            return res.status(400).json({
                error: " Couldn't remove category from the DB"
            });           
        }
        res.json({
            message: "Successfully deleted ${category} from the database"
        });
    }); 
};
