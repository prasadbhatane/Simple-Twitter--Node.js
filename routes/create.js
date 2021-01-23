const route = require('express').Router()
const Post = require('../models/posts')

/////////////////////////////////////////////////////////////////////////////////

// Get '/'
route.get('/',async (req,res)=>{
    if(req.user){
        return res.render('create',{
            user:req.user
        })
    }
    else{
        return res.redirect('/login')
    }
})


//////////////////////////////////////////////////////////////////////////////////

// Post '/'
route.post('/',async (req,res,next)=>{
    if(req.user){
        let dt = Date().toLocaleString().split('GMT')[0]
        let postData = {
            authorEmail:req.user.email,
            authorId:req.user._id,
            authorUsername:req.user.username,
            title:req.body.topic,
            content:req.body.content,
            date: dt
        }
        Post.create(postData,(err,user)=>{
            if(err) return next(err)
            return res.redirect('/home')
        })
    }
    else{
        return res.redirect('/login')
    }
})


//////////////////////////////////////////////////////////////////////////////////


module.exports = route