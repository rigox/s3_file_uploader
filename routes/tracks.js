const express = require("express")
const router =   express.Router()
const {uploadTrack ,uploadArtwork ,getTrack ,getTrackInfo}    =  require('../controllers/tracks') 

router
    .route('/')
       .post(uploadTrack)

router
    .route('/artwork')
        .put(uploadArtwork)

router
    .route('/info')
        .get(getTrackInfo)

module.exports =  router;