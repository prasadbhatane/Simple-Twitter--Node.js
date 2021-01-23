const route = require('express').Router()
const User = require('../models/user')
const Post = require('../models/posts')

/////////////////////////////////////////////////////////////////////////////////

// Get '/:id'
route.get('/:id',async (req,res,next)=>{
    if(req.user){
        await Post.findById(req.params.id, (err, post)=>{
            if(err||!post) return next(err)
            return res.render('singlepost', {
                user:req.user,
                post:post
            })
        })
    }
    else{
        console.log('inside else');
        return res.redirect('/login')
    }
})

//////////////////////////////////////////////////////////////////////////////////


module.exports = route