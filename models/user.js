const mongoose = require('mongoose')
var ObjectId = require('mongodb').ObjectID;

///////////////////////////////////////////////////////////////////////////////

const UserSchema = mongoose.Schema({
    email:{
        type:String,
        unique:true,
    },
    username:{
        type:String,
        required:true,
    },
    password:{
        type:String
    },
    fbID:{
        type:String
    },
    fbToken:{
        type:String
    },
    twitterID:{
        type:String
    },
    twitterToken:{
        type:String
    },
    followersList:[
        {type:String}
    ],
    followingsList:[
        {type:String}
    ]
})

////////////////////////////////////////////////////////////////////////////////

UserSchema.statics.getUserByEmail =  async (email,cb)=>{
    await User.findOne({email:email})
        .exec((err,user)=>{
            if(err) return cb(err)
            else if(!user){
                let err = new Error('User Not Found!')
                err.status = 401
                return cb(err)
            }
            return cb(null,user)
        })
}

////////////////////////////////////////////////////////////////////////////////

UserSchema.statics.Follow =  async (followerId, followingId, cb)=>{
    
    await User.findOne({_id:followerId})
        .exec(async (err,user)=>{
            if(err) return cb(err)
            else if(!user){
                let err = new Error('User Not Found!')
                err.status = 401
                return cb(err)
            }
            await user.followingsList.push(followingId)
            await user.save()

            User.findOne({_id:followingId})
                .exec( async (err,user1)=>{
                    if(err) return cb(err)
                    else if(!user1){
                        let err = new Error('User Not Found!')
                        err.status = 401
                        return cb(err)
                    }
                    await user1.followersList.push(followerId)
                    await user1.save()
                })
            return cb(null, user)
        })

}

////////////////////////////////////////////////////////////////////////////////

UserSchema.statics.Unfollow =  async (followerId, followingId, cb)=>{
    await User.findOne({_id:followerId})
        .exec(async (err,user)=>{
            if(err) return cb(err)
            else if(!user){
                let err = new Error('User Not Found!')
                err.status = 401
                return cb(err)
            }
            await user.followingsList.splice(user.followingsList.indexOf(followingId), 1)
            await user.save()
            await User.findOne({_id:followingId})
                .exec(async(err,user)=>{
                    if(err) return cb(err)
                    else if(!user){
                        let err = new Error('User Not Found!')
                        err.status = 401
                        return cb(err)
                    }
                    await user.followersList.splice(user.followersList.indexOf(followerId), 1)
                    await user.save()
                })

            
            
            return cb(null, user)
        })

}

////////////////////////////////////////////////////////////////////////////////

const User = mongoose.model('User',UserSchema)

////////////////////////////////////////////////////////////////////////////////

module.exports = User