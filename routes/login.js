const route = require('express').Router()
const passport = require('passport')

//////////////////////////////////////////////////////////////////////////////////

// GET '/'
route.get('/',(req,res)=>{
    if(req.user){
        res.redirect('/home')
    }
    return res.render('login')
})

// Post '/'
route.post('/',passport.authenticate('local',{
    failureRedirect:'/login',
    successRedirect:'/home'
}))

//////////////////////////////////////////////////////////////////////////////////

// Get '/facebook'
route.get('/facebook',passport.authorize('facebook', { scope : ['email'] }))

// GET '/facebook/callback
route.get('/facebook/callback',passport.authenticate('facebook',{
    failureRedirect:'/login',
    successRedirect:'/home',
    scope: ['email']
}))

//////////////////////////////////////////////////////////////////////////////////

// Get '/twitter'
route.get('/twitter',passport.authenticate('twitter'))

// GET '/twitter/callback
route.get('/twitter/callback',passport.authenticate('twitter',{
    failureRedirect:'/login',
    successRedirect:'/home'
}))

//////////////////////////////////////////////////////////////////////////////////

module.exports = route