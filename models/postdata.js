var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/Registerdb',{useNewUrlParser: true ,useUnifiedTopology: true,useCreateIndex: true});
var db =  mongoose.connection;
//Schemea
var UserSchema = mongoose.Schema({
    posttitle:{
     type:String,
     index:true
    },
    bodycontent :{
        type:String,
    },
    featureimage:{
        data: Buffer,
        type:String,
     },
     current_date: {
      type:  Date,
      default: Date.now ,
    }
});
var postdata = module.exports = mongoose.model('postdata',UserSchema);

