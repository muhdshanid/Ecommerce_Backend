const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter a name of your product"],
        trim:true,
        maxlength:[20,"Product name not exceed than 20 characters"]
    },
    description: {
        type:String,
        required:[true,"Please enter a description of your product"],
        maxlength:[4000,"Description is cannot exceed than 4000 characters"]
    },
    price:{
        type:Number,
        required:[true,"Please enter a price of your product"],
        maxlength:[8,"Price cannot exceed than 8 numbers"]
    },
    discountPrice: {
        type:String,
        required:false,
        maxlength:[4, "Discount price cannot exceed than 4 characters"]
    },
    color:{
        type:String,
    },
    ratings:{
        type:Number,
        default:0
    },
    images: [{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    }],
    category:{
        type:String,
        required:[true,"Please add a category of your product"]
    },
    stock:{
        type:Number,
        required:[true,"Please enter number of stock  your product"],
        maxlength:[3, "Stock  cannot exceed than 3 numbers"]
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref:"User",
                required:false
            },
            name:{
                type:String,
                required:false,
            },
            rating:{
                type:Number,
                required:false
            },
            comment:{
                type:String
            },
            time:{
                type:Date,
                default:Date.now()
            },
        },
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:false
    },
    createAt:{
        type:Date,
        default:Date.now()
    }
})

module.exports = mongoose.model("Product",productSchema);

