const { redirect } = require('statuses')
const User = require('../models/user')
const Post = require('../models/posts')
const route = require('express').Router()

//////////////////////////////////////////////////////////////////////////////////

route.get('/',(req,res)=>{
    if (req.user){
        return res.render('explore',{
            user:req.user
        })
    }
    else{
        res.redirect('/login')
    }
    
})


//////////////////////////////////////////////////////////////////////////////////

module.exports = route