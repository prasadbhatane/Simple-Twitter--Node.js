const route = require('express').Router()
const User = require('../models/user')
const Post = require('../models/posts')

/////////////////////////////////////////////////////////////////////////////////

// Get '/:id'
route.get('/:id',async (req,res,next)=>{
    if(req.user){
        await User.findById(req.params.id, (err, user)=>{
            if(err||!user) return next(err)
            Post.getPostsByAuthorId(req.params.id, (err, posts)=>{
                if(err) return next(err)
                return res.render('posts', {
                    profile:user,
                    user:req.user,
                    posts:posts.reverse()
                })
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