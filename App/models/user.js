const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')

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
    }
})

userSchema.pre('save', async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User