const   Track =  require("../models/File")
const  fs =  require("fs")
const aws =   require("aws-sdk")
const path  = require("path")


aws.config.update({
    accessKeyId: process.env.accessKeyId,
    secretAccessKey:process.env.secretAccessKey
})
//@Desc creates a track and uploads it to s3
//@Route POST /api/v1/track
//@Access public
exports.uploadTrack =  async(req,res,next)=>{
   try {
    const s3  = new aws.S3()
    let file =  req.files.file
    let file_name = `tracks/${req.body.name}${path.parse(file.name).ext}`
    let file_path = ''
         //check if the audio file exist already
         const track = await Track.findOne({name:req.body.name});
  
         if(track){
            return res.status(400).json({msg:`file ${file.name} already exist`})   
         }

         //check if is and audio file
         if(!file.mimetype.startsWith('audio')){
           return res.status(400).json({msg:'it must be and audio file'})   
         }

          const params = {
              Bucket:process.env.BUCKET_NAME,
              Key: file_name, 
              Body:  file.data,
              ACL:'public-read'
          }    
  
          s3.putObject(params,async(err,data)=>{
               if(err){
                    throw err
                    console.log(err)
               }
               console.log(data)
               file_path  = `${process.env.BUCKET_URI}${file_name}`
               req.body.filePath  = file_path
               
               const record =  await Track.create(req.body)
               res.status(201).json({success:true,data:record})
          })
         
   } catch (err) {
        throw err
        console.log(err)
   }
}


//@Desc add  artwork for the track
//@Route PUT /api/v1/tracks/artwork/
//@access private
exports.uploadArtwork = async(req,res,next)=>{
     try {
        const s3  = new aws.S3()
        // check if the track exists 
         let track  =  await Track.findOne({name:req.body.name})
         if(!track){
             return res.status(403).json({msg:`track ${req.body.name} was not found`})
         }
        const file =  req.files.artwork
         if(!file.mimetype.startsWith('image')){
        return res.status(400).json({msg:'it must be an image file'})   
         }
          
          let key_name =  `artwork/${req.files.artwork.name}`
          let artwork_path = `${process.env.BUCKET_URI}${key_name}`
          
          const  params = {
            Bucket:process.env.BUCKET_NAME,
            Key: key_name, 
            Body:  file.data,
            ACL:'public-read'
          }

          const record =  await s3.putObject(params)

          track  = await Track.findOneAndUpdate(req.body.name,{artworkPath:artworkPath},{new:true,runValidators:true});

          res.status(200).json({
               success:true,
               data: track
          })

        } catch (error) {
         console.log(error)
         throw error
     }
}