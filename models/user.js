var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
mongoose.connect('mongodb://localhost/Registerdb',{useNewUrlParser: true ,useUnifiedTopology: true,useCreateIndex: true});
var db =  mongoose.connection;
//Schemea
var UserSchema = mongoose.Schema({
    first_name:{
     type:String,
     index:true
    },
    last_name :{
        type:String,
    },
    username:{
        type:String,
     },
     email:{
        type:String,
     } ,
     password :{
        type:String,
     },
     password_confirmation :{
        type:String,
     },
     t_and_c:{
        type:String,
     },
     profileimage:{
        type:String,
     }
});
var User = module.exports = mongoose.model('User',UserSchema);
module.exports.getUserById = function(id,callback){
    User.findById(id, callback);
}
module.exports.getUserByUsername = function(username,callback){
var query = {username:username};
User.findOne(query,callback);
}
module.exports.comparePassword = function(candidatePassword,hash,callback){
   bcrypt.compare(candidatePassword,hash,function(err,isMatch){
     callback(null,isMatch);
   });
   }
module.exports.createUser = function(newUser,callback){
   bcrypt.genSalt(10,function(err,salt){
   bcrypt.hash(newUser.password,salt,function(err,hash){
     newUser.password = hash;
      newUser.save(callback);
   });
   });
}




module.exports.createUser = function(newpostUser,callback){
 
   newpostUser.save(callback);
   }


