const { redirect } = require('statuses')
const User = require('../models/user')
const Post = require('../models/posts')
const Comment = require('../models/comments')
const route = require('express').Router()

//////////////////////////////////////////////////////////////////////////////////

route.get('/comment/:parPostId',async (req,res,next)=>{
    if (req.user){
        await Comment.find((err, posts)=>{
            if(err||!posts) return next(err)
            posts = posts.filter((ele)=>{
                if(String(req.params.parPostId) === String(ele.parPostId)){
                    return true
                }
                else{
                    return false
                }
            })
            return res.send(posts.reverse())
        })
    }
    else{
        res.redirect('/login')
    }
    
})

// Post '/'
route.post('/comment/add/:parPostId',async (req,res,next)=>{
    if(req.user){
        let dt = Date().toLocaleString().split('GMT')[0]
        let postData = {
            authorEmail:req.user.email,
            authorId:req.user._id,
            authorUsername:req.user.username,
            parPostId:req.params.parPostId,
            content:req.body.content,
            date: dt
        }
        Comment.create(postData,(err,user)=>{
            if(err) return next(err)
            // return res.redirect(`/singlepost/${req.params.parPostId}`)
            Post.find({_id:req.params.parPostId})
            .exec((err,posts)=>{
                if(err) return err
                posts[0].commentsList.push(req.body.content)
                posts[0].save()
                return posts
            })
            return res.redirect('/home')
        })
    }
    else{
        return res.redirect('/login')
    }
})


//////////////////////////////////////////////////////////////////////////////////

route.get('/home',async (req,res,next)=>{
    if (req.user){
        await Post.find((err, posts)=>{
            if(err||!posts) return next(err)
            posts = posts.filter((ele)=>{
                if(String(ele.authorId) === String(req.user._id) || req.user.followingsList.includes(ele.authorId)){
                    return true
                }
                else{
                    return false
                }
            })
            return res.send(posts.reverse())
        })
    }
    else{
        res.redirect('/login')
    }
    
})

//////////////////////////////////////////////////////////////////////////////////

route.get('/explore',async (req,res,next)=>{
    if (req.user){
        await Post.find((err, posts)=>{
            if(err||!posts) return next(err)
            return res.send(posts.reverse())
        })
    }
    else{
        res.redirect('/login')
    }
    
})

//////////////////////////////////////////////////////////////////////////////////

route.get('/follow/:followingID',async (req,res,next)=>{
    if (req.user){
        await User.Follow(req.user._id, req.params.followingID, (err, data)=>{
            if(err) return next(err)
            return res.send('success')
            
        })
    }
    else{
        res.redirect('/login')
    }
    
})


//////////////////////////////////////////////////////////////////////////////////

route.get('/unfollow/:followingID',async (req,res,next)=>{
    if (req.user){
        await User.Unfollow(req.user._id, req.params.followingID, (err, data)=>{
            if(err) return next(err)
            return res.redirect(`/followings/${req.user._id}`)
        })
    }
    else{
        res.redirect('/login')
    }
    
})

//////////////////////////////////////////////////////////////////////////////////

route.get('/setlikingboolean',async (req,res,next)=>{
    if (req.user){
        await Post.SetLikingBoolean(req.user._id, async (err, data)=>{
            if(err) return next(err)

            await Comment.SetLikingBoolean(req.user._id, (err, data)=>{
                if(err) return next(err)
                return next(null, data)
            })

            return res.send('success')
        })
        
    }
    else{
        res.redirect('/login')
    }
    
})

//////////////////////////////////////////////////////////////////////////////////

route.get('/like/:postid',async (req,res,next)=>{
    if (req.user){
        await Post.Like(req.user._id, req.params.postid,(err, data)=>{
            if(err) return next(err)
            return res.send('success')
        })
    }
    else{
        res.redirect('/login')
    }
    
})

//////////////////////////////////////////////////////////////////////////////////

route.get('/dislike/:postid',async (req,res,next)=>{
    if (req.user){
        await Post.Dislike(req.user._id, req.params.postid,(err, data)=>{
            if(err) return next(err)
            return res.send('success')
        })
    }
    else{
        res.redirect('/login')
    }
    
})

//////////////////////////////////////////////////////////////////////////////////

route.get('/commentlike/:postid',async (req,res,next)=>{
    if (req.user){
        await Comment.Like(req.user._id, req.params.postid,(err, data)=>{
            if(err) return next(err)
            return res.send('success')
        })
    }
    else{
        res.redirect('/login')
    }
    
})

//////////////////////////////////////////////////////////////////////////////////

route.get('/commentdislike/:postid',async (req,res,next)=>{
    if (req.user){
        await Comment.Dislike(req.user._id, req.params.postid,(err, data)=>{
            if(err) return next(err)
            return res.send('success')
        })
    }
    else{
        res.redirect('/login')
    }
    
})
//////////////////////////////////////////////////////////////////////////////////
route.get('/allusers',async (req,res,next)=>{
    if (req.user){
        await User.find((err, users)=>{
            if(err||!users) return next(err)
            users = users.filter((ele)=>{
                if ((String(ele._id) !== String(req.user._id)) && !(req.user.followingsList.includes(ele._id))){
                    return true
                }
                else{
                    return false
                }
            })
            return res.send(users)
        })
    }
    else{
        res.redirect('/login')
    }
    
})

//////////////////////////////////////////////////////////////////////////////////


module.exports = route