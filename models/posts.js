const mongoose = require('mongoose')
var ObjectId = require('mongodb').ObjectID;

///////////////////////////////////////////////////////////////////////////////

const PostSchema = mongoose.Schema({
    authorEmail:{
        type:String
    },
    authorUsername:{
        type:String,
        required:true,
    },
    authorId:{
        type:String,
        required:true
    },
    title:{
        type:String
    },
    content:{
        type:String,
        required:true
    },
    date:{
        type:String
    },
    LikedBy:[
        {type:String}
    ],
    commentsList:[
        {type:String}
    ],
    curLikeBoolean:{
        type:String
    }
})

////////////////////////////////////////////////////////////////////////////////

PostSchema.statics.getPostsByAuthorId =  async (id,cb)=>{
    await Post.find({authorId:id})
        .exec((err,postsList)=>{
            if(err) return cb(err)
            return cb(null,postsList)
        })
}

////////////////////////////////////////////////////////////////////////////////

PostSchema.statics.Like =  async (userId, id,cb)=>{
    await Post.find({_id:id})
        .exec((err,post)=>{
            if(err) return cb(err)
            post[0].curLikeBoolean = 'red'
            post[0].LikedBy.push(userId)
            post[0].save()
            return cb(null,post)
        })
}

////////////////////////////////////////////////////////////////////////////////

PostSchema.statics.Dislike =  async (userId, id,cb)=>{
    await Post.find({_id:id})
        .exec((err,post)=>{
            if(err) return cb(err)
            post[0].curLikeBoolean = 'blue'
            post[0].LikedBy.splice(post[0].LikedBy.indexOf(userId),1)
            post[0].save()
            return cb(null,post)
        })
}
////////////////////////////////////////////////////////////////////////////////

PostSchema.statics.SetLikingBoolean =  async (userId, cb)=>{
    await Post.find()
        .exec((err,posts)=>{
            if(err) return cb(err)
            for (post of posts){
                if (post.LikedBy.includes(userId)){
                    post.curLikeBoolean = 'red'
                }else{
                    post.curLikeBoolean = 'blue'
                }
                post.save()
            }
            return cb(null,posts)
        })
}

////////////////////////////////////////////////////////////////////////////////

const Post = mongoose.model('Post',PostSchema)

////////////////////////////////////////////////////////////////////////////////

module.exports = Post