var express = require('express')
var app = express()
app.use(express.static(__dirname + '/public'));

/** Express Session Setup **/
var session = require('express-session')
app.sessionMiddleware = session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
})
app.use(app.sessionMiddleware)

/** End Express Session Setup **/


/** Body Parser Setup **/
var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
/** End Body Parser Setup **/

/** Database setup **/
var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/jail')

var userSchema = mongoose.Schema({
    username : { type: String, required: true, unique: true },
    password : { type: String, required: true },
    role     : { type: String, required: true },
});
var User = mongoose.model('user', userSchema);
/** End database setup **/


/** Passport Config **/
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

// When someone tries to log in to our site, how do we determine that they are who they say they are?
var bcrypt = require('bcryptjs')
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return (done(err)) }
      if (!user) { return (done(null, false))}
      bcrypt.compare(password, user.password, function(err, matched) {
        if(matched) {
          return done(null, user)
        }
        else {
          return done(null, false)
        }
      })
    })
  }
));
//  start middleware
app.isAuthenticated = function(req, res, next){
    if(req.isAuthenticated()) {
      return next()
    }
    else {
      res.sendFile('/html/forbidden.html', {root: './public'})
    }
}
app.isWarden = function(req, res, next) {
  if(req.user.role !== 'warden') {
    res.sendFile('/html/forbidden.html', {root: './public'})
  }
  else {
    return next()
  }
}
app.isPrisoner = function(req, res, next) {
  if(req.user.role == 'prisoner') {
    res.sendFile('/html/forbidden.html', {root: './public'})
  }
  else {
    return next()
  }
}
app.isEve = function(req, res, next) {
  if(req.user.role === 'visitor') {
    res.sendFile('/html/forbidden.html', {root: './public'})
  }
  else if (req.user.role === 'prisoner' && req.user.username !== 'eve') {
    res.sendFile('/html/forbidden.html', {root: './public'})
  }
  else {
    return next()
  }
}
app.isMallory = function(req, res, next) {
  if(req.user.role === 'visitor') {
    res.sendFile('/html/forbidden.html', {root: './public'})
  }
  else if (req.user.role === 'prisoner' && req.user.username !== 'mallory') {
    res.sendFile('/html/forbidden.html', {root: './public'})
  }
  else {
    return next()
  }
}
app.isVisitor = function(req, res, next) {
  if(req.user.role === 'visitor') {
    res.sendFile('/html/forbidden.html', {root: './public'})
  }
  else {
    return next()
  }
}
// end middleware
// begin routes
app.post('/signup', function(req, res){
    bcrypt.genSalt(11, function(error, salt){
        bcrypt.hash(req.body.password, salt, function(hashError, hash){
            var newUser = new User({
                username : req.body.username,
                role     : req.body.role,
                password : hash,
            });
            newUser.save(function(saveErr, user){
                if ( saveErr ) { res.send({ err:saveErr }) }
                else {
                    req.login(user, function(loginErr){
                        if ( loginErr ) { res.send({ err:loginErr }) }
                        else { res.redirect('/jail') }
                    })
                }
            })
        })
    })
})

app.post('/login', function(req, res, next){
    passport.authenticate('local', function(err, user, info) {
      if(err) { return next(err) }
      if(!user) { return res.send({error: 'Please try again'}) }
      req.login(user, function(err) {
        if(err) { return next(err) }
        return res.send({success: 'Success!'})
      })
    })(req, res, next)
})

app.get('/', function(req, res){
    res.sendFile('/html/login.html', {root: './public'})
})
app.use(app.isAuthenticated)
app.get('/api/me', function(req,res){
    res.send(req.user)
})
app.get('/jail', function(req, res){
    res.sendFile('/html/jail.html', {root: './public'})
})
app.get('/lobby', app.isPrisoner, function(req, res){
    res.sendFile('/html/lobby.html', {root: './public'})
})
app.get('/visitors-lounge', app.isPrisoner, function(req, res){
    res.sendFile('/html/visitors-lounge.html', {root: './public'})
})
app.get('/cafeteria', app.isVisitor, function(req, res){
    res.sendFile('/html/cafeteria.html', {root: './public'})
})
app.get('/wardens-office', app.isWarden, function(req, res){
    res.sendFile('/html/wardens-office.html', {root: './public'})
})
app.get('/cell-e', app.isEve, function(req, res){
    res.sendFile('/html/cell-e.html', {root: './public'})
})
app.get('/cell-m', app.isMallory, function(req, res){
    res.sendFile('/html/cell-m.html', {root: './public'})
})
// end routes

app.listen(3000)
