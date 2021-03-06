var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var passport = require('passport');
var knex = require ('../db/knex');

function Users () {
  return knex('users');
};

function Favorites () {
  return knex('favorites');
};

function generateJWT (user) {
  // this function sets expiration of token to 1000 days
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate()+ 1000);

  //this function below takes two arguments - the payload that will be signed by the JWT + the secret.
  return jwt.sign({
    _id: user[0]._id,
    username: user[0].username,
    email: user[0].email,
    first: user[0].first,
    last: user[0].last,
    exp: parseInt(exp.getTime() / 1000),
  }, process.env.SESSION_SECRET)
};

/* GET users listing. */
router.get('/', function(req, res, next) {
  Users().then(function(users){
    res.json(users);
  });
});

router.post('/register', function(req, res, next) {
  if(!req.body.username || !req.body.password || !req.body.first || !req.body.last || !req.body.email){
    return res.status(400).json({message: 'You left something blank!'});
  };

  var salt = crypto.randomBytes(16).toString('hex');
  var hash = crypto.pbkdf2Sync(req.body.password, salt, 1000, 64, 'sha512').toString('hex');

  Users().insert({
    username: req.body.username,
    first: req.body.first,
    last: req.body.last,
    email: req.body.email,
    salt: salt,
    hash: hash,
  }, '*').then(function(user){
    res.json({token: generateJWT(user)});
  });
});

router.post('/login', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'You forgot to include either your username or your password!'});
  };

  passport.authenticate('local', function(err, user, info){
    if(err){ return next(err); }

    if(user){
      return res.json({token: generateJWT(user)});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
})

router.get('/allFavs/:user', function(req, res, next){
  var username = req.params.user;
  var favs = [];
  Favorites().where({username: username}).then(function(data){
    for (var i=0; i<data.length; i++) {
      favs.push(data[i].symbol);
    };
    return res.json(favs);
  })
})

router.put('/addFav', function(req, res, next){
  var username = req.body.user;
  var symbol = req.body.symbol;
  Favorites().insert({
    username: username,
    symbol: symbol
  }, '*').then(function(added){
    res.json(added);
  })
})

router.delete('/deleteFav/:username/:symbol', function(req, res, next){
  var username = req.params.username;
  var symbol = req.params.symbol;
  Favorites().where({
    username: username,
    symbol: symbol
  }).del().then(function(){
    res.json(symbol);
  })
})

module.exports = router;
