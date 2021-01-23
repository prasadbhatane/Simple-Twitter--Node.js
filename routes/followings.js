const route = require('express').Router()
const User = require('../models/user')

/////////////////////////////////////////////////////////////////////////////////

// Get '/:id'
route.get('/:id',async (req,res,next)=>{
    if(req.user){
        await User.findById(req.params.id, (err, user)=>{
            if(err||!user) return next(err)
            User.find((err, users)=>{
                if(err||!users) return next(err)
                users = users.filter((ele)=>{
                    if ((user.followingsList.includes(ele._id))){
                        return true
                    }
                    else{
                        return false
                    }
                })
                if (String(req.params.id) === String(req.user._id)){
                    return res.render('followings', {
                        profile:user,
                        user:req.user,
                        fList:users
                    })
                }
                return res.render('followings2', {
                    profile:user,
                    user:req.user,
                    fList:users
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