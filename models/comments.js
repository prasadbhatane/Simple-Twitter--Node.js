const mongoose = require('mongoose')
var ObjectId = require('mongodb').ObjectID;

///////////////////////////////////////////////////////////////////////////////

const CommentSchema = mongoose.Schema({
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
    parPostId:{
        type:String,
        required:true
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
    curLikeBoolean:{
        type:String
    }
})

////////////////////////////////////////////////////////////////////////////////

CommentSchema.statics.getCommentsByParPostId =  async (id,cb)=>{
    await Comment.find({parPostId:id})
        .exec((err,postsList)=>{
            if(err) return cb(err)
            return cb(null,postsList)
        })
}

////////////////////////////////////////////////////////////////////////////////

CommentSchema.statics.Like =  async (userId, id,cb)=>{
    await Comment.find({_id:id})
        .exec((err,post)=>{
            if(err) return cb(err)
            post[0].curLikeBoolean = 'red'
            post[0].LikedBy.push(userId)
            post[0].save()
            return cb(null,post)
        })
}

////////////////////////////////////////////////////////////////////////////////

CommentSchema.statics.Dislike =  async (userId, id,cb)=>{
    await Comment.find({_id:id})
        .exec((err,post)=>{
            if(err) return cb(err)
            post[0].curLikeBoolean = 'blue'
            post[0].LikedBy.splice(post[0].LikedBy.indexOf(userId),1)
            post[0].save()
            return cb(null,post)
        })
}

////////////////////////////////////////////////////////////////////////////////

CommentSchema.statics.SetLikingBoolean =  async (userId, cb)=>{
    await Comment.find()
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

const Comment = mongoose.model('Comment',CommentSchema)

////////////////////////////////////////////////////////////////////////////////

module.exports = Comment