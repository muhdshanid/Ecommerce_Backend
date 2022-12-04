const User = require("../models/UserModel");
const ErrorHandler = require("../utils/ErrorHandler.js");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { json } = require("express");
const sendToken = require("../utils/jwttoken");
const sendMail = require("../utils/SendMail")
const crypto = require("crypto")

//register user 

exports.createUser = catchAsyncErrors (async(req,res,next) => {
    const {name,email,password} = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar:{
            public_id:"https://test",
            url:"https://text.com"
        }
    })

    sendToken(user,200,res)

})


// login user

exports.loginUser = catchAsyncErrors( async(req,res,next) => {
    const {email,password} = req.body;
    if(!email || !password){
        return next(new ErrorHandler("please enter your email & password",400))
    }

    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("User is not found with this email&password",401))
    }

    const isPasswordMatched = await user.comparePasword(password.toString());

    if(!isPasswordMatched){
        return next(new ErrorHandler("User is not found with this email&password",401))
    }

   sendToken(user,200,res)

})

// logout user 

exports.logoutUser = catchAsyncErrors(async (req,res,next) => {
    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true,
    });

    res.status(200).json({
        success:true,
        message:"Logout Success"
    })
});

//forgot password 

exports.forgotPassword = catchAsyncErrors(async (req,res,next) => {
    const user = await User.findOne({email:req.body.email})

    if(!user) {
        return next(new ErrorHandler("User not found with this email",404))
    }

    // get resetpasswordtoken
    const resetToken = user.getResetToken();

    await user.save({
        validateBeforeSave:false
    });

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`

    const message= `Your password reset token is :- /n/n ${resetPasswordUrl}`;

    try {
        
        await sendMail({
            email:user.email,
            subject:"ecommerce password",
            message,
        })

        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} successfully`
        })
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordTime = undefined

        await user.save({
            validateBeforeSave:false
        })

        return next(new ErrorHandler(error.message))
    }
})

// reset password

exports.resetPassword = catchAsyncErrors(async (req,res,next) => {

    //create token hash

    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordTime:{ $gt:Date.now()}
    });

    if(!user){
        return next(new ErrorHandler("Reset password url is invalid or has been expired",400))
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Password is not matched with the new password",400))
    }

    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordTime = undefined;
    
    await user.save();

    sendToken(user,200,res);
})

// get user details 

exports.userDetails = catchAsyncErrors(async (req,res,next) => {

    const user = await User.findById(req.user.id)

    res.status(200).json({
        success:true,
        user
    })
})


// update user password

exports.updateUserPassword = catchAsyncErrors(async (req,res,next) => {

    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePasword(req.body.oldPassword.toString());

    if(!isPasswordMatched){
        return next(new ErrorHandler("Old password is incorrect",401))
    };

    if(req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("password not matched with each other",400))
    }

    user.password = req.body.newPassword;
    await user.save();

    sendToken(user,200,res)
})


// update user profile

exports.updateProfile = catchAsyncErrors(async (req,res,next)=> {
    const newUserData = {
        name:req.body.name,
        email:req.body.email
    }
    // we add cloundinary later then we are giving condition for the avatar

    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        userFindAndModify:false
    });

    res.status(200).json({
        success:true,

    })
})


//get all users  ---admin 

exports.getAllUsers = catchAsyncErrors(async(req,res,next)=>{
    const users = await User.find();
    res.status(200).json({
        success:true,
        users
    })
})

//get single user details --admin

exports.getSingleUser = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler("No user found with this id",400));
    }
    res.status(200).json({
        success:true,
        user
    })
})

//change user role


exports.updateUserRole = catchAsyncErrors(async (req,res,next)=> {
    const newUserData = {
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }
    // we add cloundinary later then we are giving condition for the avatar

    const user = await User.findByIdAndUpdate(req.params.id,newUserData,{
        new:true,
        runValidators:true,
        userFindAndModify:false
    });

    res.status(200).json({
        success:true,

    })
})

// delete user --admin

exports.deleteUser = catchAsyncErrors(async (req,res,next)=> {
    
    // we remove cloundinary later then we are giving condition for the avatar

    const user = await User.findById(req.params.id);

    if(!user) {
        return next(new ErrorHandler("user is not found with this id",400))
    }

    await user.remove();

    res.status(200).json({
        success:true,
        message:"User deleted successfully"
    })
})