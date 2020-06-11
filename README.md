# MUSIC API
##  aws  setup
1. this is a simple API that uses CRUD operationsto interact with auido files
2. S3 is used as the storage location for the audio files and the artwork
3. Cloudfront and router53 are used to deliver the  songs static content
4. SSl is impleented using AWS certificate manager
5. CLOUDFRONT usage will only be used temporarly in order to avoid aws charges

## NGINX setup
 <p>the api will be hosted in an  instance and nginx will be used as a reverse proxy</p>
