const route = require('express').Router()
const User = require('../models/user')

/////////////////////////////////////////////////////////////////////////////////

// Get '/:id'
route.get('/:id',async (req,res,next)=>{
    if(req.user){
        await User.findById(req.params.id, (err, user)=>{
            if(err||!user) return next(err)
            return res.render('profile', {
                profile:user,
                user:req.user
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