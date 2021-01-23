const route = require('express').Router()
const User = require('../models/user')

//////////////////////////////////////////////////////////////////////////////////

// Get '/'
route.get('/',(req,res)=>{
    if(req.user){
        req.session.destroy(function(err) {
            if(err) return next(err)
            res.redirect('/login');
        })
    }
    return res.render('login')
})


//////////////////////////////////////////////////////////////////////////////////

module.exports = route