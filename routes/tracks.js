const express = require("express")
const router =   express.Router()
const {uploadTrack ,uploadArtwork }    =  require('../controllers/tracks') 

router
    .route('/')
       .post(uploadTrack)

router
    .route('/artwork')
        .put(uploadArtwork)


module.exports =  router;