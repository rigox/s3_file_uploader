const express =  require("express");
const cors =  require("cors")
const colors =  require("colors")
const  morgan =   require("morgan")
const db =   require("./config/db");
const dotenv  =  require("dotenv")
const expressFileUploader =  require("express-fileupload")
const  app =  express()

//load enviroment variables
dotenv.config({path:'./config/config.env'})

//connect toDB 
db()



//middleware
app.use(express.json(), express.urlencoded({limit: "5000mb",extended:true,parameterLimit:500000000}))
app.use(cors())

//setup morgan
if(process.env.NODE_ENV === "development"){
       app.use(morgan())
}

//add files to the request object
app.use(expressFileUploader())


//load rotutes 
const tracks =  require('./routes/tracks')
//setup routes
app.use('/api/v1/tracks',tracks)

const PORT = process.env.PORT || 5000 

const server = app.listen(PORT , ()=>{
      console.log(`listening on PORT ${PORT}`.green)
});


// Handle unhandled promise rejections
process.on('unhandledRejection',(err,promise)=>{
      console.log(`Error: ${err.message}`.red.bold);
      //close server and exit process
      server.close(()=>{process.exit(1)});
});