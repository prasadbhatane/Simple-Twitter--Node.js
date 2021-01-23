const route = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

//////////////////////////////////////////////////////////////////////////////////

// Get '/'
route.get('/',(req,res)=>{
    if(req.user){
        res.redirect('/home')
    }
    return res.render('signup',{
        title:'Signup!'
    })
})

// POST '/'
route.post('/',(req,res,next)=>{
    let userData = {
        username: req.body.username,
        email: req.body.email,
        // password must be hashed
        password: req.body.password
    }
    User.create(userData,(err,user)=>{
        if(err) return next(err)
        return res.redirect('/login')
    })
})

//////////////////////////////////////////////////////////////////////////////////

module.exports = route