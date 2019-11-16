var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest:'./uploads'});
var passport = require('passport');
var LocalStrategy =require('passport-local').Strategy;
var User  =  require('../models/user')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
// router.get('/dashboard', function(req, res, next) {
//   res.render('dashboard');
// });
router.get('/dashboard',ensureAuthenticated, function(req, res, next) {
  res.render('dashboard', { title: 'Express' });
});
function ensureAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/users/logout');
}

router.get('/login', function(req, res, next) {
  res.render('login');
});
router.post('/login',passport.authenticate('local',{failureRedirect:'/users/login',
failureFlash:'Invaild username or password'}),function(req, res){
  req.flash('success','you are now logged in');
  res.redirect('dashboard');

});
passport.serializeUser(function(user,done){
done(null,user.id);
});
passport.deserializeUser(function(id,done){
  User.getUserById(id,function(err,user){
    done(err,user);
  });
  });
passport.use(new LocalStrategy(function(username,password,done){
User.getUserByUsername(username,function(err,user){
  if(err)
  throw err;
  if(!user){
    return done(null,false,{message:'Unkown User'});
  }
  User.comparePassword(password,user.password,function(err,isMatch){
   if(err) return done(err);
   if(isMatch){
     return done(null,user)
   }else{
     return done(null,false,{message:'password not match'})
   }
  });
});
}));
router.get('/register', function(req, res, next) {
  res.render('register');
});
router.post('/register', upload.single('profileimage'),function(req, res, next) {
  var first_name = req.body.first_name;
  var last_name = req.body.last_name;
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  var password_confirmation = req.body.password_confirmation;
  var t_and_c = req.body.t_and_c;
  
  if(req.file){
    console.log('Uploading File');
    var profileimage = req.file.filename;
  }
  else{
    console.log('No file Upload');
    var profileimage = noimage.jpg;
  }
  req.checkBody('first_name',    'First Name field is required').notEmpty();
  req.checkBody('last_name',    ' Last  Name field is required').notEmpty();
  req.checkBody('username',  'Display Name field is required').notEmpty();
  req.checkBody('email',        'Email field is required').notEmpty();
  req.checkBody('email',        'Email field is required').isEmail();
  req.checkBody('password',     'password field is required').notEmpty();
  req.checkBody('password',     'password field is required').isLength({min:5});
  req.checkBody('password_confirmation','password_confirmation field is required').equals(req.body.password);
  var errors = req.validationErrors();
  if(errors){
    console.log('Error');
    res.render('register',{ errors:errors});
  }else{
    var newUser = new User({
      first_name:first_name,
      last_name:last_name,
      username:username,
      email:email,
      password:password,
      profileimage:profileimage,
      t_and_c:t_and_c
    });
     
    User.createUser(newUser,function(err,user){
      if(err)
      throw err;
      // console.log(user)
    });
    req.flash('success','Succesfully Loged in')
    res.location('login');
    res.redirect('login');
  }
});

router.get('/logout',function(req ,res){
  req.logOut();
  req.flash('Success','You are now Logged out');
  res.redirect('/users/register');
});

module.exports = router;
