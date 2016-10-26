var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var swig = require('swig');
var fs = require('fs');
var flash = require('connect-flash');
var expressSession = require('express-session');
var passport = require('passport');
var moment = require('moment');
var async = require('async');
var google = require('googleapis');
var router = express.Router();
var GoogleStrategy = require( 'passport-google-oauth2').Strategy;
LocalStrategy    = require('passport-local').Strategy;
var mongoose = require('mongoose');
var configAuth = require('./auth.js');
var googleDrive = require('google-drive')

var users = mongoose.model('users');
// used to serialize the user for the session
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    users.findById(id, function(err, user) {
        done(err, user);
    });
});

// /* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login.html', { title: 'Express' });
});

router.get('/admin/dashboard', isLoggedIn, function(req, res) {
	var month = req.query.month;
	console.log(month);          
    res.render('index.html', { user : req.user });
});

router.get('/admin/dashboard/pieData',isLoggedIn,function(req,res,next){
	var pieJson = {"inStoreSales": "30",'downloadSales':'12','mailOrderSales':'20'}
	res.send(pieJson);
})

router.get('/auth/login',
  passport.authenticate('google', { scope: 
  	[ 'https://www.googleapis.com/auth/plus.login',
  	, 'https://www.googleapis.com/auth/plus.profile.emails.read','https://www.googleapis.com/auth/drive.appdata' ] }
));

router.get( '/auth/google/callback', 
    passport.authenticate( 'google', { 
        successRedirect: '/admin/dashboard',
        failureRedirect: '/auth/google/failure'
}));

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

passport.use(new GoogleStrategy({

    clientID        : configAuth.googleAuth.clientID,
    clientSecret    : configAuth.googleAuth.clientSecret,
    callbackURL     : configAuth.googleAuth.callbackURL,

},
function(token, refreshToken, profile, done) {


    // make the code asynchronous
    // storeToken(token);
    // User.findOne won't fire until we have all our data back from Google
    process.nextTick(function() {

        // try to find the user based on their google id
        users.findOne({ 'google.id' : profile.id }, function(err, user) {
            if (err)
                return done(err);

            if (user) {
              console.log(profile);
              // users.findOneAndUpdate({'google.id':profile.id},{
              //   $set : {
              //     token : token,
              //     refreshToken : refreshToken
              //   },function(err,data){

              //   }
              // })
                // if a user is found, log them in
                return done(null, user);
            } else {
                            console.log (profile);

                // if the user isnt in our database, create a new user
                var newUser = new users({	
                	// set all of the relevant information
	                google : {
	                	id    : profile.id,
	                	token : token,
	                	refreshToken : refreshToken,
	                	name  : profile.displayName,
	                	email : profile.emails[0].value, // pull the first email
	                  image : profile.photos[0].value
                  }
                });	
                // save the user
                newUser.save(function(err) {
                	console.log("i am here");
                    if (err)
                        {
                        	console.log("i was here",err);
                        	throw err;
                        }
                    return done(null, newUser);
                });
            }
        });
    });

}));

router.get('/list',isLoggedIn,function(req,res,next){
	// listFiles();
http.get({
  hostname: '',
  port: 80,
  path: '/',
  agent: false  // create a new agent just for this one request
}, (res) => {
  // Do stuff with response
});
});



// var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
//     process.env.USERPROFILE) + '/.credentials/';
//     console.log("TOKEN_DIR");
// var TOKEN_PATH = TOKEN_DIR + 'drive-nodejs-quickstart.json';

// function storeToken(token) {
//   try {
//     fs.mkdirSync(TOKEN_DIR);
//   } catch (err) {
//     if (err.code != 'EXIST') {
//       throw err;
//     }
//   }
//   fs.writeFile(TOKEN_PATH, JSON.stringify(token));
//   console.log('Token stored to ' + TOKEN_PATH);
// }

// function listFiles(auth) {
//   var service = google.drive('v3');
//   service.files.list({
//     auth: auth,
//     pageSize: 10,
//     fields: "nextPageToken, files(id, name)"
//   }, function(err, response) {
//     if (err) {
//       console.log('The API returned an error: ' + err);
//       return;
//     }
//     var files = response.files;
//     if (files.length == 0) {
//       console.log('No files found.');
//     } else {
//       console.log('Files:');
//       for (var i = 0; i < files.length; i++) {
//         var file = files[i];
//         console.log('%s (%s)', file.name, file.id);
//       }
//     }
//   });
// }

function isLoggedIn(req, res, next) {
	// console.log(req.user,"Asdasd",req.isAuthenticated);
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}


 module.exports = router;
