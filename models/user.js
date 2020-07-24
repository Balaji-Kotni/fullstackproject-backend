var mongoose = require('mongoose');
const crypto = require('crypto');
const uuidv1 = require('uuid/v1');
  
var userSchema= new mongoose.Schema({
firstname:{
    type: String,
    required: true,
    maxlength: 100,
    trim:true
},
lastname:{
    type: String,
    maxlength: 50,
    trim:true
},
email:{
    type: String,
    required:true,
    trim:true,
    unique: true
},
phone:{
    type: Number,
    trim: true
},
userinfo:{
    type: String,
    trim: true
},

secured_password:{
    type: String,
    required: true
},
salt: String,
role:{
    type: Number,
    default: 0
},
purchases:{
    type: Array,
    default: []
}
},{timestamps: true});


userSchema
.virtual("password")
  .set(function (password) {
     this._password = password;
     this.salt = uuidv1();
     this.secured_password = this.securePassword(password) 
  })
  .get(function () {
      this._password
  });
userSchema.methods ={

    authenticate: function (plainpassword) {
        return this.securePassword(plainpassword)=== this.secured_password
    },

    securePassword: function(plainpassword){
        if(!plainpassword) return "";
        try {
           return crypto
           .createHmac('sha256', this.salt)
           .update(plainpassword)
           .digest('hex'); 
        } catch (error) {
           return ""; 
        }
    }
};

module.exports= mongoose.model("User",userSchema )