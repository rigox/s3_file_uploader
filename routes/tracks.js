const express = require("express")
const router =   express.Router()
const {uploadTrack }    =  require('../controllers/tracks') 

router
    .route('/')
       .post(uploadTrack)



module.exports =  router;