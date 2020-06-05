const   Track =  require("../models/File")
const aws =   require("aws-sdk")

//@Desc creates a track and uploads it to s3
//@Route POST /api/v1/track
//@Access public
exports.uploadTrack =  async(req,res,next)=>{
   try {
    console.log('inside'.yellow)
    res.status(201).json({msg:'track was created'})
   } catch (err) {
        throw err
        console.log(err)
   }
}
