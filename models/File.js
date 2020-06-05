const mongoose =  require("mongoose")
const Schema =  mongoose.Schema


const trackSchema =  new Schema({
   
     name:{
          type:String,
           required:[true,'name is required']
     },
     description:{
          type:String
     },
     filePath:{
          type:String
     },
     artWorkPath:{
       type:String
     },
     genre:{
        type:String
      },
      artist:{
        type:String
      },
      createdAt:{
        type:Date,
        default: Date.now()
      },
      
      
      
     

     
})



module.exports =  mongoose.model('tracks',trackSchema)