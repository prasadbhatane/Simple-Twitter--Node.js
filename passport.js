const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const TwitterStrategy = require('passport-twitter').Strategy
const User = require('./models/user')

//////////////////////////////////////////////////////////////////////////////////

passport.use(new LocalStrategy(
    function(username,password,done){
        console.log("Inside local strategy")
        User.findOne({
            $and: [{username:username}, {password:password}]
            },(err,user)=>{
            if(err) return done(err)
            if(!user) return done(null,false)
            return done(null,user)
        })
    }
))

//////////////////////////////////////////////////////////////////////////////////

passport.use(new FacebookStrategy({
    clientID: 'Add your own client ID',
    clientSecret: 'Add your own client secret',
    callbackURL: "http://localhost:4444/login/facebook/callback",
    profileFields: ['id', 'email', 'name', 'displayName']
  },
  async (token, rt, profile, cb) =>{
    let user = await User.findOne({
        fbID: profile.id
    })
    if(user) return cb(null,user)
    user = await User.create({fbID:profile.id, fbToken:token, username:profile.displayName, email:profile.emails[0].value})
    return cb(null,user)
  }
))

//////////////////////////////////////////////////////////////////////////////////

passport.use(new TwitterStrategy({
    consumerKey: "Add your own consumer key",
    consumerSecret: "Add your own consumer secret",
    callbackURL: "http://localhost:4444/login/twitter/callback",
    userProfileURL  : 'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true',
    profileFields: ['id', 'emails', 'name']
    },
    async (token, rt, profile, cb) =>{
        let user = await User.findOne({
            twitterID: profile.id
        })
        if(user) return cb(null,user)
        user = await User.create({twitterID:profile.id, twitterToken:token, username:profile.username, email:profile.emails[0].value})
        return cb(null,user)
    }
))

//////////////////////////////////////////////////////////////////////////////////

// Convert user to user.id
passport.serializeUser((user,cb)=>{
    cb(null,user.id)
})

//////////////////////////////////////////////////////////////////////////////////

// deserialize
passport.deserializeUser((id,cb)=>{
    User.findOne({_id:id},(err,user)=>{
        if(err) return cb(err)
        return cb(null,user)
    })
})

//////////////////////////////////////////////////////////////////////////////////

module.exports = passport
