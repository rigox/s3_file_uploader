const express =  require("express")
const router =   express.Router()
const   form = require("formidable");
const AWS  =  require("aws-sdk")
const keys  = require("../keys")
const fs =  require("fs")
AWS.config.update({
    accessKeyId:keys.AWSAccessKeyId,
    secretAccessKey: keys.AWSSecretKey
});


router.post('/',function(req,res){
    const  f = new form.IncomingForm()
    f.parse(req,(err,fields,files)=>{
        if(err){throw err;}
      
      var file_path =  files.file.path
      var file_name =  files.file.name;
      console.log('filePath' , file_name)
      fs.readFile(file_path,function(err,data){
           if(err){throw err}
           var base64data  =  new Buffer(data,'binary');
           var s3  = new AWS.S3();
           const params  ={
                 Bucket:"appfiles01",
                 Key:file_name,
                 Body:base64data
           }
           s3.upload(params,function(err,data){
             if(err){throw err}
             console.log(`File uploaded successfully at ${data.Location}`)
            })
      })
      
      
      });

})


module.exports= router;