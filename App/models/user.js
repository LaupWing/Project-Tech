const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    age:{
        type: Number,
        required: true,
        validate(value){
            if(value<18){
                throw new Error('You are to young to be using an dating app')
            }
        }
    },
    minAge:{
        type: Number,
        required: true,
    },
    maxAge:{
        type: Number,
        required: true,
    },
    password:{
        type: String,
        trim: true,
        minlength: 6,
        required: true,
        validate(value){
            const hasNumber = /\d/;
            if(!hasNumber.test(value)){
                throw new Error('Password has to contain at least one number bleep bleep')
            }
        }
    },
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }],
    images:[{
        url:{
            type: String,
            required: true
        },
        mainPicture:{
            type: Boolean,
            required: true
        }
    }],
    seen:[{
        _id:false,
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        status:{
            type: String,
            enum: ['pending', 'denied', 'accepted'],
            required:true
        },
        clicked:{
            type: Boolean,
            default: false,
            required:true
        },
    }],
    deniedList:[{
        _id:false,
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            required: true
        }
    }],
    acceptedList:[{
        _id:false,
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            required: true
        }
    }]
})

userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign(
        {
            _id:user._id.toString()
        }, process.env.JWT_SECRET, 
        {
            expiresIn: '7 days'
        })
    user.tokens = user.tokens.concat({token})
    user.save()
    return token
}

userSchema.statics.findByCredentials = async (email,password)=>{
    const user = await User.findOne({email})
    if(!user){
        throw new Error('Given info is invalid')
    }
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new Error('Given info is invalid')
    }
    return user
}

userSchema.pre('save', async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User