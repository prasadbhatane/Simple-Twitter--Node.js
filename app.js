const express = require('express')
const mongoose = require('mongoose')
const app = express()
const session = require('express-session')
const passport = require('./passport')
const path = require('path');

//////////////////////////////////////////////////////////////////////////////

app.use(express.json())
app.use(express.urlencoded({extended:true}))

//////////////////////////////////////////////////////////////////////////////////

// mongodb connection
// mongoose.connect('mongodb://localhost:27017/social', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
//     .then(()=>console.log('connected to database...'))
//     .catch(( err => console.log('refused to connect to database....')))
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(()=>console.log('connected to database...'))
    .catch(( err => console.log('refused to connect to database....')))
const db = mongoose.connection
db.on('error', (err)=>{
    console.error(err)
})

//////////////////////////////////////////////////////////////////////////////////

app.use(session({
    secret:'this is the secret key no one can guess',
    resave:false,
    saveUninitialized:true
}))

//////////////////////////////////////////////////////////////////////////////////

app.use(passport.initialize())
app.use(passport.session())

//////////////////////////////////////////////////////////////////////////////////

app.set('view engine','hbs')

//////////////////////////////////////////////////////////////////////////////////

const publicPath = path.resolve(__dirname, 'public');
app.use(express.static(publicPath));

//////////////////////////////////////////////////////////////////////////////////

app.use('/',require('./routes/welcome'))
app.use('/api',require('./routes/api'))
app.use('/profile',require('./routes/profile'))
app.use('/login',require('./routes/login'))
app.use('/logout',require('./routes/logout'))
app.use('/home',require('./routes/home'))
app.use('/explore',require('./routes/explore'))
app.use('/posts',require('./routes/posts'))
app.use('/singlepost',require('./routes/singlepost'))
app.use('/followers',require('./routes/followers'))
app.use('/followings',require('./routes/followings'))
app.use('/create',require('./routes/create'))
app.use('/signup',require('./routes/signup'))

//////////////////////////////////////////////////////////////////////////////////

// Error handler Middleware - Last middle ware
app.use((err,req,res,next)=>{
    console.log(err);
    console.log(res);
    return res.render('error',{
        message:err.message,
        title:'Error Page',
        error:err
    })
})

//////////////////////////////////////////////////////////////////////////////////

app.listen(process.env.PORT || 4444,()=>{
    console.log('Server Started at http://localhost:4444')
})