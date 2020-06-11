const express = require("express")
const router =   express.Router()
const {uploadTrack ,uploadArtwork 
    ,getTrack ,getTrackInfo,deleteTrack,
    getTrackArtwork, getAllTracks}    =  require('../controllers/tracks') 

router
    .route('/')
       .get(getAllTracks)
       .post(uploadTrack)

router 
    .route("/:name")
        .get(getTrack)
        .delete(deleteTrack)

router
    .route('/artwork')
        .put(uploadArtwork)

router
    .route('/artwork/:name')
        .get(getTrackArtwork)


router
    .route('/info/:name')
        .get(getTrackInfo)

router
module.exports =  router;