const mongoose = require("mongoose");
const postSchema =new mongoose.Schema({
    userName:{
       type:String,
       required:true
    },
    userImageUrl:{
        type:String
    },
   name:{
       type:String,
       required:[true,"please enter your post name"],
       trim:true
   },
   discription:{
       type:String,
       required:[true,"please enter post discription"],
   },
   price:{
       type:String,
       required:[true,"fill price field"],
       maxLength:[8,"price cannot exceed 8 characters.."]
   },
   ratings:{  
        type:Number,
        default:0
    },
    images:[
       {
         public_id:{
            type:String,
            required:true
         },
         url:{
            type:String,
            required:true
         }
       }
    ],
    category:{
        type:String,
        required:[true,"please enter post category"]
    },
    stock:{
        type:Number,
        // required:[true,"please enter stock quantity.."],
        maxLength:1,
        default:1
    },
    numberOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref:"User",
                required:true,
            },
           name:{
               type:String,
               required:true
           },
           rating:{
               type:Number,
               required:true
           },
           comment:{
               type:String,
               required:true
           }
        }
    ],

    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model("Post",postSchema);