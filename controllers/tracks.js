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
    let subPath = req.body.name.replace(/\s/g,'')
    subPath  = subPath.toLowerCase()
    let file_name = `tracks/${subPath}${path.parse(file.name).ext}`
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
              ACL:'public-read',
              ContentType:file.mimetype

          }    
  
          s3.putObject(params,async(err,data)=>{
               if(err){
                    throw err
                    console.log(err)
               }
               console.log(data)
               file_path  = `${process.env.BUCKET_URI}${file_name}`
               req.body.filePath  = file_path
               req.body.subPath =   file_name
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
          let name =  req.files.artwork.name.replace(/\s/g, '');
          name =  name.toLowerCase()
          let key_name =  `artwork/${name}`
          let artwork_path = `${process.env.BUCKET_URI}${key_name}`
          
          const  params = {
            Bucket:process.env.BUCKET_NAME,
            Key: key_name, 
            Body:  file.data,
            ACL:'public-read',
           ContentType:file.mimetype
          }

           s3.putObject(params, async(err,data)=>{
                if(err){ throw err }

                track  = await Track.findOneAndUpdate({name:req.body.name},{artWorkPath:artwork_path,artsubPath:key_name},{new:true,runValidators:true});

                res.status(200).json({
                    success:true,
                    data: track
                })
           })

        } catch (error) {
         console.log(error)
         throw error
     }
}


//@Desc Gets  the tracks audio file
//@Route GET /api/v1/tracks/artwork/
//@access private
exports.getTrack  =  async(req,res,next)=>{
     try {
        const track   = await Track.findOne({name:req.params.name})
        if(!track ){
       return res.status(400).json({msg:`track ${req.params.name} was ot found`})   
        }
        console.log('here'.blue,track.filePath)
        const s3 = new aws.S3()
        const params  = {
            Bucket:process.env.BUCKET_NAME,
            Key:track.subPath
        }
        s3.getObject(params,async(err,data)=>{
            if(err){
                console.log(err)
                 throw err

            }
             console.log(data)
             res.status(200)
             res.write(data.Body,'binary')
             res.end(null, 'binary');
             
        })

     } catch (err) {
        console.log(err)
        throw err
     }
}

//@Desc get track info
//@Route GET /api/v1/tracks/info/:name
//@access public
exports.getTrackInfo  =  async(req,res,next)=>{
      try {
          const track =  await  Track.findOne({name:req.params.name})
          if(!track ){
            return res.status(400).json({msg:`track ${req.body.name} was not found`})   
             }
             res.status(200).json({success:true,data:track})
      } catch (error) {
          console.log(error)
      }
}

//@Desc deletes track track and its corresponding artwork
//@Route Delete /api/v1/tracks/:name
//@access public
exports.deleteTrack =  async(req,res,next)=>{
      try {
          const track  = await Track.findOne({name:req.params.name})
          if(!track){
            return res.status(404).json({msg:`file with name ${req.params.name} was not found`})
          }
        const s3 = new aws.S3()
        
       //delete from objects pertaining to track on both artowk and track buckets
        const objects  = [];
        if(track.artsubPath!=='none'){
           
            objects.push({Key:track.artsubPath})
        }
        objects.push({Key:track.subPath});
       const params = {
        Bucket:process.env.BUCKET_NAME,
        Delete:{
            Objects:objects,
            Quiet:false
        }
     }
      
     s3.deleteObjects(params, async(err,data)=>{
          if(err){
               console.log(err)
               res.end()
               throw err

          }
           await track.remove()
           res.status(200).json({msg:"success",data:{}})
     })
       
   

      } catch ( err) {
           console.log(err)
            throw err
      }
}

//@Desc gets the tracks artwork
//@Route GET /api/v1/tracks/artwork/:name
//@access public
exports.getTrackArtwork  =   async(req,res,next)=>{
     try {
          const track =  await Track.findOne({name:req.params.name})
          if(!track){
               return res.status(404).json({msg:`there is no track with the name of ${name}`});
          }
          const s3 = new aws.S3()
          console.log(track)
          const params =  {
               Bucket:process.env.BUCKET_NAME ,
               Key: track.artsubPath
          }

          s3.getObject(params,function(err,data){
                if(err){
                     console.log(err)
                     throw err;
                }
                res.status(200)
                res.write(data.Body,'binary')
                res.end(null, 'binary');
          })
 
     } catch (err) {
            console.log(err)
            throw err
     }

}

//@Desc gets all tracks information
//@Route GET /api/v1/tracks/
//@access public
exports.getAllTracks =  async(req,res,next)=>{
     try {
        const tracks =  await  Track.find({});
        
        res.status(200).json({success:true,lenght:tracks.length,data:tracks})
     
     } catch (err) {
         console.log(err)
        res.startus(500).json({err})
        }
}
