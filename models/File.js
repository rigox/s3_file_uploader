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
       type:String,
       default:'none'
     },
     genre:{
        type:String
      },
      artist:{
        type:String
      },
      subPath:{
        type:String,
        default:'none'
      },
      artsubPath:{
        type:String,
      },
      createdAt:{
        type:Date,
        default: Date.now()
      },
      
      
      
     

     
})


trackSchema.pre('save', function(next){
let temp =   this.name.replace(/\s/g, '')
this.name =  temp.toLowerCase();
next()
});

module.exports =  mongoose.model('tracks',trackSchema)